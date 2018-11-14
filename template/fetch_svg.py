#Jean Salac
#File to grab svg from html console log
#Run with python fetch_svg.py nameOfFile (of type String)

import os
import sys
from selenium import webdriver
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities 

def main():
	filename = sys.argv[1]
	#Get console log for html script
	fileURL = 'file://'+str(os.path.abspath(filename+".html"))
	d = DesiredCapabilities.CHROME
	d['loggingPrefs'] = { 'browser':'ALL' }
	driver = webdriver.Chrome('/usr/lib/chromium-browser/chromedriver')
	# load html file
	driver.get(fileURL)
	#open svg file for console logs
	test_pic = open(filename+'.svg','w+')

	#get console logs
	for entry in driver.get_log('browser'):
	    message = entry.get('message')
	    message_parts = message.split('"')
	    #Fetch svg
	    svg = message_parts[1]
	    for i in range(2,len(message_parts)-1):
	    	svg = svg+'"'+message_parts[i]
	    svg = svg + message_parts[len(message_parts)-1]
	    svg = svg.replace("\\u003C","<")
	    svg = svg.replace('\\"','"')
	    svg = svg.replace("\\n"," ")
	    print>>test_pic,svg
		


if __name__ == '__main__':
	main()