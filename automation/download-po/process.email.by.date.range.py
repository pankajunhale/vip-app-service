import smtplib
import time
import imaplib
import email
import traceback 
import os
from datetime import datetime
import logging
import importlib

moduleName = 'common-utility'
utility = importlib.import_module(moduleName)
print(utility.getTodaysDate())
# -------------------------------------------------
#
# Utility to read email from Gmail Using Python
#
# ------------------------------------------------

# Create or get the logger
logger = logging.getLogger(__name__)  

# set log level
logger.setLevel(logging.INFO)

# define file handler and set formatter
now = datetime.now()
current_time = now.strftime('')
print("Today date is: ", datetime.today())
file_handler = logging.FileHandler('logfile.log')
formatter    = logging.Formatter('%(asctime)s : %(levelname)s : %(name)s : %(message)s')
file_handler.setFormatter(formatter)

# add file handler to logger
logger.addHandler(file_handler)

ORG_EMAIL = "@copiacs.com" 
FROM_EMAIL = "pankaj.u" + ORG_EMAIL 
FROM_PWD = "copia@123" 
SMTP_SERVER = "imap.gmail.com" 
SMTP_PORT = 993
SENDER_EMAIL_ID = "pankajunhale@gmail.com"

def divide(x, y):
    try:
        out = x / y
    except ZeroDivisionError:
        logger.exception("Division by zero problem")
    else:
        return out

logger.error("{c}".format(c = divide(10,0)))
# Function to get email content part i.e its body part
def get_body(msg):
    if msg.is_multipart():
        print('yes')
        return get_body(msg.get_payload(0))
    else:
        print('no')
        return msg.get_payload(None, True)
 
# Function to search for a key value pair
def search(key, value, con):
    result, data = con.search(None, key, '"{}"'.format(value))
    print(data)
    return data
 
# Function to get the list of emails under this label
def get_emails(result_bytes):
    msgs = [] # all the email data are pushed inside an array
    for num in result_bytes[0].split():
        typ, data = con.fetch(num, '(RFC822)')
        bytes_data = data[0]
        msgs.append(data)
    return msgs

def get_time():   
    now = datetime.now()
    current_time = now.strftime("%H:%M:%S")
    return current_time

con = imaplib.IMAP4_SSL(SMTP_SERVER)
con.login(FROM_EMAIL,FROM_PWD)
con.select('inbox')
#emails = search('FROM','enq_P@camsonline.com', con)
isOk, msgNumbers = con.search(None, '(SENTSINCE "21-Sep-2021")')

print(isOk)
for num in msgNumbers[0].split():
    _, data = con.fetch(num , '(RFC822)')
    _, bytes_data = data[0]

    #convert the byte data to message
    email_message = email.message_from_bytes(bytes_data)
    print("\n===========================================")

    #access data
    
    #print("From: ",email.utils.parseaddr(email_message["from"])[1])
    if SENDER_EMAIL_ID == email.utils.parseaddr(email_message["from"])[1]:
        for part in email_message.walk():
            counter = 0
            if part.get_content_type()=="application/octet-stream":
                message = part.get_payload(decode=True)
                filename = part.get_filename() 
                print("Message: \n", filename)
                print("==========================================\n")
                if filename is not None: 
                    counter = counter + 1
                    sv_path = os.path.join('./', get_time() + '-PO.pdf') 
                    if not os.path.isfile(sv_path): 
                        print(sv_path)        
                        fp = open(sv_path, 'wb') 
                        fp.write(part.get_payload(decode=True)) 
                        fp.close() 
                break
