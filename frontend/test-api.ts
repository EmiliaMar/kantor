import api from './services/api.js';

async function testAPI() {
  try {
    console.log('test połączenia z API...');
    
    const response = await api.get('/rates/current');
    
    console.log('połączenie działa');
    console.log('kursy:', response.data);
  } catch (error: any) {
    console.error('blad połączenia:', error.message);
  }
}

testAPI();