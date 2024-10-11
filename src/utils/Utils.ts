import * as dotenv from 'dotenv'
import path = require('path');

export class Utils {
    
    static dotenvConfigs() {
        dotenv.config({ path: path.resolve(process.cwd(), '.env') });
    }
}