'''
Created on 12.06.2013

@author: kolbe
'''
import sqlite3 as sql
import species
import sys
import json
import math

### Settings
dbname = "antbase.db"

''' calculates the distance between two points on earth '''
def getDistance(p1, p2):
    lat1 = p1[0]
    lon1 = p1[1]
    lat2 = p2[0]
    lon2 = p2[1]
    
    R = 6371
    dLat = math.radians(lat2-lat1)
    dLon = math.radians(lon2-lon1)
    lat1 = math.radians(lat1)
    lat2 = math.radians(lat2)
    
    a = math.sin(dLat/2) * math.sin(dLat/2) + \
      math.sin(dLon/2) * math.sin(dLon/2) * math.cos(lat1) * math.cos(lat2); 
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a)); 
    
    return R * c;

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
    #position[0] = 0
    #position[1] = 0
    
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
            
def swarmList(position = None, radius = None, genus = None, species = None, startdate = None, limit = None):
    con = sql.connect(dbname)
    
    with con:
        query = "SELECT * FROM swarms"
        
        where = []
        params = {}
        if genus != None:
            where.append("genus = :genus")
            params['genus'] = genus
            if species != None:
                where.append("species = :species")
                params['species'] = species
        if startdate != None:
            where.append("date > :startdate")
            params['startdate'] = startdate
        if where:
            query = '{} WHERE {}'.format(query, ' AND '.join(where))
        if limit:
            query += " LIMIT " + str(limit)
        
        '''
        if genus != None or startdate != None:
            query += "WHERE "
        if genus != None:
            query += "genus LIKE '" + genus + "' "
        if species != None:
            query += " AND species LIKE '" + species + "' "
        if startdate != None:
            query += " AND date > '" + startdate + "' "
        '''
        
        sys.stderr.write(str(query)+ "\n")
        cur = con.cursor()
        data = cur.execute(query, params)
        rows = cur.fetchall()
        
        swarms = []
        for row in rows:
            distance = 0
            
            if position != None and radius != None:
                distance = getDistance(position, [row[1], row[2]])
                
            swarm = {"id" : row[0],
                   "position" : [row[1], row[2]],
                   "date" : row[3],
                   "genus" : row[4],
                   "species" : row[5],
                   "image" : row[6],
                   "comment" : row[7],
                   "distance" : distance}
            
            if radius != None:
                if distance < radius:
                    swarms.append(swarm)
                else:
                    sys.stderr.write("distance too big! " + str(distance) + "km \n")
            else:
                swarms.append(swarm)                
                    
                    
            #sys.stderr.write(str(swarm) + "\n")
                
            
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
            