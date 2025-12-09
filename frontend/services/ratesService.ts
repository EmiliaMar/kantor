// rates service - fetching exchange rates from NBP
import api from "./api";

export interface ExchangeRate {
  currencyCode: string;
  currencyName: string;
  midRate: number;
  buyRate: number;
  sellRate: number;
  date: string;
  lastUpdated: string;
}

// get current rates
export const getCurrentRates = async (): Promise<ExchangeRate[]> => {
  try {
    console.log("pobieranie kursów walut...");

    const response = await api.get("/rates/current");

    console.log("kursy pobrane:", response.data.count);
    return response.data.rates;
  } catch (error: any) {
    console.error("błąd pobierania kursów:", error.response?.data);
    throw error.response?.data || { error: "Błąd pobierania kursów" };
  }
};

// get historical rate
export const getHistoricalRate = async (currency: string, date: string) => {
  try {
    console.log("pobieranie kursu historycznego:", currency, date);

    const response = await api.get(`/rates/historical/${currency}/${date}`);

    console.log("kurs historyczny pobrany");
    return response.data.rate;
  } catch (error: any) {
    console.error("błąd pobierania kursu historycznego:", error.response?.data);
    throw error.response?.data || { error: "Błąd pobierania kursu" };
  }
};

// get historical rates for chart (last N days)
export const getHistoricalRates = async (
  currency: string,
  days: number = 7
) => {
  try {
    console.log(`pobieranie historii ${currency} za ${days} dni...`);

    const rates = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // skip weekends (NBP nie publikuje)
      if (date.getDay() === 0 || date.getDay() === 6) {
        continue;
      }

      const dateString = date.toISOString().split("T")[0];

      try {
        const rate = await getHistoricalRate(currency, dateString);
        rates.push({
          date: dateString,
          rate: rate.midRate,
        });
      } catch (error) {
        console.log(`brak kursu dla ${dateString}`);
      }
    }

    console.log(`pobrano ${rates.length} kursów`);
    return rates;
  } catch (error: any) {
    console.error("błąd pobierania historii:", error);
    throw error;
  }
};
