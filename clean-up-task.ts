// /* 
//  private findMapperInfo() {
//         const mapperData = [
//             {
//                 "EmtpyGroupName": "NA",
//                 "Id": 1637952602328,
//                 "OutputFieldId": 3,
//                 "CustomerName": "Test Cust Name",
//                 "InputFieldName": "Future Retail Limited. Formerly known as : Bharti Retail Ltd",
//                 "OutputFieldName": "Sold to party",
//                 "IsHeader": true,
//                 "IsHeaderDisplayText": "Y",
//                 "GroupName": "0",
//                 "GroupNameDisplayText": "NA",
//                 "MapperIndex": "0-1-0"
//             },
//             {
//                 "EmtpyGroupName": "NA",
//                 "Id": 1637952614127,
//                 "OutputFieldId": 1,
//                 "CustomerName": "Test Cust Name",
//                 "InputFieldName": "P.O. Number",
//                 "OutputFieldName": "Purchase Order Number",
//                 "IsHeader": true,
//                 "IsHeaderDisplayText": "Y",
//                 "GroupName": "0",
//                 "GroupNameDisplayText": "NA",
//                 "MapperIndex": "0-2-2"
//             },
//             {
//                 "EmtpyGroupName": "NA",
//                 "Id": 1637952647846,
//                 "OutputFieldId": 2,
//                 "CustomerName": "Test Cust Name",
//                 "InputFieldName": "Date",
//                 "OutputFieldName": "Purchase Order Date",
//                 "IsHeader": true,
//                 "IsHeaderDisplayText": "Y",
//                 "GroupName": "0",
//                 "GroupNameDisplayText": "NA",
//                 "MapperIndex": "0-2-2"
//             },
//             {
//                 "EmtpyGroupName": "NA",
//                 "Id": 1637952671596,
//                 "OutputFieldId": 4,
//                 "CustomerName": "Test Cust Name",
//                 "InputFieldName": "Delivery &",
//                 "OutputFieldName": "Ship to party",
//                 "IsHeader": true,
//                 "IsHeaderDisplayText": "Y",
//                 "GroupName": "0",
//                 "GroupNameDisplayText": "NA",
//                 "MapperIndex": "0-4-0"
//             },
//             {
//                 "EmtpyGroupName": "NA",
//                 "Id": 1639769644961,
//                 "OutputFieldId": 14,
//                 "CustomerName": "Test Cust Name",
//                 "InputFieldName": "Total Amt",
//                 "OutputFieldName": "Total Amount",
//                 "IsHeader": false,
//                 "IsHeaderDisplayText": "N",
//                 "GroupName": "Group-1",
//                 "GroupNameDisplayText": "Group-1",
//                 "MapperIndex": "0-5-9"
//               },
//               {
//                 "EmtpyGroupName": "NA",
//                 "Id": 1639769688475,
//                 "OutputFieldId": 12,
//                 "CustomerName": "Test Cust Name",
//                 "InputFieldName": "CGST Rate",
//                 "OutputFieldName": "CGST Rate",
//                 "IsHeader": false,
//                 "IsHeaderDisplayText": "N",
//                 "GroupName": "Group-2",
//                 "GroupNameDisplayText": "Group-2",
//                 "MapperIndex": "0-5-8"
//               },
//               {
//                 "EmtpyGroupName": "NA",
//                 "Id": 1639769750939,
//                 "OutputFieldId": 10,
//                 "CustomerName": "Test Cust Name",
//                 "InputFieldName": "SGST Rate",
//                 "OutputFieldName": "SGST Rate",
//                 "IsHeader": false,
//                 "IsHeaderDisplayText": "N",
//                 "GroupName": "Group-2",
//                 "GroupNameDisplayText": "Group-2",
//                 "MapperIndex": "0-5-7"
//               },
//               {
//                 "EmtpyGroupName": "NA",
//                 "Id": 1639769863279,
//                 "OutputFieldId": 9,
//                 "CustomerName": "Test Cust Name",
//                 "InputFieldName": "Taxable Value",
//                 "OutputFieldName": "Taxable Value",
//                 "IsHeader": false,
//                 "IsHeaderDisplayText": "N",
//                 "GroupName": "Group-1",
//                 "GroupNameDisplayText": "Group-1",
//                 "MapperIndex": "0-5-6"
//               },
//               {
//                 "EmtpyGroupName": "NA",
//                 "Id": 1639769928818,
//                 "OutputFieldId": 5,
//                 "CustomerName": "Test Cust Name",
//                 "InputFieldName": "Article  EAN",
//                 "OutputFieldName": "EAN",
//                 "IsHeader": false,
//                 "IsHeaderDisplayText": "N",
//                 "GroupName": "Group-3",
//                 "GroupNameDisplayText": "Group-3",
//                 "MapperIndex": "0-5-0"
//               },
//               {
//                 "EmtpyGroupName": "NA",
//                 "Id": 1639769945330,
//                 "OutputFieldId": 7,
//                 "CustomerName": "Test Cust Name",
//                 "InputFieldName": "Article Code",
//                 "OutputFieldName": "SKU",
//                 "IsHeader": false,
//                 "IsHeaderDisplayText": "N",
//                 "GroupName": "Group-3",
//                 "GroupNameDisplayText": "Group-3",
//                 "MapperIndex": "0-5-0"
//               },
//               {
//                 "EmtpyGroupName": "NA",
//                 "Id": 1639769981944,
//                 "OutputFieldId": 6,
//                 "CustomerName": "Test Cust Name",
//                 "InputFieldName": "Description of Goods",
//                 "OutputFieldName": "Description",
//                 "IsHeader": false,
//                 "IsHeaderDisplayText": "N",
//                 "GroupName": "Group-3",
//                 "GroupNameDisplayText": "Group-3",
//                 "MapperIndex": "0-5-0"
//               },
//               {
//                 "EmtpyGroupName": "NA",
//                 "Id": 1639770006244,
//                 "OutputFieldId": 15,
//                 "CustomerName": "Test Cust Name",
//                 "InputFieldName": "HSN",
//                 "OutputFieldName": "HSN",
//                 "IsHeader": false,
//                 "IsHeaderDisplayText": "N",
//                 "GroupName": "Group-1",
//                 "GroupNameDisplayText": "Group-1",
//                 "MapperIndex": "0-5-1"
//               },
//               {
//                 "EmtpyGroupName": "NA",
//                 "Id": 1639770034955,
//                 "OutputFieldId": 18,
//                 "CustomerName": "Test Cust Name",
//                 "InputFieldName": "MRP",
//                 "OutputFieldName": "MRP",
//                 "IsHeader": false,
//                 "IsHeaderDisplayText": "N",
//                 "GroupName": "Group-1",
//                 "GroupNameDisplayText": "Group-1",
//                 "MapperIndex": "0-5-2"
//               },
//               {
//                 "EmtpyGroupName": "NA",
//                 "Id": 1639770058611,
//                 "OutputFieldId": 16,
//                 "CustomerName": "Test Cust Name",
//                 "InputFieldName": "Qty",
//                 "OutputFieldName": "Quantity",
//                 "IsHeader": false,
//                 "IsHeaderDisplayText": "N",
//                 "GroupName": "Group-1",
//                 "GroupNameDisplayText": "Group-1",
//                 "MapperIndex": "0-5-3"
//               },
//               {
//                 "EmtpyGroupName": "NA",
//                 "Id": 1639770094217,
//                 "OutputFieldId": 17,
//                 "CustomerName": "Test Cust Name",
//                 "InputFieldName": "UOM",
//                 "OutputFieldName": "UoM",
//                 "IsHeader": false,
//                 "IsHeaderDisplayText": "N",
//                 "GroupName": "Group-1",
//                 "GroupNameDisplayText": "Group-1",
//                 "MapperIndex": "0-5-4"
//               },
//               {
//                 "EmtpyGroupName": "NA",
//                 "Id": 1639770121811,
//                 "OutputFieldId": 8,
//                 "CustomerName": "Test Cust Name",
//                 "InputFieldName": "Basic Cost",
//                 "OutputFieldName": "Basic Cost",
//                 "IsHeader": false,
//                 "IsHeaderDisplayText": "N",
//                 "GroupName": "Group-1",
//                 "GroupNameDisplayText": "Group-1",
//                 "MapperIndex": "0-5-5"
//               },
//               {
//                 "EmtpyGroupName": "NA",
//                 "Id": 1639770172683,
//                 "OutputFieldId": 11,
//                 "CustomerName": "Test Cust Name",
//                 "InputFieldName": "SGST Amt",
//                 "OutputFieldName": "SGST Amount",
//                 "IsHeader": false,
//                 "IsHeaderDisplayText": "N",
//                 "GroupName": "Group-2",
//                 "GroupNameDisplayText": "Group-2",
//                 "MapperIndex": "0-5-7"
//               },
//               {
//                 "EmtpyGroupName": "NA",
//                 "Id": 1639770217762,
//                 "OutputFieldId": 13,
//                 "CustomerName": "Test Cust Name",
//                 "InputFieldName": "CGST Amt",
//                 "OutputFieldName": "CGST Amount",
//                 "IsHeader": false,
//                 "IsHeaderDisplayText": "N",
//                 "GroupName": "Group-2",
//                 "GroupNameDisplayText": "Group-2",
//                 "MapperIndex": "0-5-8"
//               }
//         ];
//         return mapperData;
//     }

