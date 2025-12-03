import db from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

const Transaction = {
  create: async (
    userId,
    type,
    fromCurrency,
    toCurrency,
    amount,
    exchangeRate,
    fee,
    totalAmount,
    rateId
  ) => {
    try {
      const transactionId = uuidv4();

      await db.query(
        `INSERT INTO transactions 
         (id, user_id, transaction_type, from_currency, to_currency, amount, exchange_rate, fee, total_amount, rate_id, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'COMPLETED')`,
        [
          transactionId,
          userId,
          type,
          fromCurrency,
          toCurrency,
          amount,
          exchangeRate,
          fee,
          totalAmount,
          rateId,
        ]
      );

      const [rows] = await db.query("SELECT * FROM transactions WHERE id = ?", [
        transactionId,
      ]);

      return rows[0];
    } catch (error) {
      console.error("Błąd w Transaction.create:", error);
      throw error;
    }
  },

  findById: async (transactionId) => {
    try {
      const [rows] = await db.query("SELECT * FROM transactions WHERE id = ?", [
        transactionId,
      ]);

      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error("Błąd w Transaction.findById:", error);
      throw error;
    }
  },

  findAllByUser: async (userId, limit = 20, offset = 0) => {
    try {
      const [rows] = await db.query(
        "SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?",
        [userId, limit, offset]
      );

      return rows;
    } catch (error) {
      console.error("Błąd w Transaction.findAllByUser:", error);
      throw error;
    }
  },

  countByUser: async (userId) => {
    try {
      const [rows] = await db.query(
        "SELECT COUNT(*) as total FROM transactions WHERE user_id = ?",
        [userId]
      );

      return rows[0].total;
    } catch (error) {
      console.error("Błąd w Transaction.countByUser:", error);
      throw error;
    }
  },

  findByUserAndType: async (userId, type, limit = 20) => {
    try {
      const [rows] = await db.query(
        "SELECT * FROM transactions WHERE user_id = ? AND transaction_type = ? ORDER BY created_at DESC LIMIT ?",
        [userId, type, limit]
      );

      return rows;
    } catch (error) {
      console.error("Błąd w Transaction.findByUserAndType:", error);
      throw error;
    }
  },
};

export default Transaction;
