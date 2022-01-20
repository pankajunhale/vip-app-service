import express from 'express';
import bigBazaarService from '../services/big-bazaar.service';
import debug from 'debug';
import { FilterPurchaseOrderRequest } from '../../common/filter.purchase-order';
import {Query} from '../../common/interfaces/query.interface';
import { PurchaseOrderDb } from '../../services/purchase.order';
import { BigBazaarPurchaseOrderDto } from '../dto/big-bazaar.purcahse.order.dto';
import fs from 'fs';
import path from 'path';
import { TemplateMapperInfoDto } from '../dto/template-mapper-dto';

const log: debug.IDebugger = debug('app:users-controller');
class BigBazaarController {
    private db = new PurchaseOrderDb();     
    constructor() {

    }
    async listPurchaseOrders(req: express.Request, res: express.Response) {        
        try {
            console.log('started listPurchaseOrders():  ');
            const result = await bigBazaarService.list().then((data) =>{
                return data;
            });
            res.json({data: result});
        } catch (error) {
            const {message} = error as unknown as any;
            res.status(500).send('Error in fetching purchase order master data!' + message);
        }
    }

    async getPurchaseOrderDetailsByMasterId(req: express.Request, res: express.Response) {
        try {
            console.log('started getPurchaseOrderDetailsByMasterId(): ');
            console.log('masterId: ', req.params.masterId);
            const result = await bigBazaarService.listPurchaseOrderDetails(parseInt(req.params.masterId)).then((data) =>{
                return data;
            });
            res.json({data: result});
        } catch (error) {
            const {message} = error as unknown as any;
            res.status(500).send('Error in fetching purchase order details data!' + message);
        }
    }

    async createPurchaseOrder(req: express.Request, res: express.Response) {
        // push data to sql on success and on error
        try {
            const purchaseOrderId = await bigBazaarService.create(req.body);
            res.status(200).send({ data: purchaseOrderId }); 
        } catch (error) {
            res.status(500).send({ error: "some error" }); 
        }
    }

    async removePurchaseOrder(req: express.Request, res: express.Response) {
        log(await bigBazaarService.deleteById(req.body.purchaseOrderId));
        res.status(204).send();
    }

    async getPurchaseOrderMaster(req: express.Request, res: express.Response) {
        // push data to sql on success and on error
        try {
            const {page} = req.query as unknown as Query
            console.log(page);
            const result = await bigBazaarService.getPurchaseOrderMasterByDate(page);
            res.status(200).send({ data: result }); 
        } catch (error) {
            console.log(error);
            const {message} = error as unknown as any;
            res.status(500).send({ error: `Error:- ${message}` }); 
        }
    }

    async processPurchaseOrderJob() {
        // get all open po
        console.log('started processPurchaseOrderJob(): ')
        await this.db.getAllOpenPurchaseOrders().then((response:any) => {
            if(response && response.length > 0) {
                response.map((item: any) => {
                    const directoryPath = path.join(__dirname, '../../../automation/download-po');
                    const fileName = `${directoryPath}\\${item.json_file_name}`;
                        if(fs.existsSync(fileName)) {
                            console.log(fileName,'exist');
                            item.json_file_name = fileName; // new path                            
                            this.processPurchaseOrder(item);
                        }
                        else {
                            console.log('not exist');
                        }
                   });
            }
            else {
                console.log('There are no Jobs to process!');
            }
        });

    }

    async processPurchaseOrder(item: any) {
        try {
            const objPOMaster = new BigBazaarPurchaseOrderDto();
            objPOMaster.Id = item.id;
            objPOMaster.PurchaseOrderMasterId = item.purchase_order_master_id;
            objPOMaster.MesageId = item.message_id;
            objPOMaster.IsPdfConvertedToJson = item.is_pdf_converted_to_json;
            objPOMaster.JsonFile = item.json_file_name;
            objPOMaster.JsonFilePath = item.json_file_path;
            const customer_Id: any = await this.db.getCustomerBySenderEmailId(item.email_from);
            objPOMaster.CustomerId = customer_Id;
            //const templateDetails: Array<TemplateMapperInfoDto> = await this.db.getTemplateDetailsByCustomerId(objPOMaster.CustomerId);
            //objPOMaster.TemplateMappingInformation = templateDetails;
            objPOMaster.TemplateHeaderLabel = await this.db.getTemplateHeaderDetailsByCustomerId(objPOMaster.CustomerId);
            objPOMaster.TemplateItemLabel = await this.db.getTemplateOrderItemDetailsByCustomerId(objPOMaster.CustomerId);
            // do some filtering
            console.log(objPOMaster);
            await bigBazaarService.create(objPOMaster);
        } catch (error) {
            const {message} = error as unknown as any;
            console.log(error, message);
            //throw new Error("Error in processing your request:" + message);
        }
    }

    private getTemplateLabelListByFlag(mapper: any, isHeader: number) {
        const list = mapper.filter((item: any) => {
            return (item.IsHeader === isHeader);
        });
        return list;
    }

    
    
}

export default new BigBazaarController();
