import debug from 'debug';
import fs from 'fs';
import path from 'path';
import _ from 'underscore';
import { IBigBazaarPurchaseOrderDto } from '../dto/interface/big-bazaar.purchase.order.dto';
import { BigBazaarPurchaseOrderDto } from '../dto/big-bazaar.purcahse.order.dto';
import myHelper from '../../common/my-helper';
import BBConstatnts from '../../common/big-bazaar.constants';
import { IBigBazaarPurchaseOrderItemsDto } from '../dto/interface/big-bazaar.purchase.order.items.dto';
import { BigBazaarPurchaseOrderItemsDto } from '../dto/big-bazaar.purchase.order.items.dto';
import { IBigBazaarPurchaseOrderItemsHeader } from '../dto/interface/big-bazaar.purchase.order.items.header';
import { BigBazaarPurchaseOrderItemsHeader } from '../dto/big-bazaar.purchase.order.items.header.dto';
import { PurchaseOrderDb } from '../../services/purchase.order';

const log: debug.IDebugger = debug('app:in-memory-dao');

class BigBazaarDAO {

    constructor() {
        log('Created new instance of BigBazaarDAO');
    }

    async processAndCreatePO(objPurchaseOrder: IBigBazaarPurchaseOrderDto): Promise<IBigBazaarPurchaseOrderDto>{
        try {
            console.clear();
           
            let listOfTableHeader: any = null;
            let listOfTableRow: any = [];
            const fileBuffer: any = fs.readFileSync(objPurchaseOrder.JsonFile);
            const rawPOResult = JSON.parse(fileBuffer);
            console.log(rawPOResult);
            if (fileBuffer && rawPOResult.length >= 2) {
                // header
                for (let index = 0; index < rawPOResult[2].data.length; index++) {
                    const item = rawPOResult[2].data[index];
                    if (index === 2) {
                        listOfTableHeader = _.pluck(item, 'text');
                    }
                }
                //console.log(listOfTableHeader);
                this.newMappgingLogic(rawPOResult);
                _.map(rawPOResult, (item) => {
                    if (item['extraction_method'] === 'lattice') {
                        _.map(item['data'], (itemInner) => {
                            let tempArray: Array<string> = [];
                            _.map(itemInner, (row) => {
                                if (row['text']) {
                                    const splitResult = row['text'].split('\r');
                                    tempArray = tempArray.concat(row['text']);
                                }
                            });
                            listOfTableRow.push(tempArray);
                        });
                    }
                })
            }
            //
            //console.log(bigBazarConfig);
            //const objPurchaseOrder = new BigBazaarPurchaseOrderDto();
            objPurchaseOrder.ItemsHeader =  listOfTableHeader;
            objPurchaseOrder.ItemColumnHeaders = this.getPOHeaders(listOfTableHeader);
           // this.getHeaderIndexByName(listOfTableHeader, 'Article EAN');
            this.setPurchaseOrderHeader(objPurchaseOrder,listOfTableRow);
            const listOfItems = new Array<IBigBazaarPurchaseOrderItemsDto>();
            _.map(myHelper.filterRawJsonListByLength(listOfTableRow, 10), (item: any) => {
                const obj = new BigBazaarPurchaseOrderItemsDto();
                obj.ArticleEAN = this.getArticleEAN(item[0]);//
                obj.ArticleCode = this.getArticleCode(item[0]);
                obj.DescriptionOfGoods = this.getDescriptionOfGoods(item[0]);
                obj.HSN = this.getHSN(item[1]);
                obj.MRP = this.getMRP(item[2]);
                obj.Quantity = this.getQuantity(item[3]);
                obj.UnitOfMeasure = this.getUoM(item[4]);
                obj.BasicCost = this.getBasicCost(item[5]);
                obj.TaxableAmount = this.getTaxableAmount(item[6]);
                //state-gst
                obj.SGST_Amount = this.getSGST_Amount(item[7]);
                obj.SGST_Rate = this.getSGST_Rate(item[7]);
                //central-gst
                obj.CGST_Amount = this.getSGST_Amount(item[8]);
                obj.CGST_Rate = this.getSGST_Rate(item[8]);
                obj.TotalAmount = this.getTotalAmount(item[9]);

                listOfItems.push(obj);
            });
            // TBD - Handle missing data e.x. description
            objPurchaseOrder.Items = listOfItems;
            // update database
            //new PurchaseOrderDb().updatePurchaseOrderMaster(objPurchaseOrder);
            //
            return objPurchaseOrder;
        }
        catch (error) {
            throw new Error(`Error in processing Purchase Order - ${objPurchaseOrder.JsonFile}`);
        }
    }

