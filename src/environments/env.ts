import { DevEnvironment } from "./env.dev";
import { ProdEnvironment } from "./env.prod";

export interface Environment {
    db_uri: string
}

export function getEnvironmentVariables() {
    if(process.env.NODE_ENV == 'production') {
        return ProdEnvironment
    }
    return DevEnvironment
}