// private getPurchaseOrderHeaderLabelList() {
//     const mapper = this.findMapperInfo();
//     const headerList = mapper.filter((item) => {
//         return (item.IsHeader);
//     });
//     return headerList;
// }

// private getPurchaseOrderDetailsLabelList() {
//     const mapper = this.findMapperInfo();
//     const itemList = mapper.filter((item) => {
//         return (!item.IsHeader);
//     });
//     return itemList;
// }

// private getPurchaseOrderDate(list: Array<string>): string {
//     let poDate = '';
//     const data = this.getProcessedDataByField(list, BBConstatnts.FIELDS_TO_MAGNIFY.PO_DATE, 1);
//     if(data && data[0]) {
//         const splitResult = myHelper.splitString(data[0], '\r');
//         if(splitResult && splitResult.length > 0 && splitResult.length <= 4) {
//             poDate = splitResult[3].replace(':','');
//         }
//     }
//     return poDate;
// }

// private getValidTo() {
//     return "TBD";
// }

// private getSAPMaterialCode(): string {
//     let materialCode = 'TBD';
//     return materialCode;
// }

// private getArticleEAN(item: string): string {
//     let articleEAN = '';
//     if(item) {
//         const splitResult = myHelper.splitString(item, '\r');
//         if(splitResult && splitResult.length > 0) {
//             articleEAN = splitResult[0];
//         }
//     }
//     return articleEAN;
// }

