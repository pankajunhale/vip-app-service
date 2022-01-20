import { CommonRoutesConfig } from '../common/common.routes.config';
import customerController from './controller/customer.controller';
//import UsersMiddleware from './middleware/big-bazaar.middleware';
import express from 'express';

export class CustomerRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'CustomerRoutes');
    }

    configureRoutes() {
        this.app
            .route(`/customer/details/:id`)
            .get(customerController.getCustomer)

        this.app
            .route(`/customer/list`)
            .get(customerController.listCustomers)

        this.app
            .route(`/customer/create`)
            .post(customerController.createCustomer)

        this.app
            .route(`/customer/update/:id`)
            .post(customerController.updateCustomer)

        this.app
            .route(`/customer/validation/domain/:domainName`)
            .get(customerController.validateCustomerDomain)

        return this.app;
    }
}
