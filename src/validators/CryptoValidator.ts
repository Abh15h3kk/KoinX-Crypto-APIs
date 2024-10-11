import { body, query } from 'express-validator';

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

    static validateCryptoAndUpload(){
        return [
            body('ids')
              .exists().withMessage('Cryptocurrency IDs are required') // Ensure 'ids' is present
              .isString().withMessage('Cryptocurrency IDs must be a string') // Check if 'ids' is a string
              .notEmpty().withMessage('Cryptocurrency IDs cannot be empty'), // Ensure 'ids' is not empty
            body('currency')
              .optional() // Currency is optional; default will be used if not provided
              .isString().withMessage('Currency must be a string'), // Check if 'currency' is a string
          ];
    }

    static validateDeviation() {
        return [
          query('coin')
            .exists().withMessage('Coin is required') // Ensure the coin parameter is provided
            .isString().withMessage('Coin must be a string') // Ensure the coin is a string
            .isLength({ min: 1 }).withMessage('Coin cannot be empty') // Ensure the coin is not empty
        ];
    }
}
    