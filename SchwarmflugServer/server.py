'''
Created on 20.05.2013

@author: kolbe

SchwarmflugServer
-----------------
Sends and stores mockup data for SchwarmflugApp

'''
import os, sys
from flask import Flask, render_template, request, abort, json, jsonify, make_response, redirect, url_for, Response
from werkzeug import secure_filename
import species

# Configuration
UPLOAD_FOLDER = './uploads'
ALLOWED_EXTENSIONS = set(['jpg', 'jpeg', 'gif', ''])

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.debug = True
app.config.from_object(__name__)


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/genuslist')
def genuslist():
    genuslist = species.genusFromFile('artenliste.txt')
    
    if genuslist != None:
        return Response(json.dumps(genuslist),  mimetype='application/json')
    else:
        print '404'
        abort(404)

@app.route('/specieslist', methods=['GET', 'POST'])
def specieslist():
    
    print(str(request.args["genus"]))    
    if request.method == 'GET':
        if request.args["genus"] != None:
            specieslist = species.getSpecies(str(request.args['genus']), 'artenliste.txt')
            if specieslist != None:
                return Response(json.dumps(specieslist),  mimetype='application/json')
    else:
        abort(404)

@app.route('/newswarm', methods=['GET', 'POST'])
def newswarm():
    if request.method == 'POST':
        ### POST new swarm into DB
        print str(request.form)      
        
        # picture
        upload = request.files['file']
        if upload and allowed_file(upload.filename):
            sys.stderr.write("Photo")
            filename = secure_filename(upload.filename)
            upload.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            return redirect(url_for('uploaded_file', filename=filename))
        
        if request.form['datetime'] != None:
            sys.stderr.write(str(request.form['datetime']))
        if request.form['lon'] != None:
            sys.stderr.write(str(request.form['lon']))
        '''
        if request.form['lat'] != None:
            print request.form['lat']
        if request.form['genus'] != None:
            print request.form['genus']
        if request.form['species'] != None:
            print request.form['species']
        if request.form['comment'] != None:
            print request.form['comment']
        '''
    else:
        print str(request.method)
    
    return "OK"
    

if __name__ == '__main__':
    app.run(host="192.168.100.26", port=5000)