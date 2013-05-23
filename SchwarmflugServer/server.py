'''
Created on 20.05.2013

@author: kolbe

SchwarmflugServer
-----------------
Sends and stores mockup data for SchwarmflugApp

'''

from flask import Flask, render_template, request, abort, json, jsonify, make_response
import species

# Configuration
app = Flask(__name__)
app.debug = True
app.config.from_object(__name__)
#app.config.from_envvar('GEOREPORT_SETTINGS', silent=True)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/specieslist')
def specieslist():
    specieslist = species.speciesFromFile('artenliste.txt')
    if specieslist != None:
        return specieslist
    else:
        print '404'
        abort(404)

@app.route('/newswarm', methods=['GET', 'POST'])
def newswarm():
    if request.method == 'POST':
        ### POST new swarm into DB
        print 'POST' + request.content
        pass
    '''
    print request.form['genus']
    print request.form['species']
    print request.form['lat']
    print request.form['lon']
    print request.form['photo']
    print request.form['comment']
    '''
    
    return "123"
    

if __name__ == '__main__':
    app.run()