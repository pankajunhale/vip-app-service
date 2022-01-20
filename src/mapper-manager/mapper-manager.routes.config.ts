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
            .route(`/mapper/details/:customerId`)
            .get(mapperController.getMapperDetails)

        this.app
            .route(`/mapper/template/:customerId/:fileName`)
            .get(mapperController.findPurchaseOrderTemplate)

        this.app
            .route(`/mapper/:customerId/template-output-field/order-details/list`)
            .get(mapperController.getAllTemplateOutputFieldsForDetails)
        
        this.app
            .route(`/mapper/:customerId/template-output-field/order-header/list`)
            .get(mapperController.getAllTemplateOutputFieldsForHeader)

        this.app
            .route(`/mapper/create/header-template-output-field/:customerId`)
            .post(mapperController.createHeaderOutputFieldMapper)
        
        this.app
            .route(`/mapper/create/detail-template-output-field/:customerId`)
            .post(mapperController.createDetailOutputFieldMapper)

        return this.app;
    }
}
