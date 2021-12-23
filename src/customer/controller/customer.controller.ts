import express from 'express';
import debug from 'debug';
import { CustomerDb } from '../../services/customer.db';

const log: debug.IDebugger = debug('app:customer-controller');
class CustomerController {
    
    async getCustomer(req: express.Request, res: express.Response) {
        try {
            console.log('started getCustomer(): ')
            const id = parseInt(req.params.id);
            const list: any = await new CustomerDb().find(id);
            res.status(200).send(list[0]);
        } catch (error) {
            const {message} = error as unknown as any;
            res.status(500).send('Error in processing inserting data!' + message);
        }
        
    }

    async listCustomers(req: express.Request, res: express.Response) {
        try {
            console.log('started listCustomers(): ')
            const list = await new CustomerDb().findAll();
            res.status(200).send(list);
        } catch (error) {
            const {message} = error as unknown as any;
            res.status(500).send('Error in processing inserting data!' + message);
        }
    }

    async validateCustomerDomain(req: express.Request, res: express.Response) {
        try {
            console.log('started validateCustomerDomain(): ', req.body);
            const domainName = req.params.domainName;
            const isExist = await new CustomerDb().isCustomerDomainExist(domainName).then((data) =>{
                return data;
            });
            res.json({isDomainExist: isExist});
        } catch (error) {
            const {message} = error as unknown as any;
            res.status(500).send('Error in processing inserting data!' + message);
        }
        
    }

    async createCustomer(req: express.Request, res: express.Response) {
        try {
            console.log('started createCustomer(): ', req.body);
            const customer = await new CustomerDb().insertCustomer(req.body).then((data) =>{
                return data;
            });
            res.json({customer: customer});
        } catch (error) {
            const {message} = error as unknown as any;
            res.status(500).send('Error in processing inserting data!' + message);
        }
        
    }

    async updateCustomer(req: express.Request, res: express.Response) {
        try {
            console.log('started updateCustomer(): ', req.body);
            const customer = await new CustomerDb().updateCustomerInformaion(req.body).then((data) =>{
                return data;
            });
            res.json({customer: customer});
        } catch (error) {
            const {message} = error as unknown as any;
            res.status(500).send('Error in processing inserting data!' + message);
        }
        
    }
}

export default new CustomerController();
