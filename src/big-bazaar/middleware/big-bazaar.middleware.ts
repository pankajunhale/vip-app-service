import express from 'express';
import bigBazaarService from '../services/big-bazaar.service';
import debug from 'debug';

const log: debug.IDebugger = debug('app:big-bazaar-controller');
class BigBazaarMiddleware {

    async extractPurchaseOrderId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.id = req.params.purchaseOrderId;
        next();
    }


}

export default new BigBazaarMiddleware();
