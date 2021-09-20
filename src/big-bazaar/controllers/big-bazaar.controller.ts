import express from 'express';
import bigBazaarService from '../services/big-bazaar.service';
import argon2 from 'argon2';
import debug from 'debug';
import { FilterPurchaseOrderRequest } from '../../common/filter.purchase-order';

const log: debug.IDebugger = debug('app:users-controller');
class BigBazaarController {
    
    async listPurchaseOrders(req: express.Request, res: express.Response) {
        const reqObj = new FilterPurchaseOrderRequest();
        const list = await bigBazaarService.list(reqObj);
        res.status(200).send(list);
    }

    async getPurchaseOrderById(req: express.Request, res: express.Response) {
        const obj = await bigBazaarService.readById(req.body.purchaseOrderId);
        res.status(200).send(obj);
    }

    async createPurchaseOrder(req: express.Request, res: express.Response) {
        const purchaseOrderId = await bigBazaarService.create(req.body);
        res.status(201).send({ id: purchaseOrderId });
    }

    async removePurchaseOrder(req: express.Request, res: express.Response) {
        log(await bigBazaarService.deleteById(req.body.purchaseOrderId));
        res.status(204).send();
    }
}

export default new BigBazaarController();
