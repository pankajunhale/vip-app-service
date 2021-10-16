import express from 'express';
import bigBazaarService from '../services/big-bazaar.service';
import debug from 'debug';
import { FilterPurchaseOrderRequest } from '../../common/filter.purchase-order';
import {Query} from '../../common/interfaces/query.interface';
import { PurchaseOrderDb } from '../../services/purchase.order';
import { BigBazaarPurchaseOrderDto } from '../dto/big-bazaar.purcahse.order.dto';
import fs from 'fs';
import path from 'path';

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
        const db = new PurchaseOrderDb();
        db.getAllOpenPurchaseOrders().then((response:any) => {
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
           })
        })

    }

    async processPurchaseOrder(item: any) {
        try {
            const objPOMaster = new BigBazaarPurchaseOrderDto();
            objPOMaster.Id = item.id;
            objPOMaster.MesageId = item.message_id;
            objPOMaster.IsPdfConvertedToJson = item.is_pdf_converted_to_json;
            objPOMaster.JsonFile = item.json_file_name;
            objPOMaster.JsonFilePath = item.json_file_path;
            const result = await bigBazaarService.create(objPOMaster);
        } catch (error) {
        }
    }
}

export default new BigBazaarController();
