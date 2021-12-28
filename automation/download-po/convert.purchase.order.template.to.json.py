import os
from datetime import datetime
import logging
import importlib
import traceback
import tabula
moduleName = 'common-utility'
utility = importlib.import_module(moduleName)
db_module_name = 'db-utility'
db_utility = importlib.import_module(db_module_name)

# -------------------------------------------------
#
# Utility to convert pdf template to json
#
# ------------------------------------------------

# Create or get the logger
logger = logging.getLogger(__name__)  
# set log level
logger.setLevel(logging.DEBUG)
file_handler = logging.FileHandler('logfile-converter-process.log')
formatter    = logging.Formatter('%(asctime)s : %(levelname)s : %(name)s : %(message)s')
file_handler.setFormatter(formatter)
# add file handler to logger
logger.addHandler(file_handler)

def main():
    try:
        logger.info('running main()')
        # os.chdir(os.path.dirname(os.path.abspath(__file__)))
        logger.info(os.getcwd())
        os.chdir('../../assets/resources/')
        basePath = os.getcwd()
        logger.info(basePath)
        # print(db_utility.find_all_po_templates_for_conversion())
        for row in db_utility.find_all_po_templates_for_conversion():
            file = row[1].lower().split('.pdf')[0] + ".json"
            pathName = basePath + "/" + file
            logger.info("Customer Id:{a}".format(a=row[1].split('.pdf')[0]))
            logger.info("File Name(PDF):{a}".format(a=row[1]))
            logger.info("Full Path:{a}".format(a=pathName))
            try:
                convert_result = tabula.convert_into(basePath + "/" + row[1] , pathName , output_format="json", pages="all", lattice = True, stream = False)
                print(convert_result)
                if(convert_result == None):
                    db_utility.update_po_templates_after_conversion(file,row[0])
                    logger.info("Tabula conversion (success):{a} for file:{b} ".format(a=convert_result,b=file))                
            except FileNotFoundError as error:
                logger.debug("Runtime Error:{a}".format(a=error))        
            
    except RuntimeError as error:                
        logger.debug(traceback.format_exc())

if __name__ == "__main__":
    main()