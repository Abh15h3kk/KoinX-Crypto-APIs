import  express from 'express';
import * as mongoose from 'mongoose';
import { getEnvironmentVariables } from './environments/env';
import * as bodyParser from "body-parser";
import { Utils } from './utils/Utils';
import CryptoRouter from './routers/CryptoRouter';

export class Server {

public app: express.Application = express()

    constructor() {
        this.setConfigs();
        this.setRoutes();
        this.error404Handler();
        this.handleErrors();

    }

    setConfigs() {
        this.dotenvConfigs()
        this.connectMongoDB()
        this.configureBodyParser()
        this.jsonParser
    }

    dotenvConfigs() {
        Utils.dotenvConfigs()
    }

    connectMongoDB() {
        mongoose.connect(getEnvironmentVariables().db_uri)
        .then(() => {
        console.log('connected to mongodb')
        }) 
    }

    configureBodyParser(){
        this.app.use(bodyParser.urlencoded({
            extended: true
        }
        ))
    }

    jsonParser(){
        this.app.use(express.json());
    }

    setRoutes() {
        this.app.use('/api/crypto', CryptoRouter)
    }

    error404Handler() {
        this.app.use((req,res)=>{
            res.status(404).json({
                message: 'Not found',
                status_code: 404
            }) 
        })
    }

    handleErrors(){
        this.app.use((error,req,res,next) => {
            // This line sets the HTTP status code based on the error object's "errorStatus" property.
            const errorStatus = req.errorStatus || 500
            res.status(errorStatus).json({
                // The response includes a JSON object with a "message" property.
                // If the error has a "message" property, that will be used. Otherwise, it defaults to 'Something went wrong'.
                message: error.message || 'Something went wrong',
                status_code: errorStatus
            })
        })  
    }
}