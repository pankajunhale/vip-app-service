import express from 'express';
import bigBazaarService from '../services/big-bazaar.service';
import debug from 'debug';
import {Query} from '../../common/interfaces/query.interface';
import { PurchaseOrderDb } from '../../services/purchase.order';
import { BigBazaarPurchaseOrderDto } from '../dto/big-bazaar.purcahse.order.dto';
import fs from 'fs';
import myHelper from '../../common/my-helper';
import _, { map } from 'underscore';
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
                    //process.chdir(process.cwd()+ `${BBConstatnts.CUSTOMER_PURCHASE_ORDERS}`);
                    //const directoryPath = path.join(__dirname, `../${BBConstatnts.CUSTOMER_PURCHASE_ORDERS}`);
                    const directoryPath = process.cwd();
                    const fileName = `${directoryPath}\\${item.json_file_path}`;
                    console.log(directoryPath,fileName);
                        if(fs.existsSync(item.json_file_path)) {
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

    // find the valid headers from template
    
    async getPurchaseOrderTemplateHeaderByCount(req: express.Request, res: express.Response): Promise<any> {
        try {
            
            let listOfTableRow: any = [];
            console.log('started getPurchaseOrderTemplateHeaderByCount(): ');
            console.log('count: ', req.params.columnCount);
            const rawPOResult: any = req.body;
            const count = parseInt(req.params.columnCount);
            console.log('body: ', rawPOResult);

            if (rawPOResult && rawPOResult.length >= 2) {                
                _.map(rawPOResult, (item,i: number) => {
                    if (item['extraction_method'] === 'lattice') {
                        _.map(item['data'], (itemInner, j: number) => {
                            let tempArray: Array<any> = [];
                            _.map(itemInner, (row, k: number) => {
                               if (row['text']) {
                                    const obj = {
                                        text: row['text'],
                                        mapperIndex: `${i}-${j}-${k}`
                                    };
                                    tempArray = tempArray.concat(obj);
                               }
                            });
                            const row = {
                                totalColumns: tempArray.length,
                                rowInfo: tempArray
                            }
                            listOfTableRow.push(row);
                        });
                    }
                })
            }
            const uniqueItemData = [...new Set(listOfTableRow.map((item:any) => item.totalColumns))];
            //const rawTableInfo = myHelper.filterRawJsonListByLength(listOfTableRow, count);
            const computedResult: any = [];
            uniqueItemData.map((item: any, index: number) => {
                if(item > 0) {
                    const filteredResult =  listOfTableRow.filter((row: any) => {
                        return (row.totalColumns === item);
                    });
                    const obj = {
                        tabIndex: index,
                        tabId: `tab-${item}`,
                        data: filteredResult
                    }
                    computedResult.push(obj);
                }
            })
            res.status(200).send({ data: computedResult, uniqueIndex: uniqueItemData }); 
        } catch (error) {
            const {message} = error as unknown as any;
            res.status(500).send({ error: `Error:- ${message}` }); 
        }
    }


    async getPurchaseOrderItemsFromTemplate(req: express.Request, res: express.Response): Promise<any> {
        try {
            console.log('started getPurchaseOrderItemsFromTemplate(): ');
            console.log('body: ', req.body);                
            const listOfTableRow: string[] =  req.body.poResult;
            const objPOMaster = new BigBazaarPurchaseOrderDto();
            objPOMaster.TemplateItemLabel = req.body.mapperList;
            const result = bigBazaarService.findPurchaseOrderItemFromTemplate(objPOMaster,listOfTableRow); 
            res.status(200).send({ data: result }); 
        } catch (error) {
            const {message} = error as unknown as any;
            res.status(500).send({ error: `Error:- ${message}` }); 
        }
    }


    
    
}

export default new BigBazaarController();
