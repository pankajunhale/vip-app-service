import smtplib
import imaplib
import email
import traceback 
import os
from datetime import datetime
import logging
import importlib
import constant
moduleName = 'common-utility'
utility = importlib.import_module(moduleName)

# -------------------------------------------------
#
# Utility to read email from Gmail Using Python
#
# ------------------------------------------------


# Create or get the logger
logger = logging.getLogger(__name__)  
# set log level
logger.setLevel(logging.INFO)
file_handler = logging.FileHandler('logfile.log')
formatter    = logging.Formatter('%(asctime)s : %(levelname)s : %(name)s : %(message)s')
file_handler.setFormatter(formatter)
# add file handler to logger
logger.addHandler(file_handler)

# define file handler and set formatter
now = datetime.now()
current_time = now.strftime('')
print("Today date is: ", datetime.today())

logger.info('my logging message')

con = imaplib.IMAP4_SSL(constant.SMTP_SERVER,constant.SMTP_PORT)
con.login(constant.FROM_EMAIL,constant.FROM_PWD)
con.select('inbox')
isOk, msgNumbers = con.search(None, '(SENTSINCE "21-Sep-2021")')

print(isOk)
for num in msgNumbers[0].split():
    _, data = con.fetch(num , '(RFC822)')
    _, bytes_data = data[0]

    #convert the byte data to message
    email_message = email.message_from_bytes(bytes_data)
    print("\n===========================================")

    #print("From: ",email.utils.parseaddr(email_message["from"])[1])
    if constant.SENDER_EMAIL_ID == email.utils.parseaddr(email_message["from"])[1]:
        for part in email_message.walk():
            counter = 0
            if part.get_content_type() == constant.STREAM_TYPE_OCTET:
                message = part.get_payload(decode=True)
                filename = part.get_filename() 
                print("Message: \n", filename)
                print("==========================================\n")
                if filename is not None: 
                    counter = counter + 1
                    sv_path = os.path.join('./', utility.get_time() + '-PO.pdf') 
                    if not os.path.isfile(sv_path): 
                        print(sv_path)        
                        fp = open(sv_path, 'wb') 
                        fp.write(part.get_payload(decode=True)) 
                        fp.close() 
                break
