import db from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

const User = {
  findByEmail: async (email) => {
    try {
      const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
        email,
      ]);

      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error("Błąd w User.findByEmail:", error);
      throw error;
    }
  },

  findById: async (id) => {
    try {
      const [rows] = await db.query(
        "SELECT id, email, first_name, last_name, role, is_active, created_at FROM users WHERE id = ?",
        [id]
      );

      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error("Błąd w User.findById:", error);
      throw error;
    }
  },

  create: async (email, hashedPassword, firstName, lastName) => {
    try {
      const userId = uuidv4();

      const [result] = await db.query(
        `INSERT INTO users (id, email, hashed_password, first_name, last_name, role) 
         VALUES (?, ?, ?, ?, ?, 'user')`,
        [userId, email, hashedPassword, firstName, lastName]
      );

      return {
        id: userId,
        email,
        first_name: firstName,
        last_name: lastName,
        role: "user",
      };
    } catch (error) {
      console.error("Błąd w User.create:", error);
      throw error;
    }
  },

  findAll: async () => {
    try {
      const [rows] = await db.query(
        "SELECT id, email, first_name, last_name, role, is_active, created_at FROM users"
      );

      return rows;
    } catch (error) {
      console.error("Błąd w User.findAll:", error);
      throw error;
    }
  },
};

export default User;
