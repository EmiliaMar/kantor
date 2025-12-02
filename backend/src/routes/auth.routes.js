import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { validateRegister, validateLogin } from "../middleware/validation.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", validateRegister, async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    const existingUser = await User.findByEmail(email);

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Użytkownik z tym emailem już istnieje",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create(
      email,
      hashedPassword,
      firstName,
      lastName
    );

    res.status(201).json({
      success: true,
      message: "Użytkownik zarejestrowany pomyślnie",
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
      },
    });
  } catch (error) {
    console.error("Błąd podczas rejestracji:", error);
    res.status(500).json({
      success: false,
      error: "Błąd serwera podczas rejestracji",
    });
  }
});

router.post("/login", validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Nieprawidłowy email lub hasło",
      });
    }

    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        error: "Konto zostało dezaktywowane",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.hashed_password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Nieprawidłowy email lub hasło",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "24h",
      }
    );

    res.json({
      success: true,
      message: "Zalogowano pomyślnie",
      token: token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Błąd podczas logowania:", error);
    res.status(500).json({
      success: false,
      error: "Błąd serwera podczas logowania",
    });
  }
});

router.get("/me", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Użytkownik nie znaleziony",
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error("Błąd pobierania profilu:", error);
    res.status(500).json({
      success: false,
      error: "Błąd serwera",
    });
  }
});

router.get("/test", (req, res) => {
  res.json({
    message: "Auth routes działają!",
    timestamp: new Date().toISOString(),
  });
});

export default router;
