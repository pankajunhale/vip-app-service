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

    async validatePurchaseOrderExists(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const user = await bigBazaarService.readById(req.params.userId);
        if (user) {
            next();
        } else {
            res.status(404).send({
                error: `Purchase Order ${req.params.purchaseOrderId} not found`,
            });
        }
    }

}

export default new BigBazaarMiddleware();
