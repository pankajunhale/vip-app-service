from genericpath import isfile
import importlib
import mysql.connector as mysql
from datetime import datetime
import os
moduleName = 'common-utility'
utility = importlib.import_module(moduleName)

MY_HOST = "localhost"
MY_USER = "root"
MY_PASSWORD = "vip@123456"
MY_DB = "vip-po-automation-dev-db"

def main():
    db = None
    cur = None
    try:
        db = mysql.connect(host=MY_HOST, user=MY_USER, password=MY_PASSWORD, database=MY_DB)
        cur = db.cursor(prepared=True)
        print("connected")
        print(mysql.__version__)
    except mysql.Error as error:
        print(f"could not connect to MySql: {error}")
        exit(1)

    cur.close()
    db.close()


def create_po(email_id,email_subject,email_received_at,message_id,pdf_file_name,
            pdf_file_path,has_attachment,
            json_file_name, json_file_path
            ):
    db = None
    cur = None
    try:
        db = mysql.connect(host=MY_HOST, user=MY_USER, password=MY_PASSWORD, database=MY_DB)
        cur = db.cursor(prepared=True)
        print("connected")
        print(mysql.__version__)
    except mysql.Error as error:
        print(f"could not connect to MySql: {error}")
        exit(1)
    try:
        created_by = 'JOB'
        query = "INSERT INTO purchase_order_master (email_from,email_subject,email_received_at,message_id,pdf_file_name,pdf_file_path,has_attachment,created_at,json_file_name,json_file_path,is_pdf_downloaded,is_pdf_converted_to_json) VALUES (%s, %s,%s, %s,%s, %s, %s,%s,%s,%s,%s,%s)"
        values = (email_id,email_subject,email_received_at,message_id,
                pdf_file_name,pdf_file_path,has_attachment,datetime.now(),
                json_file_name,json_file_path,
                utility.isFileExist(pdf_file_path),
                utility.isFileExist(json_file_path)
                )
        cur.execute(query, values)
        db.commit()
        print(cur.rowcount)
    except mysql.Error as error:
        print(f"could not insert into table purchaseorderinfo: {error}")
        exit(1)
    
    cur.close()
    db.close()
    
def find_all_po_templates_for_conversion():
    db = None
    cur = None
    try:
        db = mysql.connect(host=MY_HOST, user=MY_USER, password=MY_PASSWORD, database=MY_DB)
        cur = db.cursor(prepared=True)
        print("connected")
        print(mysql.__version__)
    except mysql.Error as error:
        print(f"could not connect to MySql: {error}")
        exit(1)
    try:        
        query = "SELECT id,purchase_order_pdf_template FROM customer_information where is_pdf_converted_to_json = 0 ORDER BY created_at DESC"
        cur.execute(query)
         # get all records
        records = cur.fetchall()
        print("Total number of rows in table: ", cur.rowcount)        
        
        print("\nPrinting each row")
        for row in records:
            print("Id = ", row[1], )
        return records
        
    except mysql.Error as error:
        print(f"could not insert into table purchaseorderinfo: {error}")
        exit(1)
    
    cur.close()
    db.close()

if __name__ == "__main__":
    main()