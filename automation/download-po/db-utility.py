import mysql.connector as mysql
from datetime import datetime

MY_HOST = "localhost"
MY_USER = "root"
MY_PASSWORD = "SQL123456"
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
            pdf_file_path,has_attachment):
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
        query = "INSERT INTO purchase_order_master (email_from,email_subject,email_received_at,message_id,pdf_file_name,pdf_file_path,has_attachment,created_at) VALUES (%s, %s,%s, %s,%s, %s, %s,%s)"
        values = (email_id,email_subject,email_received_at,message_id,pdf_file_name,pdf_file_path,has_attachment,datetime.now())
        cur.execute(query, values)
        db.commit()
        print(cur.rowcount)
    except mysql.Error as error:
        print(f"could not insert into table purchaseorderinfo: {error}")
        exit(1)
    
    cur.close()
    db.close()

if __name__ == "__main__":
    main()