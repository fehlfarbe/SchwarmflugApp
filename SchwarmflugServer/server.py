'''
Created on 20.05.2013

@author: kolbe

SchwarmflugServer
-----------------
Sends and stores mockup data for SchwarmflugApp

'''
import os, sys, time
from flask import Flask, render_template, request, abort, json, jsonify, make_response, redirect, url_for, Response
from werkzeug import secure_filename
import dbhandler

# Configuration
UPLOAD_FOLDER = './uploads'
ALLOWED_EXTENSIONS = set(['jpg', 'jpeg', 'gif', ''])

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.debug = True
app.config.from_object(__name__)

con = None


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

''' Sites '''

@app.route('/')
def index():
    
    swarmlist = dbhandler.swarmList()
    
    res = ""
    
    for swarm in swarmlist:
        res += "<h2>Schwarm " + str(swarm['id']) + "</h2> \
                <b>Zeit:</b> " + str(swarm['date']) + "<br /> \
                <b>Art:</b> " + swarm['genus'] + " " + swarm['species'] + " <br />\
                <b>Kommentar:</b> " + swarm['comment'] + " <br /> \
                <img src=\"uploads/" + swarm['image'] + "\" />"
    
    return Response(res)
    
    #return render_template('index.html')

''' Routes '''
@app.route('/swarmlist', methods=['GET', 'POST'])
def swarmlist():
    
    try:
        lat = float(request.args.get('lat'))
        lon = float(request.args.get('lon'))
        radius = float(request.args.get('radius'))
    except:
        lat = lon = radius = None
    
    sys.stderr.write(str(lat) + " " + str(lon) + " " + str(radius) + "\n")
    if lat != None and lon != None and radius != None:
        swarmlist = dbhandler.swarmList([lat, lon], radius)
    else:
        swarmlist = dbhandler.swarmList()
    
    if swarmlist != None:
        sys.stderr.write("Got " + str(len(swarmlist)) + " swarms!\n")
        jsonstr = ""
        for swarm in swarmlist:
            jsonstr += json.dumps(swarm) + "\n"            
        
        return Response(json.dumps({"swarms" : swarmlist}), mimetype='application/json')
    
    return Response()

@app.route('/fullspecieslist')
def fullspecieslist():        
        specieslist = dbhandler.fullSpeciesList()
        if specieslist != None:
            return Response(json.dumps(specieslist),  mimetype='application/json')


@app.route('/newswarm', methods=['GET', 'POST'])
def newswarm():
    
    #return Response(code=200)

    if request.method == 'POST':
        ### POST new swarm into DB
        sys.stderr.write("POST\n")
        sys.stderr.write(str(request.form)+"\n")      
        
        # picture
        sys.stderr.write("FILE: " + str(request.files['file'])+"\n")  
        upload = request.files['file']
        filename = ""
        if upload:
            sys.stderr.write("Photo!\n")
            filename = secure_filename(upload.filename)
            filename = str(time.time())+filename+".jpg"
            upload.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            #return redirect(url_for('uploaded_file', filename=filename))
        
        dbhandler.newSwarm([request.form['lat'], request.form['lon']], 
                           str(request.form['date']) + " " + str(request.form['time']),
                           request.form['genus'],
                           request.form['species'],
                           filename,
                           request.form['comment'])
    else:
        sys.stderr.write(str(request.method))
    
    return Response()
 


if __name__ == '__main__':
   
    dbhandler.fillDB()
    app.run(host="192.168.100.28", port=5000)    