import express from 'express';
import debug from 'debug';
import fs from 'fs';
import { MapperManagerDb } from '../../services/mapper-manager.db';
import { OutputFieldDto } from '../dto/output-field.dto';

const log: debug.IDebugger = debug('app:manage-mapper-controller');
class MapperManagerController {
    
   
    constructor() {}
    async getMapperDetails(req: express.Request, res: express.Response) {
        try {
            console.log('started getMapperInformation(): ');
            console.log('CustomerId: ', req.params.customerId);
            const mapper = await new MapperManagerDb().find(parseInt(req.params.customerId)).then((data) =>{
                return data;
            });
            res.json({mapperInfo: mapper});
        } catch (error) {
            const {message} = error as unknown as any;
            res.status(500).send('Error in processing fetching output field data!' + message);
        }
        
    }

    async createMapper(req: express.Request, res: express.Response) {
        try {
            console.log('started createMapper(): ', req.body);
            console.log('CustomerId: ', req.params.customerId);
            const db = new MapperManagerDb();
            await new MapperManagerDb().deleteExistingMapperInformation(parseInt(req.params.customerId));
            const mapper = await db.insertMapperInformation(req.body).then((data) =>{
                return data;
            });
            res.json({mapper: mapper});
        } catch (error) {
            const {message} = error as unknown as any;
            res.status(500).send('Error in processing inserting data!' + message);
        }
        
    }

    async findPurchaseOrderTemplate(req: express.Request, res: express.Response) {
        try {
            console.log('started findPurchaseOrderTemplate(): ')
            const id = req.params.customerId;
            const file = req.params.fileName;
            console.debug(id,file);
            fs.readFile(`${file}`, "utf8", (err, jsonString) => {
                if (err) {
                  res.status(500).send(err);
                  return;
                }
                res.status(200).send(jsonString);
              });
        } catch (error) {
            const {message} = error as unknown as any;
            res.status(500).send('Error in processing getting customer PO-Template data!' + message);
        }
        
    }

    async createHeaderOutputFieldMapper(req: express.Request, res: express.Response) {
        try {
            console.log('started createHeaderOutputFieldMapper(): ', req.body);
            console.log('CustomerId: ', req.params.customerId);  
            const db = new MapperManagerDb();          
            const dataForInsert: Array<OutputFieldDto> = db.getOutputFieldDataForSave(req.body, false);
            const dataForUpdate: Array<OutputFieldDto> = db.getOutputFieldDataForSave(req.body, true);
            let insertResult;
            let updateResult;
            const tableColumnCount = req.body.TableColumnCount;
            if(dataForInsert.length) {
                insertResult = await db.insertOutputFieldInformation(dataForInsert,tableColumnCount).then((data) =>{
                    return data;
                });
            }
            if(dataForUpdate.length) {
                updateResult = await db.updateOutputFields(dataForUpdate,tableColumnCount).then((data: any) =>{
                    return data;
                });
            }
            res.json({result:{
                insert: insertResult,
                update: updateResult
            }
            });
        } catch (error) {
            const {message} = error as unknown as any;
            res.status(500).send('Error in processing inserting data!' + message);
        }
        
    }

    async createDetailOutputFieldMapper(req: express.Request, res: express.Response) {
        try {
            console.log('started createDetailOutputFieldMapper(): ', req.body);
            console.log('CustomerId: ', req.params.customerId);   
            const db = new MapperManagerDb();         
            const dataForInsert: Array<OutputFieldDto> = db.getOutputFieldDataForSave(req.body.DetailItems, false);
            const dataForUpdate: Array<OutputFieldDto> = db.getOutputFieldDataForSave(req.body.DetailItems, true);
            let insertResult;
            let updateResult;
            let tableColumnCount: number = 0;
            if(!req.body.TableColumnCount) {
                res.status(500).send('Invalid table column count.');
            }
            try {
                tableColumnCount = parseInt(req.body.TableColumnCount);
            } catch (error) {
                res.status(500).send('Invalid table column count.');
            }
            
            
            if(dataForInsert.length) {
                insertResult = await new MapperManagerDb().insertOutputFieldInformation(dataForInsert,tableColumnCount).then((data) =>{
                    return data;
                });
            }
            if(dataForUpdate.length) {
                updateResult = await db.updateOutputFields(dataForUpdate,tableColumnCount).then((data: any) =>{
                    return data;
                });
            }
            res.json({result:{
                insert: insertResult,
                update: updateResult
            }
            });
        } catch (error) {
            const {message} = error as unknown as any;
            res.status(500).send('Error in processing inserting data!' + message);
        }
        
    }

    async getAllTemplateOutputFieldsForDetails(req: express.Request, res: express.Response) {
        try {
            console.log('started getAllTemplateOutputFieldsForDetails(): ');
            console.log('CustomerId: ', req.params.customerId);
            const mapper = await new MapperManagerDb().findAllOutputFieldsForDetails(parseInt(req.params.customerId)).then((data) =>{
                return data;
            });
            res.json({mapperInfo: mapper});
        } catch (error) {
            const {message} = error as unknown as any;
            res.status(500).send('Error in processing fetching output field data!' + message);
        }
        
    }

    async getAllTemplateOutputFieldsForHeader(req: express.Request, res: express.Response) {
        try {
            console.log('started getAllTemplateOutputFieldsForHeader(): ');
            console.log('CustomerId: ', req.params.customerId);
            const mapper = await new MapperManagerDb().findAllOutputFieldsForHeader(parseInt(req.params.customerId)).then((data) =>{
                return data;
            });
            res.json({mapperInfo: mapper});
        } catch (error) {
            const {message} = error as unknown as any;
            res.status(500).send('Error in processing fetching output field data!' + message);
        }
        
    }

    
    
}

export default new MapperManagerController();
