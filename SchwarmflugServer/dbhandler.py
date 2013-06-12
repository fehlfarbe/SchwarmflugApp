'''
Created on 12.06.2013

@author: kolbe
'''
import sqlite3 as sql
import species
import sys
import json

### Settings
dbname = "antbase.db"

''' Fill DB if empty '''
def fillDB():
    
    con = sql.connect(dbname)
    
    with con:
        
        ### species list
        try:
            cur = con.cursor()
            data = cur.execute('SELECT count(*) FROM species')
            data = cur.fetchone()
            
            #sys.stderr.write(str(data[0]) + "\n")
            
            if data[0] == 0:
                raise sql.OperationalError
        
        except sql.OperationalError, e:
            sys.stderr.write("create species table\n")
            cur.execute("DROP TABLE IF EXISTS species")
            cur.execute("CREATE TABLE species(id INTEGER PRIMARY KEY AUTOINCREMENT, genus VARCHAR(50), species VARCHAR(50), country VARCHAR(50), state VARCHAR(50))")
            
            sys.stderr.write('fill db\n')
            specieslist = species.speciesArray('artenliste.txt')
            
            for ant in specieslist:
                #sys.stderr.write(str(ant) + "\n")
                cur.execute("INSERT INTO species \
                VALUES(\
                NULL, \
                '" + ant['genus'] +"', \
                '" + ant['species'] +"', \
                '" + ant['country'] +"', \
                '" + ant['state'] +"')")
                
            sys.stderr.write("filled!\n")
            
            cur = con.cursor()
            data = cur.execute('SELECT * FROM species')
            data = cur.fetchone()
            
            sys.stderr.write(str(data)+"\n")
            
        ### swarmlist 
        try:
            cur = con.cursor()
            data = cur.execute('SELECT count(*) FROM swarms')
            data = cur.fetchone()
            
            #sys.stderr.write(str(data[0]) + "\n")
            
            if data[0] == 0:
                raise sql.OperationalError
        
        except sql.OperationalError, e:
            sys.stderr.write("create swarm table\n")
            cur.execute("DROP TABLE IF EXISTS swarms")
            cur.execute("CREATE TABLE swarms(id INTEGER PRIMARY KEY AUTOINCREMENT, \
            lat LONG, \
            lon LONG, \
            date DATETIME, \
            genus VARCHAR(50), \
            species VARCHAR(50), \
            image VARCHAR(50), \
            state TEXT)")
            
def newSwarm(position, datetime, genus, species, image, comment):
    
    ''' DEBUG '''
    position[0] = 0
    position[1] = 0
    
    con = sql.connect(dbname)
    
    with con:
        cur = con.cursor()
        
        try:
            query = 'INSERT INTO swarms VALUES(\
            Null, \
            ' + str(position[0]) + ', \
            ' + str(position[1]) + ', \
            "' + str(datetime) + '", \
            "' + str(genus) + '", \
            "' + str(species) + '", \
            "' + str(image) + '", \
            "' + str(comment) + '")'
            
            sys.stderr.write(query + "\n")
            
            data = cur.execute(query)
        except sql.OperationalError, e:
            sys.stderr.write("Error saving new swarm")
            sys.stderr.write(str(e))
            
    swarmList()
            
def swarmList():
    con = sql.connect(dbname)
    
    with con:
        cur = con.cursor()
        
        data = cur.execute("SELECT * FROM swarms")
        rows = cur.fetchall()
        
        swarms = []
        for row in rows:
            sys.stderr.write(str(row) + "\n")
            swarms.append({"id" : row[0],
                           "position" : [row[1], row[2]],
                           "date" : row[3],
                           "genus" : row[4],
                           "species" : row[5],
                           "image" : row[6],
                           "comment" : row[7]})
            
        return swarms
            
def fullSpeciesList():
    
    con = sql.connect(dbname)
    
    with con:
        antlist = []
            
        cur = con.cursor()
        cur.execute("SELECT * FROM species")
        rows = cur.fetchall()
        
        for row in rows:
            sys.stderr.write(str(row) + "\n")
            antlist.append({'id' : row[0],
                            'genus': row[1], 
                            'species' : row[2], 
                            'country' : row[3], 
                            'state' : row[4]})
        jsonstr = ""
        for ant in antlist:
            jsonstr += json.dumps(ant) + "\n"
            
        
        return {"ants" : antlist}
    
    return None
            