'''
Created on 20.05.2013

@author: kolbe
'''

import csv
import re
import json


def genusFromFile(file = 'artenliste.txt'):
    with open(file, 'r') as csvfile:        
        csvreader = csv.reader(csvfile, delimiter='\t', quotechar='|')
        antlist = []
        for row in csvreader:
            ant = row[0].split(' ')
            genus = ant[0]
            antlist.append(genus)
            
        antlist = list(set(antlist))
        antlist.sort()
        return antlist
    
def getSpecies(findgenus, file = 'artenliste.txt'):
    
    with open(file, 'r') as csvfile:
        
        '''
        for line in csvfile.readlines():
            line = re.sub('\t', ' ', line)
            line = re.sub(' +', ' ', line)
            print line
        '''
        #print "====================================="
        
        csvreader = csv.reader(csvfile, delimiter='\t', quotechar='|')
        antlist = []
        for row in csvreader:
            ant = row[0].split(' ')
            genus = ant[0]
            species = ant[1]
            country = row[4]
            state = row[5]
            
            if genus == findgenus:
                antlist.append({'genus': genus, 
                                'species' : species, 
                                'country' : country, 
                                'state' : state})
        jsonstr = ""
        for ant in antlist:
            jsonstr += json.dumps(ant) + "\n"
            
        
        return {"ants" : antlist}
    
def speciesArray(file = 'artenliste.txt'):

    with open(file, 'r') as csvfile:
        
        csvreader = csv.reader(csvfile, delimiter='\t', quotechar='|')
        antlist = []
        for row in csvreader:
            ant = row[0].split(' ')
            genus = ant[0]
            species = ant[1]
            country = row[4]
            state = row[5]
            
            
            antlist.append({'genus': genus, 
                            'species' : species, 
                            'country' : country, 
                            'state' : state})
            
    return antlist 


def speciesFromFile(file = 'artenliste.txt'):

    with open(file, 'r') as csvfile:
        
        '''
        for line in csvfile.readlines():
            line = re.sub('\t', ' ', line)
            line = re.sub(' +', ' ', line)
            print line
        '''
        #print "====================================="
        
        csvreader = csv.reader(csvfile, delimiter='\t', quotechar='|')
        antlist = []
        for row in csvreader:
            ant = row[0].split(' ')
            genus = ant[0]
            species = ant[1]
            country = row[4]
            state = row[5]
            
            
            antlist.append({'genus': genus, 
                            'species' : species, 
                            'country' : country, 
                            'state' : state})
            
            #TODO: remove duplicates
            
            #print genus + " | " + species 
            #print row
            #print ' | '.join(row)
    
        jsonstr = ""
        for ant in antlist:
            jsonstr += json.dumps(ant) + "\n"
            
        
        return {"ants" : antlist}
        ### write csv file
        #with open('specieslist.csv', 'w') as output:
        #    writer = csv.writer(output, delimiter='\t')
        #    for ant in antlist:
        #        writer.writerow(ant)
                
        
if __name__ == "__main__":
    print speciesFromFile('artenliste.txt')