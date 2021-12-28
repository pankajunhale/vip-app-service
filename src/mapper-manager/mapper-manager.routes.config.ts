import { CommonRoutesConfig } from '../common/common.routes.config';
import mapperController from './controller/mapper-manager.controller';
//import UsersMiddleware from './middleware/big-bazaar.middleware';
import express from 'express';

export class MapperManagerRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'MapperManagerRoutes');
    }

    configureRoutes() {
        this.app
            .route(`/mapper/create/:customerId`)
            .post(mapperController.createMapper)

        this.app
            .route(`/mapper/template/:customerId/:fileName`)
            .get(mapperController.findPurchaseOrderTemplate)

        return this.app;
    }
}
