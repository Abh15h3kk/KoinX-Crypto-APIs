import { Request, Response } from 'express';
import axios from 'axios';
import CryptoModel from '../models/CryptoModel';

export default class CryptoController {
  static async fetchCryptoData(req: Request, res: Response): Promise<void> {
    const { ids, currency = 'usd' } = req.query;

    // Ensure `ids` is treated as a comma-separated string of values
    const cryptoIds = (ids as string)?.split(',');

    if (!cryptoIds || cryptoIds.length === 0) {
      res.status(400).json({ error: 'No cryptocurrency IDs provided' });
      return;
    }

    try {
      const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price`, {
        params: {
          ids: cryptoIds.join(','), // Join the array of IDs into a comma-separated string
          vs_currencies: currency,
          include_market_cap: 'true',
          include_24hr_change: 'true',
        }
      });

      const cryptoData = response.data;

      const Crypto = cryptoIds
        .filter((id) => cryptoData[id]) // Filter out missing cryptos
        .map((id) => ({
          name: id,
          price: cryptoData[id][currency], // Use the specified currency
          marketCap: cryptoData[id][`${currency}_market_cap`], // Use the specified currency
          change24h: cryptoData[id][`${currency}_24h_change`], // Use the specified currency
        }));

      if (Crypto.length === 0) {
        res.status(404).json({ error: 'No cryptocurrency data found for the provided IDs' });
        return;
      }

      // Insert the crypto data into the database
      await CryptoModel.insertMany(Crypto, { ordered: false });

      res.status(200).json(Crypto); // Return the inserted data
    } catch (error) {
      console.error('Error fetching or saving crypto data:', error);

      if (error.code === 11000) { // MongoDB duplicate key error code
        res.status(409).json({ error: 'Duplicate entry for one or more cryptocurrencies' });
      } else {
        res.status(500).json({ error: 'Error fetching or saving crypto data' });
      }
    }

    return; // Ensure function returns void after sending the response
  }
}
