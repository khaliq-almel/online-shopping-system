import json
import pyperclip as py

i=int(input("enter the value of image I"))
cost =''
title=''
path ='/home/khaliq/Documents/dbms/onlineShopping/app/static/json/mobiles.json'
while(True):
    config = json.loads(open(path).read())
    #print(config["items"])
    ss=input("for title")
    title=py.paste()
    ss=input("for Price")
    #cost=py.paste()
    cost = ss
    cost=str(int((float(cost)/70))) +".99"

    x={
        "sys": { "id": str(i)},
        "fields": {
            "title": title,
            "price": cost,
            "image": { "fields": { "file": { "url": "static/images/mobile-"+str(i)+".jpg" } } }
        }
    }
    py.copy("mobile-"+str(i))
    i=i+1
    config["items"].append(x)
    print(type(x))


    with open(path, 'w', encoding='utf-8') as f:
        json.dump(config, f, ensure_ascii=False, indent=4)
'''
x={
    "sys": { "id": id },
    "fields": {
        "title": title,
        "price": price,
        "image": { "fields": { "file": { "url": "static/images/mobile-"+str(i)+".jpg" } } }
    }
}

'''