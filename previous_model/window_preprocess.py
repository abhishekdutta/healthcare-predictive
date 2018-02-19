import csv
from collections import OrderedDict

ordered_fieldnames = OrderedDict([('timestamp',None),('ECG',None),('Respiration Rate',None),('SpO2',None),('Pleth',None),('Heart Rate',None),('Airway',None),('Non-invasive Blood Pressure',None),('qos',None),('alarms',None)])

outfile = open('ECG_window.csv', 'wb')
writer = csv.DictWriter(outfile, fieldnames=ordered_fieldnames)

writer.writeheader()

threshold=225

with open('ECG_merged.csv', 'r') as read_file:
	
	data = csv.DictReader(read_file)
	
	## Skip header
	next(data)

	temp=[]
	for row in data:
		
		temp.append(row)

		if row['alarms']=='ECG':

			final_list=temp
			
			if len(temp)>threshold:
				final_list=temp[len(temp)-threshold:len(temp)]

			for ele in final_list:
				writer.writerow(ele)

			temp=[]