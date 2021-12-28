import debug from 'debug';
import fs from 'fs';
import path from 'path';
import _, { map } from 'underscore';
import { IBigBazaarPurchaseOrderDto } from '../dto/interface/big-bazaar.purchase.order.dto';
import { BigBazaarPurchaseOrderDto } from '../dto/big-bazaar.purcahse.order.dto';
import myHelper from '../../common/my-helper';
import BBConstatnts from '../../common/big-bazaar.constants';
import { IBigBazaarPurchaseOrderItemsDto } from '../dto/interface/big-bazaar.purchase.order.items.dto';
import { BigBazaarPurchaseOrderItemsDto } from '../dto/big-bazaar.purchase.order.items.dto';
import { IBigBazaarPurchaseOrderItemsHeader } from '../dto/interface/big-bazaar.purchase.order.items.header';
import { BigBazaarPurchaseOrderItemsHeader } from '../dto/big-bazaar.purchase.order.items.header.dto';
import { PurchaseOrderDb } from '../../services/purchase.order';
import { TemplateMapperInfoDto } from '../dto/template-mapper-dto';

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
            //console.log(rawPOResult);
            if (fileBuffer && rawPOResult.length >= 2) {
                // header
                for (let index = 0; index < rawPOResult[2].data.length; index++) {
                    const item = rawPOResult[2].data[index];
                    if (index === 2) {
                        listOfTableHeader = _.pluck(item, 'text');
                    }
                }
                //console.log(listOfTableHeader);
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
            this.setPurchaseOrderHeader(objPurchaseOrder,rawPOResult);
            const purchaseOrderItemValues: Array<any> = this.getPurchaseOrderItems(objPurchaseOrder, listOfTableRow);
            const listOfItems = new Array<IBigBazaarPurchaseOrderItemsDto>();
            _.map(purchaseOrderItemValues, (item: any) => {
                const obj = new BigBazaarPurchaseOrderItemsDto();
                _.map(item, (itemInner: any) => {
                    if(itemInner.label === 'EAN') {
                        obj.ArticleEAN = itemInner.value;
                    }
                    if(itemInner.label === 'SKU') {
                        obj.ArticleCode = itemInner.value;
                    }
                    if(itemInner.label === 'Description') {
                        obj.DescriptionOfGoods = itemInner.value;
                    }
                    if(itemInner.label === 'HSN') {
                        obj.HSN = itemInner.value;
                    }
                    if(itemInner.label === 'MRP') {
                        obj.MRP = itemInner.value;
                    }
                    if(itemInner.label === 'Quantity') {
                        obj.Quantity = itemInner.value;
                    }
                    if(itemInner.label === 'UoM') {
                        obj.UnitOfMeasure = itemInner.value;
                    }
                    if(itemInner.label === 'Basic Cost') {
                        obj.BasicCost = itemInner.value;
                    }
                   
                    if(itemInner.label === 'Taxable Value') {
                        obj.TaxableAmount = itemInner.value;
                    }
                    //state-gst
                    if(itemInner.label === 'SGST Amount') {
                        obj.SGST_Amount = itemInner.value;
                    }
                    if(itemInner.label === 'SGST Rate') {
                        obj.SGST_Rate = itemInner.value;
                    }
                    //central-gst
                    if(itemInner.label === 'CGST Amount') {
                        obj.CGST_Amount = itemInner.value;
                    }
                    if(itemInner.label === 'CGST Rate') {
                        obj.CGST_Rate = itemInner.value;
                    }
                    //total amount
                    if(itemInner.label === 'Total Amount') {
                        obj.TotalAmount = itemInner.value;
                    }
                });
                listOfItems.push(obj);
            });
            // TBD - Handle missing data e.x. description
            objPurchaseOrder.Items = listOfItems;
            // update database
            // new PurchaseOrderDb().updatePurchaseOrderMaster(objPurchaseOrder);
            //
            console.log(objPurchaseOrder);
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

    private setPurchaseOrderHeader(objHeader: IBigBazaarPurchaseOrderDto, rawPOResult: string[]) {
        const headerList = objHeader.TemplateHeaderLabel; //this.getPurchaseOrderHeaderLabelList();
        const result: any = [];
        map(headerList,(item: TemplateMapperInfoDto) => {
            const matchedText = this.newMappgingLogic(rawPOResult, this.getPdfMapperByOutputFieldName(item.OutputFieldName ,headerList));
            const matchedValue = this.getPurchaseOrderNumber(matchedText,item.InputFieldName, '\r');
            // TBD - All comparision by lower/upper case for both LHS & RHS
            if(item.OutputFieldName === 'Purchase Order Number') {
                objHeader.PurchaseOrderNumber = matchedValue;
            }
            if(item.OutputFieldName === 'Purchase Order Date') {
                objHeader.PurchaseOrderDate = matchedValue;
            }
            if(item.OutputFieldName === 'Sold to party') {
                objHeader.SoldToParty = matchedText; // TBD - entire text
            }
            if(item.OutputFieldName === 'Ship to party') {
                objHeader.ShipToParty = matchedText; // TBD - entire text
            }
        });
    }

    private getPurchaseOrderItems(obj: IBigBazaarPurchaseOrderDto, listOfTableRow: string[]): Array<any> {
        const itemDetailsList = obj.TemplateItemLabel; //this.getPurchaseOrderDetailsLabelList();
        //tbd use group prop
        const finalResult: any = [];
        // TBD replace hardcoded 10 by finding distinct length from <itemDetailsList>
        _.map(myHelper.filterRawJsonListByLength(listOfTableRow, 10), (item: any, i: number) => {
            const result: any = [];
            _.map(itemDetailsList, (itemDetails: TemplateMapperInfoDto, j: number) => {
                const filteredLabelList = this.getItemDetailsByColumnIndex(j,itemDetailsList);
                if(filteredLabelList && _.isArray(filteredLabelList) && filteredLabelList.length > 0) {
                    _.map(filteredLabelList, (labelItem: any, k: number) => {
                        const obj = {
                            labelInfo: labelItem,
                            value: '',
                            label: ''
                        };
                        //
                        if(labelItem.GroupName !== 'Group-1') {
                            const splitResult = myHelper.splitString(item[j], '\r');
                            if(splitResult && splitResult.length > 0) {
                                obj.value = splitResult[k];
                                obj.label = labelItem.OutputFieldName;
                            }
                            // TBD
                            if(obj.label === 'Description') {
                                obj.value = '';
                                for (let i = 0; i < splitResult.length; i++) {
                                    if(i >= 2) {
                                        obj.value = `${obj.value} ${splitResult[i]}`;
                                    }
                                }
                            }
                        } 
                        if(labelItem.GroupName === 'Group-1') {
                            const splitResult = myHelper.splitString(item[j], '\r');
                            if(splitResult && splitResult.length > 0) {
                                for (let i = 0; i < splitResult.length; i++) {
                                    obj.value = `${obj.value} ${splitResult[i]}`;
                                }
                                obj.label = labelItem.OutputFieldName;
                            } 
                        }
                        result.push(obj);
                    });
                }
            });
            finalResult.push(result);
        });
        console.log(finalResult.length);
        return finalResult;
    }
    // tbd save mapperindex == colIndex
    private getItemDetailsByColumnIndex(colIndex: number, itemDetailsList: Array<any>) {
        const result = itemDetailsList.filter((item) => {
            const originalMapperIndex = item.MapperIndex;
            const splitMapperIndexResult = myHelper.splitString(item.MapperIndex, '-');
            if(splitMapperIndexResult && splitMapperIndexResult.length === 3) {
                const tempMapperIndex = parseInt(splitMapperIndexResult[2]);
                const computedMapperIndex = `${splitMapperIndexResult[0]}-${splitMapperIndexResult[1]}-${tempMapperIndex}`;
                if(tempMapperIndex === colIndex){
                    return item;
                }
            }
        });
        return result;
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

    private getPurchaseOrderNumber(matchedData: string, inputFieldName: string, splitBy: string): string  {
        let poNumber = '0';
        //  "MapperIndex": "0-2-2"
       // const data = this.getProcessedDataByField(list, BBConstatnts.FIELDS_TO_MAGNIFY.PO_NUMBER, 1);
        if(matchedData) {
            const splitResult = myHelper.splitString(matchedData, splitBy);
            if(splitResult && splitResult.length > 1) {
                poNumber = myHelper.filterRawJsonListBySearchTerm(splitResult, inputFieldName);
                poNumber = poNumber.replace(':',''); 
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

    private getPurchaseOrderHeaderLabelList() {
        const mapper = this.findMapperInfo();
        const headerList = mapper.filter((item) => {
            return (item.IsHeader);
        });
        return headerList;
    }

    private getPurchaseOrderDetailsLabelList() {
        const mapper = this.findMapperInfo();
        const itemList = mapper.filter((item) => {
            return (!item.IsHeader);
        });
        return itemList;
    }

    private getPdfMapperByOutputFieldName(fieldName: string, list: Array<any>) {
        const mapperObject = list.find((item) => {
            return (item.OutputFieldName.toLowerCase() === fieldName.toLowerCase());
        });
        return mapperObject;
    }

    private findMapperInfo() {
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
                "Id": 1639769644961,
                "OutputFieldId": 14,
                "CustomerName": "Test Cust Name",
                "InputFieldName": "Total Amt",
                "OutputFieldName": "Total Amount",
                "IsHeader": false,
                "IsHeaderDisplayText": "N",
                "GroupName": "Group-1",
                "GroupNameDisplayText": "Group-1",
                "MapperIndex": "0-5-9"
              },
              {
                "EmtpyGroupName": "NA",
                "Id": 1639769688475,
                "OutputFieldId": 12,
                "CustomerName": "Test Cust Name",
                "InputFieldName": "CGST Rate",
                "OutputFieldName": "CGST Rate",
                "IsHeader": false,
                "IsHeaderDisplayText": "N",
                "GroupName": "Group-2",
                "GroupNameDisplayText": "Group-2",
                "MapperIndex": "0-5-8"
              },
              {
                "EmtpyGroupName": "NA",
                "Id": 1639769750939,
                "OutputFieldId": 10,
                "CustomerName": "Test Cust Name",
                "InputFieldName": "SGST Rate",
                "OutputFieldName": "SGST Rate",
                "IsHeader": false,
                "IsHeaderDisplayText": "N",
                "GroupName": "Group-2",
                "GroupNameDisplayText": "Group-2",
                "MapperIndex": "0-5-7"
              },
              {
                "EmtpyGroupName": "NA",
                "Id": 1639769863279,
                "OutputFieldId": 9,
                "CustomerName": "Test Cust Name",
                "InputFieldName": "Taxable Value",
                "OutputFieldName": "Taxable Value",
                "IsHeader": false,
                "IsHeaderDisplayText": "N",
                "GroupName": "Group-1",
                "GroupNameDisplayText": "Group-1",
                "MapperIndex": "0-5-6"
              },
              {
                "EmtpyGroupName": "NA",
                "Id": 1639769928818,
                "OutputFieldId": 5,
                "CustomerName": "Test Cust Name",
                "InputFieldName": "Article  EAN",
                "OutputFieldName": "EAN",
                "IsHeader": false,
                "IsHeaderDisplayText": "N",
                "GroupName": "Group-3",
                "GroupNameDisplayText": "Group-3",
                "MapperIndex": "0-5-0"
              },
              {
                "EmtpyGroupName": "NA",
                "Id": 1639769945330,
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
                "Id": 1639769981944,
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
                "Id": 1639770006244,
                "OutputFieldId": 15,
                "CustomerName": "Test Cust Name",
                "InputFieldName": "HSN",
                "OutputFieldName": "HSN",
                "IsHeader": false,
                "IsHeaderDisplayText": "N",
                "GroupName": "Group-1",
                "GroupNameDisplayText": "Group-1",
                "MapperIndex": "0-5-1"
              },
              {
                "EmtpyGroupName": "NA",
                "Id": 1639770034955,
                "OutputFieldId": 18,
                "CustomerName": "Test Cust Name",
                "InputFieldName": "MRP",
                "OutputFieldName": "MRP",
                "IsHeader": false,
                "IsHeaderDisplayText": "N",
                "GroupName": "Group-1",
                "GroupNameDisplayText": "Group-1",
                "MapperIndex": "0-5-2"
              },
              {
                "EmtpyGroupName": "NA",
                "Id": 1639770058611,
                "OutputFieldId": 16,
                "CustomerName": "Test Cust Name",
                "InputFieldName": "Qty",
                "OutputFieldName": "Quantity",
                "IsHeader": false,
                "IsHeaderDisplayText": "N",
                "GroupName": "Group-1",
                "GroupNameDisplayText": "Group-1",
                "MapperIndex": "0-5-3"
              },
              {
                "EmtpyGroupName": "NA",
                "Id": 1639770094217,
                "OutputFieldId": 17,
                "CustomerName": "Test Cust Name",
                "InputFieldName": "UOM",
                "OutputFieldName": "UoM",
                "IsHeader": false,
                "IsHeaderDisplayText": "N",
                "GroupName": "Group-1",
                "GroupNameDisplayText": "Group-1",
                "MapperIndex": "0-5-4"
              },
              {
                "EmtpyGroupName": "NA",
                "Id": 1639770121811,
                "OutputFieldId": 8,
                "CustomerName": "Test Cust Name",
                "InputFieldName": "Basic Cost",
                "OutputFieldName": "Basic Cost",
                "IsHeader": false,
                "IsHeaderDisplayText": "N",
                "GroupName": "Group-1",
                "GroupNameDisplayText": "Group-1",
                "MapperIndex": "0-5-5"
              },
              {
                "EmtpyGroupName": "NA",
                "Id": 1639770172683,
                "OutputFieldId": 11,
                "CustomerName": "Test Cust Name",
                "InputFieldName": "SGST Amt",
                "OutputFieldName": "SGST Amount",
                "IsHeader": false,
                "IsHeaderDisplayText": "N",
                "GroupName": "Group-2",
                "GroupNameDisplayText": "Group-2",
                "MapperIndex": "0-5-7"
              },
              {
                "EmtpyGroupName": "NA",
                "Id": 1639770217762,
                "OutputFieldId": 13,
                "CustomerName": "Test Cust Name",
                "InputFieldName": "CGST Amt",
                "OutputFieldName": "CGST Amount",
                "IsHeader": false,
                "IsHeaderDisplayText": "N",
                "GroupName": "Group-2",
                "GroupNameDisplayText": "Group-2",
                "MapperIndex": "0-5-8"
              }
        ];
        return mapperData;
    }

    private newMappgingLogic(rawPOResult: any, mapper: any) {
        let matchedValue = '';
        let index_i: number;
        let index_j: number;
        let index_k: number;
        if(mapper) {
            const splitResult = myHelper.splitString(mapper.MapperIndex,'-');
            if(splitResult && splitResult.length === 3) { //TBD
                index_i = parseInt(splitResult[0]);
                index_j = parseInt(splitResult[1]);
                index_k = parseInt(splitResult[2]);
                _.map(rawPOResult, (item, i: number) => {
                    if (item['extraction_method'] === 'lattice') {
                        _.map(item['data'], (itemInner, j: number) => {
                            _.map(itemInner, (row, k: number) => {
                                if (row['text']) {
                                    if (i === index_i && j === index_j && k === index_k) {
                                        matchedValue = row['text'];
                                        console.log(`${i}-${j}-${k}-${matchedValue}`);                                
                                    }
                                    else {
                                        console.log('not matching')
                                    }
                                }
                            });
                        });
                    }
                });
            }
        }
        return matchedValue;
    }

   
}

export default new BigBazaarDAO();
