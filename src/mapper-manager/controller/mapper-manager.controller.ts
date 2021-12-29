import express from 'express';
import debug from 'debug';
import fs from 'fs';
import { MapperManagerDb } from '../../services/mapper-manager.db';

const log: debug.IDebugger = debug('app:manage-mapper-controller');
class MapperManagerController {
    
    async createMapper(req: express.Request, res: express.Response) {
        try {
            console.log('started createMapper(): ', req.body);
            console.log('CustomerId: ', req.params.customerId);
            const mapper = await new MapperManagerDb().insertMapperInformation(req.body).then((data) =>{
                return data;
            });
            res.json({mapper:mapper});
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
            const isHeader = 1;
            const data = await new MapperManagerDb().deleteExistingOutputFields(parseInt(req.params.customerId), isHeader);
            const mapper = await new MapperManagerDb().insertOutputFieldInformation(req.body).then((data) =>{
                return data;
            });
            res.json({mapper:mapper});
        } catch (error) {
            const {message} = error as unknown as any;
            res.status(500).send('Error in processing inserting data!' + message);
        }
        
    }

    async createDetailOutputFieldMapper(req: express.Request, res: express.Response) {
        try {
            console.log('started createDetailOutputFieldMapper(): ', req.body);
            console.log('CustomerId: ', req.params.customerId);
            const isHeader = 0;
            const data = await new MapperManagerDb().deleteExistingOutputFields(parseInt(req.params.customerId), isHeader);
            const mapper = await new MapperManagerDb().insertOutputFieldInformation(req.body).then((data) =>{
                return data;
            });
            res.json({mapper:mapper});
        } catch (error) {
            const {message} = error as unknown as any;
            res.status(500).send('Error in processing inserting data!' + message);
        }
        
    }

    async getAllTemplateOutputFields(req: express.Request, res: express.Response) {
        try {
            console.log('started getAllTemplateOutputFields(): ');
            console.log('CustomerId: ', req.params.customerId);
            const mapper = await new MapperManagerDb().findAllOutputFields(parseInt(req.params.customerId)).then((data) =>{
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
