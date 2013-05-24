@echo off
REM buildscript for Windows
REM set PATH for android-sdk/platform-tools and android-sdk/tools


REM clean android html files
echo cleaning files in android/assets/www/
erase /s/f/q android\assets\www\*

REM copy html files to android
echo coping html files to android/assets/www ...
xcopy /s html\* android\assets\www\
echo done.

REM start build
echo start build
start android\cordova\build.bat --debug 
REM && android\cordova\run --emulator

@pause