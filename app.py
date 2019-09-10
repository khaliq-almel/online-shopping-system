from flask import Flask, render_template, request, jsonify
import json
from werkzeug import secure_filename

path ='/home/khaliq/Documents/dbms/onlineShopping/app/static/json/products.json'
base='/home/khaliq/Documents/dbms/onlineShopping/app/static/json/'



app = Flask(__name__, static_url_path='/static')

@app.route("/search")
def searchResult():
    query= str(request.args.get('query'))
    if("mobile" in query):
        mobiles = json.loads(open(base+"mobiles.json").read())
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(mobiles, f, ensure_ascii=False, indent=4)
    
    return render_template("index.html")
    
    

@app.route("/")
def root():
    all = json.loads(open(base+"all.json").read())
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(all, f, ensure_ascii=False, indent=4)
    
    return render_template("index.html")





if(__name__ == "__main__"):
    app.run(debug= True)




'''
@app.route("/success/<name>")
def main(name):
    return("hello world " + name)

@app.route("/")
def home():
    return(render_template("main.html"))


@app.route("/login",methods=['POST','GET'])
def test():
    if (request.method == 'POST'):
        user = request.form['nm']
        return redirect(url_for('main',name = user))
    else:
        user = request.args.get('nm')
        return redirect(url_for('main',name = user))


@app.route('/uploader', methods = ['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        f = request.files['file']
        f.save(secure_filename(f.filename))
        return 'file uploaded successfully'


if(__name__ == "__main__"):
    app.run(debug= True)
'''