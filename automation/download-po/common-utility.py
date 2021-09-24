from datetime import date

def getTodaysDate():

    current_time = date.today()
        
    # Printing attributes of now(). 
    print ("The attributes of now() are : ") 
        
    print ("Year : ", end = "") 
    print (current_time.year) 
        
    print ("Month : ", end = "") 
    print (current_time.month) 
        
    print ("Day : ", end = "") 
    print (current_time.day) 
    today = "{a}".format(a=current_time.year)
    return today