    async getPurchaseOrders(): Promise<IBigBazaarPurchaseOrderDto[]> {
        try {
            return new Array<IBigBazaarPurchaseOrderDto>();
        } catch (error) {
            throw new Error("Error in processing your request");
        }
       
    }

    async getPurchaseOrderById(id: string): Promise<IBigBazaarPurchaseOrderDto> {
        return new BigBazaarPurchaseOrderDto();
    }

    async getPurchaseOrderMaterByDate(page: string) {
        return new PurchaseOrderDb().getMultiple(page);
    }

    private setPurchaseOrderHeader(objHeader: IBigBazaarPurchaseOrderDto, rawJsonlist: string[]) {
        objHeader.PurchaseOrderNumber = this.getPurchaseOrderNumber(rawJsonlist);
        objHeader.PurchaseOrderDate = this.getPurchaseOrderDate(rawJsonlist);
        objHeader.SoldToParty = this.getProcessedDataByField(rawJsonlist,BBConstatnts.FIELDS_TO_MAGNIFY.SOLD_TO_PARTY,1)
        objHeader.ShipToParty = this.getProcessedDataByField(rawJsonlist,BBConstatnts.FIELDS_TO_MAGNIFY.SHIP_TO_PARTY,1)
    }


    private getPOHeaders(headers: Array<string>): Array<IBigBazaarPurchaseOrderItemsHeader> {
        const list = Array<BigBazaarPurchaseOrderItemsHeader>();
        const splitBy = '\r';
        headers.map((item, index) => {
            const splitResult = myHelper.splitString(item, splitBy);

            if(splitResult && splitResult.length > 1) {

                splitResult.map((colItem, colIndex) => {
                    const obj = new BigBazaarPurchaseOrderItemsHeader(splitBy);    
                    obj.hasSeparator = true;
                    obj.index = index;
                    obj.name = colItem;
                    //obj.columnIndex = obj.findColumnIndex(name,splitResult);                
                    list.push(obj);
                });

            }
            else {

                const obj = new BigBazaarPurchaseOrderItemsHeader(splitBy);
                obj.index = index;
                obj.name = item;
                obj.columnIndex = index;
                list.push(obj);

            }
        });
        return list;
    }

    private getProcessedDataByField(rawJsonlist: string[], fieldToMagnify: string, filterCount: number) {
        const filteredResult = myHelper.filterRawJsonListByLength(rawJsonlist, filterCount);
        const data = myHelper.filterRawJsonListBySearchTerm(filteredResult, fieldToMagnify);
        return data;
    }

    private getPurchaseOrderNumber(list: Array<string>): string  {
        let poNumber = '0';
        const data = this.getProcessedDataByField(list, BBConstatnts.FIELDS_TO_MAGNIFY.PO_NUMBER, 1);
        if(data && data[0]) {
            const splitResult = myHelper.splitString(data[0], '\r');
            if(splitResult && splitResult.length > 0) {
                poNumber = splitResult[1].replace(':','');
            }
        }
        return poNumber;
    }

    private getPurchaseOrderDate(list: Array<string>): string {
        let poDate = '';
        const data = this.getProcessedDataByField(list, BBConstatnts.FIELDS_TO_MAGNIFY.PO_DATE, 1);
        if(data && data[0]) {
            const splitResult = myHelper.splitString(data[0], '\r');
            if(splitResult && splitResult.length > 0 && splitResult.length <= 4) {
                poDate = splitResult[3].replace(':','');
            }
        }
        return poDate;
    }

    private getValidTo() {
        return "TBD";
    }

