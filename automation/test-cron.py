from datetime import datetime
import traceback
import os
 
def write_file(filename,data):
    try:
        if os.path.isfile(filename):
            with open(filename, 'a') as f:          
                f.write('\n' + data)   
        else:
            with open(filename, 'w') as f:                   
                f.write(data)
    except Exception as e:
        traceback.print_exc() 
        print(str(e)) 
 
def print_time():   
    now = datetime.now()
    current_time = now.strftime("%H:%M:%S")
    data = "Current Time:- " + current_time + ":-" + basePath
    return data

os.chdir(os.path.dirname(os.path.abspath(__file__)))
basePath = os.getcwd() + '/test-new-02.txt'

print(basePath)
print('basename:    ', os.path.basename(__file__))
print('dirname:     ', os.path.dirname(__file__))
print('[change directory]')

print('getcwd:      ', os.getcwd())
#print(newPath + "tere")
write_file(basePath , print_time())