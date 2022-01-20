import { CommonRoutesConfig } from '../common/common.routes.config';
import controller from './controller/dashboard-report.controller';
//import UsersMiddleware from './middleware/big-bazaar.middleware';
import express from 'express';

export class DashboardReportRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'DashboardReportRoutes');
    }

    configureRoutes() {
        this.app
            .route(`/dashboard/report/:userId`)
            .post(controller.getDashboardData)

        this.app
            .route(`/report/purchase-order/:userId`)
            .post(controller.getPurchaseOrderData)

        this.app
            .route(`/email/list/:userId`)
            .get(controller.getAllDistinctEmails)

        this.app
            .route(`/download/purchase-order/:fileName`)
            .get(controller.downloadPurchaseOrderPdf)
        

        return this.app;
    }
}
