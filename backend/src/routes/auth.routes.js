import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { validateRegister, validateLogin } from "../middleware/validation.js";

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
  // TODO: jwt token
  res.json({
    message: "Login endpoint - wkrótce!",
  });
});

router.get("/test", (req, res) => {
  res.json({
    message: "Auth routes działa!",
    timestamp: new Date().toISOString(),
  });
});

export default router;
