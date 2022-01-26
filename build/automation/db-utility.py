from dotenv import load_dotenv
import importlib
import mysql.connector as mysql
from datetime import datetime
import os
moduleName = 'common-utility'
utility = importlib.import_module(moduleName)

load_dotenv()
print(os.getenv("API_PORT"))
print(os.getenv("DB_HOST"))
print(os.getenv("DB_USER"))
print(os.getenv("DB"))

MY_HOST = os.getenv("DB_HOST")
MY_USER = os.getenv("DB_USER")
MY_PASSWORD = os.getenv("DB_PASSWORD")
MY_DB = os.getenv("DB")

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
    finally:
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
    finally:
        cur.close()
        db.close()


def update_po_templates_after_conversion(jsonFileName, customerId):
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
        query = """UPDATE customer_information
                    SET
                        purchase_order_json_template = %s,
                        is_pdf_converted_to_json = %s
                    WHERE id = %s """
        print(query)
        val = (jsonFileName, 1, customerId)        
        cur.execute(query, val)
        db.commit()
        print(cur.rowcount)
    except mysql.Error as error:
        print(f"could not update table customer_information after JSON conversion: {error}")


if __name__ == "__main__":
    main()