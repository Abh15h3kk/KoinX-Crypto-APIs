import { query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export class CryptoValidator {

    static validateCryptoIds(){
        return [
            query('ids')
              .exists().withMessage('Cryptocurrency IDs are required')
              .isString().withMessage('Cryptocurrency IDs must be a string'),
            query('currency')
              .optional() // Currency is optional; default will be used if not provided
              .isString().withMessage('Currency must be a string'),
          ]
    }
    }
    