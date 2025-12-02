import express from "express";
import { getCurrentRates, getHistoricalRate } from "../services/nbpService.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/current", async (req, res) => {
  try {
    const rates = await getCurrentRates();

    const formattedRates = rates.map((rate) => ({
      currencyCode: rate.currency_code,
      currencyName: getCurrencyName(rate.currency_code),
      midRate: parseFloat(rate.mid_rate),
      buyRate: parseFloat(rate.buy_rate),
      sellRate: parseFloat(rate.sell_rate),
      date: rate.rate_date,
      lastUpdated: rate.fetched_at,
    }));

    res.json({
      success: true,
      count: formattedRates.length,
      rates: formattedRates,
    });
  } catch (error) {
    console.error("Błąd pobierania aktualnych kursów:", error);
    res.status(500).json({
      success: false,
      error: "Błąd pobierania kursów walut",
    });
  }
});

router.get(
  "/historical/:currency/:date",
  authenticateToken,
  async (req, res) => {
    try {
      const { currency, date } = req.params;

      const rate = await getHistoricalRate(currency, date);

      if (!rate) {
        return res.status(404).json({
          success: false,
          error: "Brak danych dla wybranej daty",
        });
      }

      res.json({
        success: true,
        rate: {
          currencyCode: rate.currency_code,
          currencyName: getCurrencyName(rate.currency_code),
          midRate: parseFloat(rate.mid_rate),
          buyRate: parseFloat(rate.buy_rate),
          sellRate: parseFloat(rate.sell_rate),
          date: rate.rate_date,
          lastUpdated: rate.fetched_at,
        },
      });
    } catch (error) {
      console.error("Błąd pobierania kursu historycznego:", error);

      if (error.message.includes("Nieobsługiwana waluta")) {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }

      if (error.message.includes("Nieprawidłowy format daty")) {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }

      if (error.message.includes("Brak danych dla wybranej daty")) {
        return res.status(404).json({
          success: false,
          error: "Brak danych NBP dla tej daty (weekend lub święto)",
        });
      }

      res.status(500).json({
        success: false,
        error: "Błąd pobierania kursu historycznego",
      });
    }
  }
);

router.get("/:currency", async (req, res) => {
  try {
    const { currency } = req.params;
    const today = new Date().toISOString().split("T")[0];

    const rate = await getHistoricalRate(currency, today);

    if (!rate) {
      return res.status(404).json({
        success: false,
        error: "Waluta nie znaleziona",
      });
    }

    res.json({
      success: true,
      rate: {
        currencyCode: rate.currency_code,
        currencyName: getCurrencyName(rate.currency_code),
        midRate: parseFloat(rate.mid_rate),
        buyRate: parseFloat(rate.buy_rate),
        sellRate: parseFloat(rate.sell_rate),
        date: rate.rate_date,
        lastUpdated: rate.fetched_at,
      },
    });
  } catch (error) {
    console.error("Błąd pobierania kursu:", error);
    res.status(500).json({
      success: false,
      error: "Błąd pobierania kursu",
    });
  }
});

function getCurrencyName(code) {
  const names = {
    EUR: "Euro",
    USD: "Dolar amerykański",
    GBP: "Funt szterling",
    CHF: "Frank szwajcarski",
  };

  return names[code] || code;
}

export default router;
