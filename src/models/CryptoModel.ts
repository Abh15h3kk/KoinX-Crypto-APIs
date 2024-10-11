import mongoose from 'mongoose';
import {model} from 'mongoose'

const cryptoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  marketCap: { type: Number, required: false },
  change24h: { type: Number, required: false },
});

const Crypto = mongoose.model('Crypto', cryptoSchema);

export default class CryptoModel {
  static async insertMany(cryptos: any[], p0: { ordered: boolean; }) {
    return Crypto.insertMany(cryptos);
  }
}