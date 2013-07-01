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
import base64
import Image
from cStringIO import StringIO
import datetime

# Configuration
UPLOAD_FOLDER = './static/uploads'
ALLOWED_EXTENSIONS = set(['jpg', 'jpeg', 'gif'])

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.debug = True
app.config.from_object(__name__)

con = None

def getPostData(request, key):
    try:
        ret = request.form[key]
    except:
        ret = ''
        
    return ret

def getArg(request, key):
    try:
        return request.args.get(key)
    except:
        return None
        

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

''' Sites '''

@app.route('/')
def index():
    
    swarmlist = dbhandler.swarmList(limit=5)
    
    return render_template('index.html', swarmlist=swarmlist)
    
    
    
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
        lat = float(getArg(request, 'lat'))
        lon = float(getArg(request, 'lon'))
        radius = float(getArg(request, 'radius'))
    except:
        lat = lon = radius = None
    genus = getArg(request, 'genus')
    species = getArg(request, 'species')
    startdate = getArg(request, 'startdate')
    limit = getArg(request, 'limit') 
    image = getArg(request, 'image')
    
    swarmlist = dbhandler.swarmList([lat, lon], radius, genus, species, startdate, limit)
    
    if swarmlist != None:
        sys.stderr.write("Got " + str(len(swarmlist)) + " swarms!\n")
        
        
        
        jsonstr = ""
        for swarm in swarmlist:
            ###convert pics to base64 string
            if swarm['image'] and image == "true":
                imgsize = 128, 128 # maximal image size
                try:
#                     with open(os.path.join(app.config['UPLOAD_FOLDER'], str(swarm['image'])), "rb") as image_file:
#                         imgstring = base64.b64encode(image_file.read())
#                         swarm['image'] = imgstring;
#                         sys.stderr.write("Imagestring length: " + str(len(imgstring)) + "\n")
                    img = Image.open( os.path.join(app.config['UPLOAD_FOLDER'], str(swarm['image'])) )
                    img.thumbnail(imgsize, Image.ANTIALIAS)
                    output = StringIO()
                    img.save(output, format='JPEG')
                    imgstring = base64.b64encode(output.getvalue())
                    swarm['image'] = imgstring;
                    sys.stderr.write("Imagestring length: " + str(len(imgstring)) + "\n")
                except Exception, e:
                    sys.stderr.write("Image " + str(swarm['image']) + e.message + "\n")
                    swarm['image'] = ''
            else:
                swarm['image'] = ''
            
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
        
        
        ### get form data
        comment = getPostData(request, 'comment')
        date = getPostData(request, 'date')
        try:
            date = datetime.datetime.strptime(date, "%d.%m.%Y").strftime("%Y/%m/%d")
        except Exception, e:
            sys.stderr.write(str(e.message))
        
        timedata = getPostData(request, 'time')
        lat = getPostData(request, 'lat')
        lon = getPostData(request, 'lon')
        genus = getPostData(request, 'genus')
        species = getPostData(request, 'species')
        photo = getPostData(request, 'photo')
        
        try:
            upload = request.files['file']
            #sys.stderr.write("FILE: " + str(request.files['file'])+"\n") 
        except:
            upload = None                
        
        # picture
        filename = ""
        if upload != None and upload.filename != '':
            sys.stderr.write("Photo!\n")
            filename = secure_filename(upload.filename)
            filename = str(time.time())+filename+".jpg"
            upload.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            #return redirect(url_for('uploaded_file', filename=filename))
        elif photo != '':
            if 'base64' in photo:
                sys.stderr.write("Photo base64 encoded!\n")
                imgData = photo.rsplit(';base64,', 2)
                imgType = imgData[0].rsplit('/')
                filename = str(time.time()) + "." + str(imgType[1])
                with open(os.path.join(app.config['UPLOAD_FOLDER'], filename),"wb") as f:
                    f.write(base64.decodestring(imgData[1]))
            else:
                sys.stderr.write("Wrong filetype? " + str(photo) + "\n")
        
        ### save swarm in DB
        sys.stderr.write("Write to DB!\n")
        dbhandler.newSwarm([lat, lon], 
                           str(date) + " " + str(timedata),
                           genus,
                           species,
                           filename,
                           comment)
    else:
        sys.stderr.write(str(request.method))
    
    return Response()
 


if __name__ == '__main__':
   
    dbhandler.fillDB()
    app.run(host="0.0.0.0", port=5000)    