export const validateRegister = (req, res, next) => {
  const { email, password, firstName, lastName } = req.body;
  const errors = [];

  if (!email) {
    errors.push('Email jest wymagany');
  }
  
  if (!password) {
    errors.push('Hasło jest wymagane');
  }
  
  if (!firstName) {
    errors.push('Imię jest wymagane');
  }
  
  if (!lastName) {
    errors.push('Nazwisko jest wymagane');
  }

  if (email && !isValidEmail(email)) {
    errors.push('Email ma nieprawidłowy format');
  }

  if (password && !isStrongPassword(password)) {
    errors.push('Hasło musi mieć min. 8 znaków, zawierać wielką literę i cyfrę');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors: errors
    });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email) {
    errors.push('Email jest wymagany');
  }
  
  if (!password) {
    errors.push('Hasło jest wymagane');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors: errors
    });
  }

  next();
};

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isStrongPassword(password) {
  if (password.length < 8) return false;
  if (!/[A-Z]/.test(password)) return false; 
  if (!/[0-9]/.test(password)) return false;
  
  return true;
}