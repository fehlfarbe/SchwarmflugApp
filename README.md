SchwarmflugApp
==============

Schwarmflug App für mobile Geräte soll es ermöglichen Ameisenschwärme zu melden und sich alarmieren zu lassen, falls eine gesuchte Art in der Umgebung schwärmt.


Geplante Umsetzung für
----------------------
Android  
iOS  

Verzeichnisstruktur
-------------------
android generierte Android Dateien  
doc Dokumentation (Präsentationen, API usw.)  
html Entwicklungsverzeichnis  
SchwarmflugServer Schwarmflug Server, der Daten bereit hält  

Voraussetzungen / Installation / Build
--------------------------------------

Eclipse mit entsprechenden Plugins (Web Development Tools)  
PhoneGap falls neues Projekt erstellt werden soll http://docs.phonegap.com/en/2.7.0/guide_getting-started_index.md.html#Getting%20Started%20Guides
  
Android:
........
1. Android SDK installieren http://developer.android.com/sdk/index.html
2. PATH Variablen einrichten http://docs.phonegap.com/en/2.7.0/guide_getting-started_android_index.md.html#Getting%20Started%20with%20Android
3. Unter Linux buildandroid.sh ausführen
--> Dateien aus html Verzeichnis werden ins gecleante Android Projekt kopiert, PhoneGap buildscript wird ausgeführt, Build wird auf Gerät geladen und ausgeführt


