import smtplib
import imaplib
import email
import traceback 
import os
from datetime import datetime
import logging
import importlib
import constant
import tabula
moduleName = 'common-utility'
utility = importlib.import_module(moduleName)
db_module_name = 'db-utility'
db_utility = importlib.import_module(db_module_name)
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
print("Today date is: ",utility.get_sent_since_query())

logger.info('my logging message')
def main():
    try:
        con = imaplib.IMAP4_SSL(constant.SMTP_SERVER,constant.SMTP_PORT)
        con.login(constant.FROM_EMAIL,constant.FROM_PWD)
        con.select('inbox')
        isOk, msgNumbers = con.search(None, utility.get_sent_since_query())
        #sql isExist
        #folder
        # insert into db
        # log file 
        print(isOk)
        if isOk == "OK":
            for num in msgNumbers[0].split():
                _, data = con.fetch(num , '(RFC822)')
                _, bytes_data = data[0]

                #convert the byte data to message
                email_message = email.message_from_bytes(bytes_data)
                print("\n==========================================={a}".format(a=num))
                email_from = email.utils.parseaddr(email_message["from"])[1]
                messageId = num.decode()
                #subject = email.utils.parseaddr(email_message.get ["subject"])[1]
                received_at = email.utils.parseaddr(email_message["timestamp"])[1]
                hasAttchment = False
                logger.info("messageId:{a}".format(a=messageId))
                logger.info("received_at:{a}".format(a=received_at))
                logger.info("email_from:{a}".format(a=email_from))

                #print("From: ",email.utils.parseaddr(email_message["from"])[1])
                #TBD - remove the below if condition
                #TBD - collect and insert email data: from-email,timestamp,subject,pdf file + path,messageId,jsonfile+path
                #TBD - add flags isPDFDownloaded,isPdfConvertedToJson,isJsonParsed(update), poNumber(update), sold_to_party
                #TBD - po-createdAt
                path = None
                # if os.environ['HOME'] is not None:                    
                #     path = os.environ['HOME']
                # else:
                path = os.path.dirname(__file__)

                print(path)
            #     create_po(email_id,email_subject,email_received_at,message_id,pdf_file_name,
            # pdf_file_path):
                for part in email_message.walk():
                    counter = 0
                    if part.get_content_type() == "application/pdf":
                        filename = part.get_filename() 
                        hasAttachment = True
                        pdf_file_name = utility.get_todays_date() + '_poid_'+ str(messageId) + '.pdf'
                        json_file_name = utility.get_todays_date() + '_poid_'+ str(messageId) + '.json'

                        sv_path = os.path.join('./', pdf_file_name) 
                        json_file_path = os.path.join('./', json_file_name) 
                        if filename is not None: 
                            counter = counter + 1
                            if not os.path.isfile(sv_path): 
                                try:
                                    fp = open(sv_path, 'wb') 
                                    fp.write(part.get_payload(decode=True)) 
                                    fp.close() 
                                    convert_pdf_to_json(sv_path,json_file_path)
                                    create_po_master(email_from,'',utility.get_todays_date(),messageId,pdf_file_name,sv_path,hasAttachment,json_file_name,json_file_path)
                                except OSError as error:
                                    logger.info("Error:{a}".format(a=error))
                            else:
                                logger.info("File is already exist:{a}".format(a=sv_path))
                        else:
                            logger.info("File is not attached or None")
                    else:
                        logger.info("File has no pdf")
        else:
            print(f"connection to mail not successful !!")
            exit(1)

    except RuntimeError as error:
        print(f"Runtime Error: {error}")
        logger.error("Runtime Error:{a}".format(a=error))
        exit(1)

def create_po_master(email_id,email_subject,email_received_at,message_id,pdf_file_name,pdf_file_path,has_attachment,json_file_name,json_file_path):
    try:
        print(email_id)
        db_utility.create_po(email_id,'email_subject',email_received_at,message_id,pdf_file_name,pdf_file_path,has_attachment,json_file_name,json_file_path)
    except RuntimeError as error:
        print(f"Runtime Error: {error}")
        logger.error("Runtime Error:{a}".format(a=error))
        exit(1)

def convert_pdf_to_json(pdfFileName, jsonFileName):
    try:
        logger.info('PDF File name:{a}'.format(a=pdfFileName))
        logger.info('JSON File name:{a}'.format(a=jsonFileName))
        tabula.convert_into(pdfFileName, jsonFileName, output_format="json", pages="all", lattice = True, stream = False)
    except RuntimeError as error:
        print(f"Error in converting pdf to json: {error}")
        logger.error("Error in converting pdf to json:{a}".format(a=error))
        exit(1)


if __name__ == "__main__":
    main()
