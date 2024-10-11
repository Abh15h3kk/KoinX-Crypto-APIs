import { Router } from "express";
import { CryptoValidator } from "../validators/CryptoValidator";
import { GlobalMiddleware } from "../middleware/ErrorHandler";
import CryptoController from "../controllers/CryptoController";

class CryptoRouter {
    public router: Router

    constructor(){
        this.router = Router()
        this.getRoutes()
        this.postRoutes()
        this.patchRoutes()
        this.putRoutes()
        this.deleteRoutes()
    }
    
    getRoutes() {
        this.router.get('/fetch',CryptoValidator.validateCryptoIds(), GlobalMiddleware.checkError, CryptoController.fetchCryptoData)
        this.router.get('/deviation',CryptoValidator.validateDeviation(),GlobalMiddleware.checkError, CryptoController.calculatePriceDeviation)
    }
    postRoutes() {
        this.router.post('/upload',CryptoValidator.validateCryptoAndUpload(), GlobalMiddleware.checkError, CryptoController.uploadCryptoData)
        
    }
    patchRoutes() {
        
    }
    putRoutes() {
        
    }
    deleteRoutes() {
        
    }
}

export default new CryptoRouter().router