    private getSAPMaterialCode(): string {
        let materialCode = 'TBD';
        return materialCode;
    }

    private getArticleEAN(item: string): string {
        let articleEAN = '';
        if(item) {
            const splitResult = myHelper.splitString(item, '\r');
            if(splitResult && splitResult.length > 0) {
                articleEAN = splitResult[0];
            }
        }
        return articleEAN;
    }

    private getArticleCode(item: string): string {
        let articleCode = '';
        if(item) {
            const splitResult = myHelper.splitString(item, '\r');
            if(splitResult && splitResult.length > 0) {
                articleCode = splitResult[1];
            }
        }
        return articleCode;
    }

    private getDescriptionOfGoods(item: string): string {
        let description = '';
        if(item) {
            const splitResult = myHelper.splitString(item, '\r');
            if(splitResult && splitResult.length && splitResult.length > 2) {
                for (let i = 0; i < splitResult.length; i++) {
                    if(i >= 2) {
                        description = `${description} ${splitResult[i]}`;
                    }
                }
            }
        }
        return description;
    }

    private getHSN(item: string): string {
        let hsn = '';
        if(item) {
            const splitResult = myHelper.splitString(item, '\r');
            if(splitResult && splitResult.length > 0) {
                for (let i = 0; i < splitResult.length; i++) {
                    hsn = `${hsn}${splitResult[i]}`;
                }
            }
        }
        return hsn;
    }  
    
    private getMRP(item: string): string {
        let mrp = '0';
        if(item) {
            mrp = item;
        }
        return mrp;
    }

    private getQuantity(item: string): string {
        let qty = '0';
        if(item) {
            qty = item;
        }
        return qty;
    }

    private getUoM(item: string): string {
        let uom = '';
        if(item) {
            uom = item;
        }
        return uom;
    }

    private getBasicCost(item: string): string {
        let badicCost = '0';
        if(item) {
            badicCost = item;
        }
        return badicCost;
    }


    private getTaxableAmount(item: string): string {
        let taxableAmt = '0';
        if(item) {
            taxableAmt = item;
        }
        return taxableAmt;
    }

    private getSGST_Rate(item: string): string {
        let sgst_Rate = '0';
        if(item) {
            const splitResult = myHelper.splitString(item, '\r');
            if(splitResult && splitResult.length > 0) {
                sgst_Rate = splitResult[0];
            }
        }
        return sgst_Rate;
    }

    private getSGST_Amount(item: string): string {
        let sgst_Amount = '0';
        if(item) {
            const splitResult = myHelper.splitString(item, '\r');
            if(splitResult && splitResult.length > 0) {
                sgst_Amount = splitResult[1];
            }
        }
        return sgst_Amount;
    }

    private getCGST_Rate(item: string): string {
        let cgst_Rate = '0';
        if(item) {
            const splitResult = myHelper.splitString(item, '\r');
            if(splitResult && splitResult.length > 0) {
                cgst_Rate = splitResult[0];
            }
        }
        return cgst_Rate;
    }

    private getCGST_Amount(item: string): string {
        let cgst_Amount = '0';
        if(item) {
            const splitResult = myHelper.splitString(item, '\r');
            if(splitResult && splitResult.length > 0) {
                cgst_Amount = splitResult[1];
            }
        }
        return cgst_Amount;
    }

    private getTotalAmount(item: string): string {
        let totalAmount = '0';
        if(item) {
            totalAmount = item;
        }
        return totalAmount;
    }

