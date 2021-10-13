import { CommonRoutesConfig } from '../common/common.routes.config';
import BigBazaarController from './controllers/big-bazaar.controller';
import UsersMiddleware from './middleware/big-bazaar.middleware';
import express from 'express';
import bigBazaarController from './controllers/big-bazaar.controller';

export class BigBazaarRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'BigBazaarRoutes');
    }

    configureRoutes() {
        this.app
            .route(`/purchase-order/list`)
            .get(BigBazaarController.listPurchaseOrders)

        this.app.param(`purchaseOrderId`, UsersMiddleware.extractPurchaseOrderId);
        this.app
            .route(`/purchase-order/details:id`)
            .all(UsersMiddleware.validatePurchaseOrderExists)
            .get(BigBazaarController.getPurchaseOrderById)

        this.app
            .route(`/purchase-order/create`)
            .get(bigBazaarController.createPurchaseOrder)

        this.app
            .route(`/purchase-order/master`)
            .get(bigBazaarController.getPurchaseOrderMaster)

        return this.app;
    }
}