// private getArticleCode(item: string): string {
//     let articleCode = '';
//     if(item) {
//         const splitResult = myHelper.splitString(item, '\r');
//         if(splitResult && splitResult.length > 0) {
//             articleCode = splitResult[1];
//         }
//     }
//     return articleCode;
// }

// private getDescriptionOfGoods(item: string): string {
//     let description = '';
//     if(item) {
//         const splitResult = myHelper.splitString(item, '\r');
//         if(splitResult && splitResult.length && splitResult.length > 2) {
//             for (let i = 0; i < splitResult.length; i++) {
//                 if(i >= 2) {
//                     description = `${description} ${splitResult[i]}`;
//                 }
//             }
//         }
//     }
//     return description;
// }

// private getHSN(item: string): string {
//     let hsn = '';
//     if(item) {
//         const splitResult = myHelper.splitString(item, '\r');
//         if(splitResult && splitResult.length > 0) {
//             for (let i = 0; i < splitResult.length; i++) {
//                 hsn = `${hsn}${splitResult[i]}`;
//             }
//         }
//     }
//     return hsn;
// }  

// private getMRP(item: string): string {
//     let mrp = '0';
//     if(item) {
//         mrp = item;
//     }
//     return mrp;
// }

// private getQuantity(item: string): string {
//     let qty = '0';
//     if(item) {
//         qty = item;
//     }
//     return qty;
// }

// private getUoM(item: string): string {
//     let uom = '';
//     if(item) {
//         uom = item;
//     }
//     return uom;
// }

