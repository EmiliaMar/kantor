import db from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

const Wallet = {
  findByUserAndCurrency: async (userId, currencyCode) => {
    try {
      const [rows] = await db.query(
        "SELECT * FROM wallets WHERE user_id = ? AND currency_code = ?",
        [userId, currencyCode]
      );

      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error("Błąd w Wallet.findByUserAndCurrency:", error);
      throw error;
    }
  },

  findAllByUser: async (userId) => {
    try {
      const [rows] = await db.query(
        "SELECT * FROM wallets WHERE user_id = ? ORDER BY currency_code",
        [userId]
      );

      return rows;
    } catch (error) {
      console.error("Błąd w Wallet.findAllByUser:", error);
      throw error;
    }
  },

  create: async (userId, currencyCode, initialBalance = 0) => {
    try {
      const walletId = uuidv4();

      await db.query(
        `INSERT INTO wallets (id, user_id, currency_code, balance) 
         VALUES (?, ?, ?, ?)`,
        [walletId, userId, currencyCode, initialBalance]
      );

      return await Wallet.findByUserAndCurrency(userId, currencyCode);
    } catch (error) {
      console.error("Błąd w Wallet.create:", error);
      throw error;
    }
  },

  updateBalance: async (walletId, newBalance) => {
    try {
      await db.query(
        "UPDATE wallets SET balance = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        [newBalance, walletId]
      );

      const [rows] = await db.query("SELECT * FROM wallets WHERE id = ?", [
        walletId,
      ]);

      return rows[0];
    } catch (error) {
      console.error("Błąd w Wallet.updateBalance:", error);
      throw error;
    }
  },

  deposit: async (userId, currencyCode, amount) => {
    try {
      let wallet = await Wallet.findByUserAndCurrency(userId, currencyCode);

      if (!wallet) {
        wallet = await Wallet.create(userId, currencyCode, amount);
      } else {
        const newBalance = parseFloat(wallet.balance) + parseFloat(amount);
        wallet = await Wallet.updateBalance(wallet.id, newBalance);
      }

      return wallet;
    } catch (error) {
      console.error("Błąd w Wallet.deposit:", error);
      throw error;
    }
  },

  withdraw: async (userId, currencyCode, amount) => {
    try {
      const wallet = await Wallet.findByUserAndCurrency(userId, currencyCode);

      if (!wallet) {
        throw new Error(`Portfel ${currencyCode} nie istnieje`);
      }

      const currentBalance = parseFloat(wallet.balance);
      const withdrawAmount = parseFloat(amount);

      if (currentBalance < withdrawAmount) {
        throw new Error(
          `Niewystarczające środki. Dostępne: ${currentBalance} ${currencyCode}`
        );
      }

      const newBalance = currentBalance - withdrawAmount;
      return await Wallet.updateBalance(wallet.id, newBalance);
    } catch (error) {
      console.error("Błąd w Wallet.withdraw:", error);
      throw error;
    }
  },

  findById: async (walletId) => {
    try {
      const [rows] = await db.query("SELECT * FROM wallets WHERE id = ?", [
        walletId,
      ]);

      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error("Błąd w Wallet.findById:", error);
      throw error;
    }
  },

  getTotalValueInPLN: async (userId, rates) => {
    try {
      const wallets = await Wallet.findAllByUser(userId);
      let totalPLN = 0;

      for (const wallet of wallets) {
        const balance = parseFloat(wallet.balance);

        if (wallet.currency_code === "PLN") {
          totalPLN += balance;
        } else {
          const rate = rates.find(
            (r) => r.currency_code === wallet.currency_code
          );
          if (rate) {
            const valueInPLN = balance * parseFloat(rate.sell_rate);
            totalPLN += valueInPLN;
          }
        }
      }

      return totalPLN;
    } catch (error) {
      console.error("Błąd w Wallet.getTotalValueInPLN:", error);
      throw error;
    }
  },
};

export default Wallet;
