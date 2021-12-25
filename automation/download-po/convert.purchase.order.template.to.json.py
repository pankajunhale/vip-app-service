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
# Utility to convert pdf template to json
#
# ------------------------------------------------

# Create or get the logger
logger = logging.getLogger(__name__)  
# set log level
logger.setLevel(logging.INFO)
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
            print("Id = ", row[1])
            tabula.convert_into(basePath + "/" + row[1] , basePath + "/myddd.json" , output_format="json", pages="all", lattice = True, stream = False)
            
    except RuntimeError as error:
        print(f"Runtime Error: {error}")
        logger.error("Runtime Error:{a}".format(a=error))
        exit(1)

if __name__ == "__main__":
    main()