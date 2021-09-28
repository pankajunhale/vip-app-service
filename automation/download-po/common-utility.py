from datetime import date

def get_todays_date():

    current_time = date.today()
        
    # Printing attributes of now(). 
    today = "{a}-{b}-{c}".format(a=current_time.day,b=current_time.month,c=current_time.year)
    return today

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
def get_emails(result_bytes, con):
    msgs = [] # all the email data are pushed inside an array
    for num in result_bytes[0].split():
        typ, data = con.fetch(num, '(RFC822)')
        bytes_data = data[0]
        msgs.append(data)
    return msgs

def get_time():   
    now = date.today()
    current_time = now.strftime("%H:%M:%S")
    return current_time

def is_file_exist():
    return 1
