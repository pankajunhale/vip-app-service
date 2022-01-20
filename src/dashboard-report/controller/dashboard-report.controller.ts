import express from 'express';
import debug from 'debug';
import { DashboardReportDb } from '../../services/dashboard-report.db';
import path  from 'path';
import fs from 'fs';

const log: debug.IDebugger = debug('app:manage-mapper-controller');
class DashboardReportController {
    
   
    constructor() {}
    async getDashboardData(req: express.Request, res: express.Response) {
        try {
            console.log('started getDashboardData(): ');
            console.log('UserId: ', req.params.userId);
            console.log('Body Params: ', req.body);

            const dashboardData = {
                totalCustomers: 0,
                totalPurchaseOrders: 0,
                totalSuccessfullyProcessed: 0,
                totalFailedOrders: 0,
                totalDownloads: 0,
                todaysData: {
                    totalPurchaseOrders: 0,
                    totalSuccessfullyProcessed: 0,
                    totalFailedOrders: 0
                },
                topFive: {
                    customers: [],
                    purchaseOrders: null
                }
            };
            const dashboardReportDb = new DashboardReportDb();
            dashboardData.totalCustomers = await dashboardReportDb.findTotalCustomers();
            dashboardData.totalPurchaseOrders = await dashboardReportDb.findTotalOrders();
            dashboardData.totalSuccessfullyProcessed = await dashboardReportDb.findTotalSuccessfullyProcessedOrders(req.body);
            dashboardData.totalFailedOrders = await dashboardReportDb.findTotalFailedOrders(req.body);
            dashboardData.totalDownloads = await dashboardReportDb.findTotalDowonloadedOrders(req.body);
            // todays report
            dashboardData.todaysData.totalPurchaseOrders = await dashboardReportDb.findTodaysOrders();
            dashboardData.todaysData.totalSuccessfullyProcessed = await dashboardReportDb.findTodaysSuccessfullyProcessedOrders();
            dashboardData.todaysData.totalFailedOrders = await dashboardReportDb.findTodaysFailedOrders();
            // recent customers
            dashboardData.topFive.customers = await dashboardReportDb.findTopFiveCustomers(req.body);
            if(dashboardData.topFive.customers) {
                for (let index = 0; index < dashboardData.topFive.customers.length; index++) {
                    const item: any = dashboardData.topFive.customers[index];
                    const splitResult = item.email_from.split('@');
                    const domain_name = splitResult[1];
                    item.received = await dashboardReportDb.findTopFivePurchaseOrderByCustomerDomain(true,domain_name,1,0,req.body);                        
                    item.processed = await dashboardReportDb.findTopFivePurchaseOrderByCustomerDomain(false,domain_name,1,1,req.body);
                    item.failed = await dashboardReportDb.findTopFivePurchaseOrderByCustomerDomain(false,domain_name,1,0,req.body);
                }
            }
            // recent orders
            dashboardData.topFive.purchaseOrders = await dashboardReportDb.findTopFivePurchaseOrders(req.body);
           
            res.json({dashboardInfo: dashboardData});
        } catch (error) {
            const {message} = error as unknown as any;
            res.status(500).send('Error in fetching dashboard data!' + message);
        }
    }

    async getPurchaseOrderData(req: express.Request, res: express.Response) {
        try {
            console.log('started getPurchaseOrderData(): ');
            console.log('UserId: ', req.params.userId);
            console.log('Data: ', req.body);
            const dashboardReportDb = new DashboardReportDb();
            let result = await dashboardReportDb.filterPurchaseOrderInformation(req.params.userId,req.body);

            res.json({data: result});
        } catch (error) {
            const {message} = error as unknown as any;
            res.status(500).send('Error in fetching PurchaseOrderdata!' + message);
        }
    }

    async getAllDistinctEmails(req: express.Request, res: express.Response) {
        try {
            console.log('started getAllDistinctDomains(): ');
            console.log('Input: ', req.params.userId);
            const dashboardReportDb = new DashboardReportDb();
            let result = await dashboardReportDb.findAllDistinctEmailList();

            res.json({data: result});
        } catch (error) {
            const {message} = error as unknown as any;
            res.status(500).send('Error in fetching Deomain List!' + message);
        }
    }

    async downloadPurchaseOrderPdf(req: express.Request, res: express.Response) {
        try {
            console.log('started findPurchaseOrderPdf(): ');
            console.log('File Name: ', req.params.fileName);
            console.log("Present working directory: " + process.cwd());
            process.chdir(process.cwd()+ '..\\..\\..\\automation\\download-po\\');
            const myDirectoryPath = `${process.cwd()}\\${req.params.fileName}`;
            console.log(myDirectoryPath);
           // let file = path.join(__dirname,  req.params.fileName);
            res.download(myDirectoryPath, function (err) {
                if (err) {
                    console.log("Error");
                    console.log(err);
                    res.status(500).send('Error in processing getting customer PO data!' + err);
                } else {
                    console.log("Success");
                    // res.setHeader('Content-Disposition', 'attachment; filename=filename.csv');
                    // res.set('Content-Type', 'text/pdf');
                    // res.status(200);
                    // res.send({success: true});
                }
            });

            // let pdfManual = path.join(myDirectoryPath);
            // var html = fs.readFileSync(myDirectoryPath, 'utf8');
            // //let stat = fs.statSync((pdfManual));
            // //console.log(stat.size);
            // res.writeHead(200, {
            //     'Content-Type': 'application/pdf',
            //     'Content-Disposition': 'attachment; filename=filename.pdf'
            //     });

            // let readStream = fs.createReadStream(pdfManual);
            // readStream.pipe(res,{ end: true});
          
            //res.json({data: myDirectoryPath, name: req.params.fileName});
        } catch (error) {
            const {message} = error as unknown as any;
            res.status(500).send('Error in processing getting customer PO data!' + message);
        }
        
    }


    
    
}

export default new DashboardReportController();
