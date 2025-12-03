import express from 'express';
import Wallet from '../models/Wallet.js';
import Transaction from '../models/Transaction.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { getRateForTransaction } from '../services/nbpService.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/buy', async (req, res) => {
  try {
    const { currencyCode, amount } = req.body;
    const userId = req.user.userId;
    
    if (!currencyCode || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Kod waluty i kwota są wymagane'
      });
    }
    
    const buyAmount = parseFloat(amount);
    
    if (isNaN(buyAmount) || buyAmount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Nieprawidłowa kwota'
      });
    }
    
    const rate = await getRateForTransaction(currencyCode.toUpperCase());
    
    if (!rate) {
      return res.status(404).json({
        success: false,
        error: 'Kurs waluty nie znaleziony'
      });
    }
    
    const sellRate = parseFloat(rate.sell_rate);
    const costInPLN = buyAmount * sellRate;
    const fee = costInPLN * 0.005;
    const totalCost = costInPLN + fee;
    
    if (totalCost < 10) {
      return res.status(400).json({
        success: false,
        error: 'Minimalna wartość transakcji to 10 PLN'
      });
    }
    
    const plnWallet = await Wallet.findByUserAndCurrency(userId, 'PLN');
    
    if (!plnWallet || parseFloat(plnWallet.balance) < totalCost) {
      return res.status(400).json({
        success: false,
        error: `Niewystarczające środki. Potrzebujesz ${totalCost.toFixed(2)} PLN (w tym prowizja ${fee.toFixed(2)} PLN)`
      });
    }
    
    await Wallet.withdraw(userId, 'PLN', totalCost);
    
    await Wallet.deposit(userId, currencyCode.toUpperCase(), buyAmount);
    
    const transaction = await Transaction.create(
      userId,
      'BUY',
      'PLN',
      currencyCode.toUpperCase(),
      buyAmount,
      sellRate,
      fee,
      totalCost,
      rate.id
    );
    
    const updatedPlnWallet = await Wallet.findByUserAndCurrency(userId, 'PLN');
    const foreignWallet = await Wallet.findByUserAndCurrency(userId, currencyCode.toUpperCase());
    
    res.status(201).json({
      success: true,
      message: 'Transakcja kupna zakończona pomyślnie',
      transaction: {
        id: transaction.id,
        type: 'BUY',
        fromCurrency: 'PLN',
        toCurrency: currencyCode.toUpperCase(),
        amount: buyAmount,
        exchangeRate: sellRate,
        costInPLN: parseFloat(costInPLN.toFixed(2)),
        fee: parseFloat(fee.toFixed(2)),
        totalCost: parseFloat(totalCost.toFixed(2)),
        createdAt: transaction.created_at
      },
      wallets: {
        PLN: {
          balance: parseFloat(updatedPlnWallet.balance)
        },
        [currencyCode.toUpperCase()]: {
          balance: parseFloat(foreignWallet.balance)
        }
      }
    });
    
  } catch (error) {
    console.error('Błąd podczas kupna waluty:', error);
    res.status(500).json({
      success: false,
      error: 'Błąd podczas kupna waluty'
    });
  }
});

