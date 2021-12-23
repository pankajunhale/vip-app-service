import express from 'express';
import debug from 'debug';
import { MapperManagerDb } from '../../services/mapper-manager.db';

const log: debug.IDebugger = debug('app:manage-mapper-controller');
class MapperManagerController {
    
    async createMapper(req: express.Request, res: express.Response) {
        try {
            console.log('started createMapper(): ', req.body);
            const mapper = await new MapperManagerDb().insertMapperInformation(req.body).then((data) =>{
                return data;
            });
            res.json({mapper: mapper});
        } catch (error) {
            const {message} = error as unknown as any;
            res.status(500).send('Error in processing inserting data!' + message);
        }
        
    }
    
}

export default new MapperManagerController();
