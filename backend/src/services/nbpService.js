import db from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

const SUPPORTED_CURRENCIES = ["EUR", "USD", "GBP", "CHF"];

const NBP_API_BASE = "https://api.nbp.pl/api/exchangerates";

const fetchRateFromNBP = async (currencyCode) => {
  try {
    const response = await fetch(
      `${NBP_API_BASE}/rates/a/${currencyCode}/?format=json`
    );

    if (!response.ok) {
      throw new Error(`NBP API error: ${response.status}`);
    }

    const data = await response.json();

    const rate = data.rates[0];

    return {
      currencyCode: data.code,
      midRate: rate.mid,
      effectiveDate: rate.effectiveDate,
    };
  } catch (error) {
    console.error(
      `Błąd pobierania kursu ${currencyCode} z NBP:`,
      error.message
    );
    throw error;
  }
};

const fetchHistoricalRateFromNBP = async (currencyCode, date) => {
  try {
    const response = await fetch(
      `${NBP_API_BASE}/rates/a/${currencyCode}/${date}/?format=json`
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Brak danych dla wybranej daty (weekend/święto)");
      }
      throw new Error(`NBP API error: ${response.status}`);
    }

    const data = await response.json();
    const rate = data.rates[0];

    return {
      currencyCode: data.code,
      midRate: rate.mid,
      effectiveDate: rate.effectiveDate,
    };
  } catch (error) {
    console.error(
      `Błąd pobierania kursu historycznego ${currencyCode} (${date}):`,
      error.message
    );
    throw error;
  }
};

const calculateRates = (midRate) => {
  const buyRate = midRate * 1.02;

  const sellRate = midRate * 0.98;

  return {
    midRate: parseFloat(midRate.toFixed(6)),
    buyRate: parseFloat(buyRate.toFixed(6)),
    sellRate: parseFloat(sellRate.toFixed(6)),
  };
};

const saveRateToDatabase = async (
  currencyCode,
  midRate,
  buyRate,
  sellRate,
  rateDate
) => {
  try {
    const rateId = uuidv4();

    const [existing] = await db.query(
      "SELECT id FROM exchange_rates WHERE currency_code = ? AND rate_date = ?",
      [currencyCode, rateDate]
    );

    if (existing.length > 0) {
      await db.query(
        `UPDATE exchange_rates 
         SET mid_rate = ?, buy_rate = ?, sell_rate = ?, fetched_at = CURRENT_TIMESTAMP 
         WHERE currency_code = ? AND rate_date = ?`,
        [midRate, buyRate, sellRate, currencyCode, rateDate]
      );

      return existing[0].id;
    } else {
      await db.query(
        `INSERT INTO exchange_rates (id, currency_code, mid_rate, buy_rate, sell_rate, rate_date) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [rateId, currencyCode, midRate, buyRate, sellRate, rateDate]
      );

      return rateId;
    }
  } catch (error) {
    console.error("Błąd zapisywania kursu do bazy:", error);
    throw error;
  }
};

const getRateFromCache = async (currencyCode, date) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM exchange_rates WHERE currency_code = ? AND rate_date = ?",
      [currencyCode, date]
    );

    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Błąd pobierania kursu z cache:", error);
    throw error;
  }
};

export const getCurrentRates = async () => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const rates = [];

    for (const currencyCode of SUPPORTED_CURRENCIES) {
      let rate = await getRateFromCache(currencyCode, today);

      if (!rate) {
        console.log(`Pobieranie kursu ${currencyCode} z NBP...`);

        const nbpRate = await fetchRateFromNBP(currencyCode);
        const calculatedRates = calculateRates(nbpRate.midRate);

        await saveRateToDatabase(
          currencyCode,
          calculatedRates.midRate,
          calculatedRates.buyRate,
          calculatedRates.sellRate,
          nbpRate.effectiveDate
        );

        rate = await getRateFromCache(currencyCode, nbpRate.effectiveDate);
      }

      rates.push(rate);
    }

    return rates;
  } catch (error) {
    console.error("Błąd pobierania aktualnych kursów:", error);
    throw error;
  }
};

export const getHistoricalRate = async (currencyCode, date) => {
  try {
    if (!SUPPORTED_CURRENCIES.includes(currencyCode.toUpperCase())) {
      throw new Error(`Nieobsługiwana waluta: ${currencyCode}`);
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      throw new Error("Nieprawidłowy format daty. Użyj YYYY-MM-DD");
    }

    let rate = await getRateFromCache(currencyCode.toUpperCase(), date);

    if (!rate) {
      console.log(
        `Pobieranie kursu historycznego ${currencyCode} (${date}) z NBP...`
      );

      const nbpRate = await fetchHistoricalRateFromNBP(
        currencyCode.toUpperCase(),
        date
      );
      const calculatedRates = calculateRates(nbpRate.midRate);

      await saveRateToDatabase(
        currencyCode.toUpperCase(),
        calculatedRates.midRate,
        calculatedRates.buyRate,
        calculatedRates.sellRate,
        nbpRate.effectiveDate
      );

      rate = await getRateFromCache(
        currencyCode.toUpperCase(),
        nbpRate.effectiveDate
      );
    }

    return rate;
  } catch (error) {
    console.error("Błąd pobierania kursu historycznego:", error);
    throw error;
  }
};

export const getRateForTransaction = async (currencyCode) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    let rate = await getRateFromCache(currencyCode, today);

    if (!rate) {
      const nbpRate = await fetchRateFromNBP(currencyCode);
      const calculatedRates = calculateRates(nbpRate.midRate);

      await saveRateToDatabase(
        currencyCode,
        calculatedRates.midRate,
        calculatedRates.buyRate,
        calculatedRates.sellRate,
        nbpRate.effectiveDate
      );

      rate = await getRateFromCache(currencyCode, nbpRate.effectiveDate);
    }

    return rate;
  } catch (error) {
    console.error("Błąd pobierania kursu dla transakcji:", error);
    throw error;
  }
};
