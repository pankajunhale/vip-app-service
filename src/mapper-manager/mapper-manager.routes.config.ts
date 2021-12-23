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
            .route(`/mapper/create`)
            .post(mapperController.createMapper)

        return this.app;
    }
}
