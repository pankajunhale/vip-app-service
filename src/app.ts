import express, { urlencoded } from 'express';
import * as dotenv from "dotenv";
import path from 'path';
import * as http from 'http';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors';
import { CommonRoutesConfig } from './common/common.routes.config';
import { BigBazaarRoutes } from './big-bazaar/big-bazaar.routes.config';
import { CustomerRoutes } from './customer/customer.routes.config';
import { MapperManagerRoutes } from './mapper-manager/mapper-manager.routes.config';
import debug from 'debug';
import cron from 'node-cron';
import bigBazaarController from './big-bazaar/controllers/big-bazaar.controller';
import { DashboardReportRoutes } from './dashboard-report/dashboard-report.routes.config';
dotenv.config();

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const routes: Array<CommonRoutesConfig> = [];
const debugLog: debug.IDebugger = debug('app');

app.use(cors({
    origin: '*'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static('/assets/resources'));
//app.use('/static', express.static('/automation/download-po/'))
const loggerOptions: expressWinston.LoggerOptions = {
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
        winston.format.json(),
        winston.format.prettyPrint(),
        winston.format.colorize({ all: true })
    ),
};

if (!process.env.DEBUG) {
    loggerOptions.meta = false; // when not debugging, make terse
}

app.use(expressWinston.logger(loggerOptions));

routes.push(new BigBazaarRoutes(app));
routes.push(new CustomerRoutes(app));
routes.push(new MapperManagerRoutes(app));
routes.push(new DashboardReportRoutes(app));

const port = process.env.API_PORT;
const runningMessage = `Server running on port:${port}`;
app.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).send(runningMessage + ' : ' + new Date())
});
server.listen(port, () => {
    routes.forEach((route: CommonRoutesConfig) => {
        debugLog(`Routes configured for ${route.getName()}`);
    });
    console.log(runningMessage);
});

cron.schedule('* * * * *',() =>{
    bigBazaarController.processPurchaseOrderJob();
});
