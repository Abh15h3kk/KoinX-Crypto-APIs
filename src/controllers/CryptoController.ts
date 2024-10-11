import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import CryptoModel from '../models/CryptoModel';

interface CoinGeckoResponse {
  prices: [number, number][]; // Array of tuples, where the first element is the timestamp and the second is the price
}

// Standard Deviation Calculation Function
const calculateStandardDeviation = (prices: number[]): number => {
  const n = prices.length;
  const mean = prices.reduce((sum, price) => sum + price, 0) / n;
  const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / n;
  return Math.sqrt(variance);
};

// Function to fetch crypto data from CoinGecko API
const fetchCryptoDataFromApi = async (cryptoIds: string[], currency: string): Promise<any> => {
  const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
    params: {
      ids: cryptoIds.join(','),
      vs_currencies: currency,
      include_market_cap: 'true',
      include_24hr_change: 'true',
    },
  });
  return response.data;
};

// Function to format crypto data
const formatCryptoData = (cryptoIds: string[], cryptoData: any, currency: string) => {
  return cryptoIds
    .filter(id => cryptoData[id])
    .map(id => ({
      name: id,
      price: cryptoData[id][currency],
      marketCap: cryptoData[id][`${currency}_market_cap`],
      change24h: cryptoData[id][`${currency}_24h_change`],
    }));
};

export default class CryptoController {
  static async fetchCryptoData(req: Request, res: Response, next: NextFunction): Promise<void> {
    const ids = req.query.ids as string;
    const currency = (req.query.currency as string) || 'usd';
    const cryptoIds = ids?.split(',');

    if (!cryptoIds || cryptoIds.length === 0) {
      res.status(400).json({ error: 'No cryptocurrency IDs provided' });
      return; // Ensure we return here to prevent further execution
    }

    try {
      const cryptoData = await fetchCryptoDataFromApi(cryptoIds, currency);
      const Crypto = formatCryptoData(cryptoIds, cryptoData, currency);

      if (Crypto.length === 0) {
        res.status(404).json({ error: 'No cryptocurrency data found for the provided IDs' });
        return; // Ensure we return here to prevent further execution
      }

      res.status(200).json(Crypto);
    } catch (error) {
      next(error); // Pass the error to the global error handler
    }
  }

  static async uploadCryptoData(req: Request, res: Response, next: NextFunction): Promise<void> {
    const ids = req.body.ids as string;
    const currency = (req.body.currency as string) || 'usd';
    const cryptoIds = ids?.split(',');

    if (!cryptoIds || cryptoIds.length === 0) {
      res.status(400).json({ error: 'No cryptocurrency IDs provided' });
      return; // Ensure we return here to prevent further execution
    }

    try {
      const cryptoData = await fetchCryptoDataFromApi(cryptoIds, currency);
      const Crypto = formatCryptoData(cryptoIds, cryptoData, currency);

      if (Crypto.length === 0) {
        res.status(404).json({ error: 'No cryptocurrency data found for the provided IDs' });
        return; // Ensure we return here to prevent further execution
      }

      await CryptoModel.insertMany(Crypto, { ordered: false });
      res.status(200).json(Crypto);
    } catch (error) {
      next(error); // Pass the error to the global error handler
    }
  }

  static async calculatePriceDeviation(req: Request, res: Response, next: NextFunction): Promise<void> {
    const coin = req.query.coin as string;

    if (!coin) {
      res.status(400).json({ error: 'Coin is required' });
      return; // Ensure we return here to prevent further execution
    }

    try {
      const priceRecords = await CryptoModel.findPricesByCoin(coin, 100);
      if (priceRecords.length === 0) {
        res.status(404).json({ error: 'No price data found for the specified coin' });
        return; // Ensure we return here to prevent further execution
      }

      const prices = priceRecords.map(record => record.price);
      const deviation = calculateStandardDeviation(prices);
      res.status(200).json({ deviation: parseFloat(deviation.toFixed(2)) });
    } catch (error) {
      console.error('Error fetching price data from the database:', error);
      next(error); // Pass the error to the global error handler
    }
  }
}