    private mapperInfo() {
        const mapperData = [
            {
                "EmtpyGroupName": "NA",
                "Id": 1637952602328,
                "OutputFieldId": 3,
                "CustomerName": "Test Cust Name",
                "InputFieldName": "Future Retail Limited. Formerly known as : Bharti Retail Ltd",
                "OutputFieldName": "Sold to party",
                "IsHeader": true,
                "IsHeaderDisplayText": "Y",
                "GroupName": "0",
                "GroupNameDisplayText": "NA",
                "MapperIndex": "0-1-0"
            },
            {
                "EmtpyGroupName": "NA",
                "Id": 1637952614127,
                "OutputFieldId": 1,
                "CustomerName": "Test Cust Name",
                "InputFieldName": "P.O. Number",
                "OutputFieldName": "Purchase Order Number",
                "IsHeader": true,
                "IsHeaderDisplayText": "Y",
                "GroupName": "0",
                "GroupNameDisplayText": "NA",
                "MapperIndex": "0-2-2"
            },
            {
                "EmtpyGroupName": "NA",
                "Id": 1637952647846,
                "OutputFieldId": 2,
                "CustomerName": "Test Cust Name",
                "InputFieldName": "Date",
                "OutputFieldName": "Purchase Order Date",
                "IsHeader": true,
                "IsHeaderDisplayText": "Y",
                "GroupName": "0",
                "GroupNameDisplayText": "NA",
                "MapperIndex": "0-2-2"
            },
            {
                "EmtpyGroupName": "NA",
                "Id": 1637952671596,
                "OutputFieldId": 4,
                "CustomerName": "Test Cust Name",
                "InputFieldName": "Delivery &",
                "OutputFieldName": "Ship to party",
                "IsHeader": true,
                "IsHeaderDisplayText": "Y",
                "GroupName": "0",
                "GroupNameDisplayText": "NA",
                "MapperIndex": "0-4-0"
            },
            {
                "EmtpyGroupName": "NA",
                "Id": 1637952691104,
                "OutputFieldId": 0,
                "CustomerName": "Test Cust Name",
                "InputFieldName": "Article  EAN",
                "IsHeader": false,
                "IsHeaderDisplayText": "N",
                "GroupName": "Group-3",
                "GroupNameDisplayText": "Group-3",
                "MapperIndex": "0-5-0"
            },
            {
                "EmtpyGroupName": "NA",
                "Id": 1637952715519,
                "OutputFieldId": 7,
                "CustomerName": "Test Cust Name",
                "InputFieldName": "Article Code",
                "OutputFieldName": "SKU",
                "IsHeader": false,
                "IsHeaderDisplayText": "N",
                "GroupName": "Group-3",
                "GroupNameDisplayText": "Group-3",
                "MapperIndex": "0-5-0"
            },
            {
                "EmtpyGroupName": "NA",
                "Id": 1637952731824,
                "OutputFieldId": 6,
                "CustomerName": "Test Cust Name",
                "InputFieldName": "Description of Goods",
                "OutputFieldName": "Description",
                "IsHeader": false,
                "IsHeaderDisplayText": "N",
                "GroupName": "Group-3",
                "GroupNameDisplayText": "Group-3",
                "MapperIndex": "0-5-0"
            },
            {
                "EmtpyGroupName": "NA",
                "Id": 1637952746047,
                "OutputFieldId": 15,
                "CustomerName": "Test Cust Name",
                "InputFieldName": "HSN",
                "OutputFieldName": "HSN",
                "IsHeader": false,
                "IsHeaderDisplayText": "N",
                "GroupName": "Group-1",
                "GroupNameDisplayText": "Group-1",
                "MapperIndex": "0-6-1"
            },
            {
                "EmtpyGroupName": "NA",
                "Id": 1637952761575,
                "OutputFieldId": 18,
                "CustomerName": "Test Cust Name",
                "InputFieldName": "MRP",
                "OutputFieldName": "MRP",
                "IsHeader": false,
                "IsHeaderDisplayText": "N",
                "GroupName": "Group-1",
                "GroupNameDisplayText": "Group-1",
                "MapperIndex": "0-6-2"
            },
            {
                "EmtpyGroupName": "NA",
                "Id": 1637952773152,
                "OutputFieldId": 16,
                "CustomerName": "Test Cust Name",
                "InputFieldName": "Qty",
                "OutputFieldName": "Quantity",
                "IsHeader": false,
                "IsHeaderDisplayText": "N",
                "GroupName": "Group-1",
                "GroupNameDisplayText": "Group-1",
                "MapperIndex": "0-6-3"
            },
            {
                "EmtpyGroupName": "NA",
                "Id": 1637952787648,
                "OutputFieldId": 17,
                "CustomerName": "Test Cust Name",
                "InputFieldName": "UOM",
                "OutputFieldName": "UoM",
                "IsHeader": false,
                "IsHeaderDisplayText": "N",
                "GroupName": "Group-1",
                "GroupNameDisplayText": "Group-1",
                "MapperIndex": "0-6-4"
            },
            {
                "EmtpyGroupName": "NA",
                "Id": 1637952808016,
                "OutputFieldId": 9,
                "CustomerName": "Test Cust Name",
                "InputFieldName": "Taxable Value",
                "OutputFieldName": "Taxable Value",
                "IsHeader": false,
                "IsHeaderDisplayText": "N",
                "GroupName": "Group-1",
                "GroupNameDisplayText": "Group-1",
                "MapperIndex": "0-5-8"
            },
            {
                "EmtpyGroupName": "NA",
                "Id": 1637952817280,
                "OutputFieldId": 10,
                "CustomerName": "Test Cust Name",
                "InputFieldName": "SGST Rate",
                "OutputFieldName": "SGST Rate",
                "IsHeader": false,
                "IsHeaderDisplayText": "N",
                "GroupName": "Group-2",
                "GroupNameDisplayText": "Group-2",
                "MapperIndex": "0-5-9"
            },
            {
                "EmtpyGroupName": "NA",
                "Id": 1637952826704,
                "OutputFieldId": 11,
                "CustomerName": "Test Cust Name",
                "InputFieldName": "SGST Amt",
                "OutputFieldName": "SGST Amount",
                "IsHeader": false,
                "IsHeaderDisplayText": "N",
                "GroupName": "Group-2",
                "GroupNameDisplayText": "Group-2",
                "MapperIndex": "0-5-9"
            },
            {
                "EmtpyGroupName": "NA",
                "Id": 1637952838640,
                "OutputFieldId": 12,
                "CustomerName": "Test Cust Name",
                "InputFieldName": "CGST Rate",
                "OutputFieldName": "CGST Rate",
                "IsHeader": false,
                "IsHeaderDisplayText": "N",
                "GroupName": "Group-2",
                "GroupNameDisplayText": "Group-2",
                "MapperIndex": "0-5-10"
            },
            {
                "EmtpyGroupName": "NA",
                "Id": 1637952851664,
                "OutputFieldId": 12,
                "CustomerName": "Test Cust Name",
                "InputFieldName": "CGST Amt",
                "OutputFieldName": "CGST Rate",
                "IsHeader": false,
                "IsHeaderDisplayText": "N",
                "GroupName": "Group-2",
                "GroupNameDisplayText": "Group-2",
                "MapperIndex": "0-5-10"
            },
            {
                "EmtpyGroupName": "NA",
                "Id": 1637952871632,
                "OutputFieldId": 14,
                "CustomerName": "Test Cust Name",
                "InputFieldName": "Total Amt",
                "OutputFieldName": "Total Amount",
                "IsHeader": false,
                "IsHeaderDisplayText": "N",
                "GroupName": "Group-1",
                "GroupNameDisplayText": "Group-1",
                "MapperIndex": "0-5-11"
            },
            {
                "EmtpyGroupName": "NA",
                "Id": 1637952895716,
                "OutputFieldId": 5,
                "CustomerName": "Test Cust Name",
                "InputFieldName": "Article  EAN",
                "OutputFieldName": "EAN",
                "IsHeader": false,
                "IsHeaderDisplayText": "N",
                "GroupName": "Group-3",
                "GroupNameDisplayText": "Group-3",
                "MapperIndex": "0-5-0"
            }
        ];
        return mapperData;
    }

    private newMappgingLogic(rawPOResult: any) {
        _.map(rawPOResult, (item, i: number) => {
            if (item['extraction_method'] === 'lattice') {
                _.map(item['data'], (itemInner, j: number) => {
                    let tempArray: Array<string> = [];
                    _.map(itemInner, (row, k: number) => {
                        if (row['text']) {
                          console.log(`${i}-${j}-${k}`);
                        }
                    });
                });
            }
        });
        return;
    }

   
}

export default new BigBazaarDAO();
