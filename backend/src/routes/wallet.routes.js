import express from 'express';
import Wallet from '../models/Wallet.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { getCurrentRates } from '../services/nbpService.js';
import db from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.use(authenticateToken);

router.post('/deposit', async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user.userId;  // Z JWT tokenu
    
    if (!amount || isNaN(amount)) {
      return res.status(400).json({
        success: false,
        error: 'Nieprawidłowa kwota'
      });
    }
    
    const depositAmount = parseFloat(amount);
    
    if (depositAmount < 10) {
      return res.status(400).json({
        success: false,
        error: 'Minimalna kwota zasilenia to 10 PLN'
      });
    }
    
    if (depositAmount > 50000) {
      return res.status(400).json({
        success: false,
        error: 'Maksymalna kwota zasilenia to 50 000 PLN'
      });
    }
    
    const wallet = await Wallet.deposit(userId, 'PLN', depositAmount);
    
    const transactionId = uuidv4();
    await db.query(
      `INSERT INTO transactions 
       (id, user_id, transaction_type, to_currency, amount, total_amount, status) 
       VALUES (?, ?, 'DEPOSIT', 'PLN', ?, ?, 'COMPLETED')`,
      [transactionId, userId, depositAmount, depositAmount]
    );
    
    res.status(201).json({
      success: true,
      message: 'Portfel zasilony pomyślnie',
      transaction: {
        id: transactionId,
        type: 'DEPOSIT',
        amount: depositAmount,
        currency: 'PLN'
      },
      wallet: {
        currency: wallet.currency_code,
        balance: parseFloat(wallet.balance),
        updatedAt: wallet.updated_at
      }
    });
    
  } catch (error) {
    console.error('Błąd podczas zasilenia portfela:', error);
    res.status(500).json({
      success: false,
      error: 'Błąd podczas zasilenia portfela'
    });
  }
});

router.get('/balance', async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const wallets = await Wallet.findAllByUser(userId);
    
    const rates = await getCurrentRates();
    
    const totalValuePLN = await Wallet.getTotalValueInPLN(userId, rates);
    
    const formattedWallets = wallets.map(wallet => {
      const balance = parseFloat(wallet.balance);
      let valueInPLN = balance;
      
      if (wallet.currency_code !== 'PLN') {
        const rate = rates.find(r => r.currency_code === wallet.currency_code);
        if (rate) {
          valueInPLN = balance * parseFloat(rate.sell_rate);
        }
      }
      
      return {
        currency: wallet.currency_code,
        balance: balance,
        valueInPLN: parseFloat(valueInPLN.toFixed(2)),
        lastUpdated: wallet.updated_at
      };
    });
    
    res.json({
      success: true,
      totalValuePLN: parseFloat(totalValuePLN.toFixed(2)),
      wallets: formattedWallets,
      rates: rates.map(r => ({
        currency: r.currency_code,
        sellRate: parseFloat(r.sell_rate)
      }))
    });
    
  } catch (error) {
    console.error('Błąd pobierania salda:', error);
    res.status(500).json({
      success: false,
      error: 'Błąd pobierania salda portfela'
    });
  }
});

router.get('/:currency', async (req, res) => {
  try {
    const { currency } = req.params;
    const userId = req.user.userId;
    
    const wallet = await Wallet.findByUserAndCurrency(userId, currency.toUpperCase());
    
    if (!wallet) {
      return res.status(404).json({
        success: false,
        error: `Portfel ${currency.toUpperCase()} nie istnieje`
      });
    }
    
    res.json({
      success: true,
      wallet: {
        currency: wallet.currency_code,
        balance: parseFloat(wallet.balance),
        createdAt: wallet.created_at,
        updatedAt: wallet.updated_at
      }
    });
    
  } catch (error) {
    console.error('Błąd pobierania portfela:', error);
    res.status(500).json({
      success: false,
      error: 'Błąd pobierania portfela'
    });
  }
});

export default router;