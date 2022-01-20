import express from 'express';
import debug from 'debug';
import fs from 'fs';
import { CustomerDb } from '../../services/customer.db';
import { uploadFileMiddleware } from '../../services/middleware/upload';
import { CustomerValidationInfoDto } from '../dto/customer-validation-info.dto';

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
            res.status(500).send('Error in processing listing customer data!' + message);
        }
    }

    async validateCustomerDomain(req: express.Request, res: express.Response) {
        try {
            console.log('started validateCustomerDomain(): ', req.body);
            const domainName = req.params.domainName;
            const isExist = await new CustomerDb().isCustomerDomainExist(req.body, '').then((data) =>{
                return data;
            });
            res.json({isDomainExist: isExist});
        } catch (error) {
            const {message} = error as unknown as any;
            res.status(500).send('Error in processing inserting data!' + message);
        }
        
    }

    async createCustomer(req: any, res: express.Response) {
        try {
            await uploadFileMiddleware(req, res);
            if (req.file == undefined) {
                return res.status(400).send({ message: "Please upload a file!" });
            }
            const db = new CustomerDb();
            console.log('started createCustomer(): ', JSON.parse(req.body.model));
            const file = req.file;
            const model = JSON.parse(req.body.model);
            model.PurchaseOrderPdfTemplate = `${file.originalname}`;
            file.originalname = model.PurchaseOrderPdfTemplate;            
            // customer validation
            const action = 'CREATE';
            const objErrorMessage = new CustomerValidationInfoDto();
            const isCustomerDuplicate: boolean = await db.isCustomerAlreadyExist(model, action);
            console.log('isCustomerDuplicate:', isCustomerDuplicate);
            if(isCustomerDuplicate) {                
                return res.status(500).send({data: objErrorMessage.getErrorByCode(objErrorMessage.DUPLICATE_CUSTOMER)});
            }
            const isCustomerDomainDuplicate: boolean = await db.isCustomerDomainExist(model, action);
            console.log('isCustomerDomainDuplicate:', isCustomerDomainDuplicate);
            if(isCustomerDomainDuplicate) {    
                if(model.SenderEmailId) {
                    const isCustomerDomainAndSenderEmailValid: boolean = await db.isDomainAndSenderEmailDomainValid(model, action);
                    console.log('isCustomerDomainAndSenderEmailValid:', isCustomerDomainAndSenderEmailValid);
                    if(isCustomerDomainAndSenderEmailValid) {                
                        return res.status(500).send({data: objErrorMessage.getErrorByCode(objErrorMessage.DUPLICATE_SENDER_ID)});
                    } 
                }
                return res.status(500).send({data: objErrorMessage.getErrorByCode(objErrorMessage.DUPLICATE_DOMAIN)});
            }
           
            // add customer
            const customer = await db.insertCustomer(model).then((data) =>{
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
            await uploadFileMiddleware(req, res);
            const model = JSON.parse(req.body.model);
            console.log('started updateCustomer(): ', model);
            const db = new CustomerDb();
             // customer validation
             const action = 'UPDATE';
             const objErrorMessage = new CustomerValidationInfoDto();
             const isCustomerDuplicate: boolean = await db.isCustomerAlreadyExist(model, action);
             console.log('isCustomerDuplicate:', isCustomerDuplicate);
             if(isCustomerDuplicate) {                
                 return res.status(500).send({data: objErrorMessage.getErrorByCode(objErrorMessage.DUPLICATE_CUSTOMER)});
             }
             const isCustomerDomainDuplicate: boolean = await db.isCustomerDomainExist(model, action);
             console.log('isCustomerDomainDuplicate:', isCustomerDomainDuplicate);
             if(isCustomerDomainDuplicate) {    
                 if(model.SenderEmailId) {
                     const isCustomerDomainAndSenderEmailValid: boolean = await db.isDomainAndSenderEmailDomainValid(model, action);
                     console.log('isCustomerDomainAndSenderEmailValid:', isCustomerDomainAndSenderEmailValid);
                     if(isCustomerDomainAndSenderEmailValid) {                
                         return res.status(500).send({data: objErrorMessage.getErrorByCode(objErrorMessage.DUPLICATE_SENDER_ID)});
                     } 
                 }
                 return res.status(500).send({data: objErrorMessage.getErrorByCode(objErrorMessage.DUPLICATE_DOMAIN)});
             }
            const customer = await new CustomerDb().updateCustomerInformaion(model).then((data) =>{
                return data;
            });
            res.json({customer: customer});
        } catch (error) {
            const {message} = error as unknown as any;
            res.status(500).send('Error in updating data!' + message);
        }
        
    }
    
}

export default new CustomerController();
