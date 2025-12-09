import api from './api';

export interface Wallet {
  currency: string;
  balance: number;
  valueInPLN: number;
  lastUpdated: string;
}

export interface WalletBalance {
  totalValuePLN: number;
  wallets: Wallet[];
  rates: {
    currency: string;
    sellRate: number;
  }[];
}

export const getBalance = async (): Promise<WalletBalance> => {
  try {
    console.log('pobieranie portfeli...');
    
    const response = await api.get<WalletBalance>('/wallet/balance');
    
    console.log('portfele pobrane');
    return response.data;
  } catch (error: any) {
    console.error('błąd pobierania portfeli:', error.response?.data);
    throw {
      error: error.response?.data?.error || error.message || 'Błąd pobierania portfeli'
    };
  }
};

export const deposit = async (amount: number) => {
  try {
    if (amount < 10 || amount > 50000) {
      throw { error: 'Amount must be between 10 and 50,000 PLN' };
    }

    console.log('zasilenie portfela:', amount, 'PLN');
    
    const response = await api.post('/wallet/deposit', { amount });
    
    console.log('portfel zasilony');
    return response.data;
  } catch (error: any) {
    console.error('błąd zasilenia:', error.response?.data);
    throw {
      error: error.response?.data?.error || error.message || 'Błąd zasilenia portfela'
    };
  }
};