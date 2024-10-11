import { Environment } from "./env";
import { Utils } from "../utils/Utils";

Utils.dotenvConfigs()

export const ProdEnvironment : Environment =  {
    db_uri: process.env.PROD_DB_URI,
}