router.post('/sell', async (req, res) => {
  try {
    const { currencyCode, amount } = req.body;
    const userId = req.user.userId;
    
    if (!currencyCode || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Kod waluty i kwota są wymagane'
      });
    }
    
    const sellAmount = parseFloat(amount);
    
    if (isNaN(sellAmount) || sellAmount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Nieprawidłowa kwota'
      });
    }
    
    const foreignWallet = await Wallet.findByUserAndCurrency(userId, currencyCode.toUpperCase());
    
    if (!foreignWallet || parseFloat(foreignWallet.balance) < sellAmount) {
      return res.status(400).json({
        success: false,
        error: `Niewystarczające środki w portfelu ${currencyCode.toUpperCase()}`
      });
    }
    
    const rate = await getRateForTransaction(currencyCode.toUpperCase());
    
    if (!rate) {
      return res.status(404).json({
        success: false,
        error: 'Kurs waluty nie znaleziony'
      });
    }
    
    const buyRate = parseFloat(rate.buy_rate);
    const valueInPLN = sellAmount * buyRate;
    const fee = valueInPLN * 0.005;
    const totalReceived = valueInPLN - fee;
    
    if (totalReceived < 10) {
      return res.status(400).json({
        success: false,
        error: 'Minimalna wartość transakcji to 10 PLN'
      });
    }
    
    await Wallet.withdraw(userId, currencyCode.toUpperCase(), sellAmount);
    
    await Wallet.deposit(userId, 'PLN', totalReceived);
    
    const transaction = await Transaction.create(
      userId,
      'SELL',
      currencyCode.toUpperCase(),
      'PLN',
      sellAmount,
      buyRate,
      fee,
      totalReceived,
      rate.id
    );
    
    const updatedForeignWallet = await Wallet.findByUserAndCurrency(userId, currencyCode.toUpperCase());
    const plnWallet = await Wallet.findByUserAndCurrency(userId, 'PLN');
    
    res.status(201).json({
      success: true,
      message: 'Transakcja sprzedaży zakończona pomyślnie',
      transaction: {
        id: transaction.id,
        type: 'SELL',
        fromCurrency: currencyCode.toUpperCase(),
        toCurrency: 'PLN',
        amount: sellAmount,
        exchangeRate: buyRate,
        valueInPLN: parseFloat(valueInPLN.toFixed(2)),
        fee: parseFloat(fee.toFixed(2)),
        totalReceived: parseFloat(totalReceived.toFixed(2)),
        createdAt: transaction.created_at
      },
      wallets: {
        [currencyCode.toUpperCase()]: {
          balance: parseFloat(updatedForeignWallet.balance)
        },
        PLN: {
          balance: parseFloat(plnWallet.balance)
        }
      }
    });
    
  } catch (error) {
    console.error('Błąd podczas sprzedaży waluty:', error);
    res.status(500).json({
      success: false,
      error: 'Błąd podczas sprzedaży waluty'
    });
  }
});

router.get('/history', async (req, res) => {
  try {
    const userId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    
    const transactions = await Transaction.findAllByUser(userId, limit, offset);
    const total = await Transaction.countByUser(userId);
    
    const formattedTransactions = transactions.map(t => ({
      id: t.id,
      type: t.transaction_type,
      fromCurrency: t.from_currency,
      toCurrency: t.to_currency,
      amount: parseFloat(t.amount),
      exchangeRate: t.exchange_rate ? parseFloat(t.exchange_rate) : null,
      fee: parseFloat(t.fee),
      totalAmount: parseFloat(t.total_amount),
      status: t.status,
      createdAt: t.created_at
    }));
    
    res.json({
      success: true,
      page: page,
      limit: limit,
      total: total,
      totalPages: Math.ceil(total / limit),
      transactions: formattedTransactions
    });
    
  } catch (error) {
    console.error('Błąd pobierania historii:', error);
    res.status(500).json({
      success: false,
      error: 'Błąd pobierania historii transakcji'
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    
    const transaction = await Transaction.findById(id);
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transakcja nie znaleziona'
      });
    }
    
    if (transaction.user_id !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Brak dostępu do tej transakcji'
      });
    }
    
    res.json({
      success: true,
      transaction: {
        id: transaction.id,
        type: transaction.transaction_type,
        fromCurrency: transaction.from_currency,
        toCurrency: transaction.to_currency,
        amount: parseFloat(transaction.amount),
        exchangeRate: transaction.exchange_rate ? parseFloat(transaction.exchange_rate) : null,
        fee: parseFloat(transaction.fee),
        totalAmount: parseFloat(transaction.total_amount),
        status: transaction.status,
        createdAt: transaction.created_at
      }
    });
    
  } catch (error) {
    console.error('Błąd pobierania transakcji:', error);
    res.status(500).json({
      success: false,
      error: 'Błąd pobierania transakcji'
    });
  }
});

export default router;