// private getBasicCost(item: string): string {
//     let badicCost = '0';
//     if(item) {
//         badicCost = item;
//     }
//     return badicCost;
// }


// private getTaxableAmount(item: string): string {
//     let taxableAmt = '0';
//     if(item) {
//         taxableAmt = item;
//     }
//     return taxableAmt;
// }

// private getSGST_Rate(item: string): string {
//     let sgst_Rate = '0';
//     if(item) {
//         const splitResult = myHelper.splitString(item, '\r');
//         if(splitResult && splitResult.length > 0) {
//             sgst_Rate = splitResult[0];
//         }
//     }
//     return sgst_Rate;
// }

// private getSGST_Amount(item: string): string {
//     let sgst_Amount = '0';
//     if(item) {
//         const splitResult = myHelper.splitString(item, '\r');
//         if(splitResult && splitResult.length > 0) {
//             sgst_Amount = splitResult[1];
//         }
//     }
//     return sgst_Amount;
// }

// private getCGST_Rate(item: string): string {
//     let cgst_Rate = '0';
//     if(item) {
//         const splitResult = myHelper.splitString(item, '\r');
//         if(splitResult && splitResult.length > 0) {
//             cgst_Rate = splitResult[0];
//         }
//     }
//     return cgst_Rate;
// }

// private getCGST_Amount(item: string): string {
//     let cgst_Amount = '0';
//     if(item) {
//         const splitResult = myHelper.splitString(item, '\r');
//         if(splitResult && splitResult.length > 0) {
//             cgst_Amount = splitResult[1];
//         }
//     }
//     return cgst_Amount;
// }

// private getTotalAmount(item: string): string {
//     let totalAmount = '0';
//     if(item) {
//         totalAmount = item;
//     }
//     return totalAmount;
// }
// private getProcessedDataByField(rawJsonlist: string[], fieldToMagnify: string, filterCount: number) {
//     const filteredResult = myHelper.filterRawJsonListByLength(rawJsonlist, filterCount);
//     const data = myHelper.filterRawJsonListBySearchTerm(filteredResult, fieldToMagnify);
//     return data;
// }
 // tbd save mapperindex == colIndex
//  private getItemDetailsByColumnIndex(colIndex: number, itemDetailsList: Array<any>) {
//     const result = itemDetailsList.filter((item) => {
//         const originalMapperIndex = item.MapperIndex;
//         const splitMapperIndexResult = myHelper.splitString(item.MapperIndex, '-');
//         if(splitMapperIndexResult && splitMapperIndexResult.length === 3) {
//             const tempMapperIndex = parseInt(splitMapperIndexResult[2]);
//             const computedMapperIndex = `${splitMapperIndexResult[0]}-${splitMapperIndexResult[1]}-${tempMapperIndex}`;
//             if(tempMapperIndex === colIndex){
//                 return item;
//             }
//         }
//     });
//     return result;
// }
   
//python 
// def read_pdf_using_pandas():
//     path = '28-9-2021_poid_7.pdf'
//     # df_with_mutltiple_table = tabula.read_pdf(path,output_format='json')
//     df = tabula.read_pdf(path,
//                         encoding="utf-8",
//                         java_options=None,multiple_tables=False,
                        
//                         )
//     # df = df_without_mutltiple_table[0].drop(["Disc %"], axis=1)
//     # print(df_without_mutltiple_table)
//     print('+++++++++++++++++++++++++++', type(df))
//     # print(df_without_mutltiple_table)
//     # a = pd.DataFrame(df_without_mutltiple_table)
//     # print(a)    
//     len = df.__len__()
//     print(len)
//     if len > 0 :
//         # clean_df = df[0].replace('\r','', regex=True)
//         # print(clean_df[0])
//         my_list = df[0].values.tolist()[0]
//         print(my_list)
//         # print("COL:",df[0].columns)
//         my_list = []
        
//     # for item in df:  
//         # print(item)          
//         # for row in item.get(0):                        
//             # print("")
//             # if(row != 'nan'):
//                 # print(row)
//             #for d in item:
//             # print(":",d)
//         for l in  df[0].values.tolist()[0]:
//             print(l,'--')
