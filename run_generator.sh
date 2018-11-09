#!/bin/bash
cd repdfgeneratorcode

rm *.pdf

#Run Question Generator
chmod +x unit2QuestionGenerator.py
python unit2QuestionGenerator.py $1

#Read csv of students
IFS=","
while read f1 f2 f3 f4
do
        #Delete unnecessary files
        rm "$f3".json
        rm "$f3"_jsonString.txt
        
        #plug in picture generator here
        
        #mkdir "$f3"_images
        #mv *.png "$f3"_images
        
        #Generate pdfs
        pdflatex "$f3"_test.tex

done < $1

#Get rid of extra files
rm *.aux
rm *.log
rm *.tex
rm *custom.txt
rm *Custom.csv
rm *custom.csv
rm *.json
rm *jsonString.txt

#Merge all the pdfs
pdfunite *.pdf all_tests.pdf

#Get rid of remaining pdfs
find *.pdf ! -name all_tests.pdf -delete

cd ..

#Done
echo "Done."