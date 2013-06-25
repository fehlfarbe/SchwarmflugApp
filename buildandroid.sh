#!/bin/bash
#
# buildscript for Linux
# set PATH for android-sdk/platform-tools and android-sdk/tools
#

if [ $# -lt 2 ]
then
	echo $#
	echo "USAGE: ./buildandroid --debug|release --target|device|emulator"
	exit -1
fi

### clean android html files
echo "cleaning files in android/assets/www/"
rm -r android/assets/www/*

### copy html files to android
echo "coping html files to android/assets/www ..."
cp -r html/* android/assets/www/
echo "done."

### compress and optimize files if closure-compressor is avaiable

#if test -f "compiler.jar"
#then
#	echo "compressing JavaScript..."
#	for i in `ls html/js/`
#	do
#		echo -n -e "\t compressing ${i}..."
#		java -jar compiler.jar --js=html/js/${i} --js_output_file=android/assets/www/js/${i}
#		echo "done."
#	done
#	echo "compressing finished"
#fi

### start build
echo "start build"
android/cordova/build $1 && android/cordova/run $2
