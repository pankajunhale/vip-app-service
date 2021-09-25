import mysql.connector as mysql

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

    try:
        row_data = (
            ('1234561','ZQTH','VIPL', 'MT', 'HL'),
            ('1234562','ZQTH','VIPL', 'MT', 'HL'),
            ('1234563','ZQTH','VIPL', 'MT', 'HL'),
            ('1234564','ZQTH','VIPL', 'MT', 'HL'),
        )

        #query = ("INSERT INTO purchaseorderinfo () VALUES (?,?,?,?,?)", row_data)
        query = """INSERT INTO purchaseorderinfo(purchase_order_number,order_type,sales_org,distributor_channel,division) VALUES (%s,%s,%s,%s,%s)"""
        cur.executemany(query,row_data)
        db.commit()
        print(cur.rowcount)
    except mysql.Error as error:
        print(f"could not insert into table purchaseorderinfo: {error}")
        exit(1)
    
    cur.close()
    db.close()

if __name__ == "__main__":
    main()