import csv
from collections import OrderedDict

ordered_fieldnames = OrderedDict([('timestamp',None),('ECG',None),('Respiration Rate',None),('SpO2',None),('Pleth',None),('Heart Rate',None),('Airway',None),('Non-invasive Blood Pressure',None),('qos',None),('alarms',None)])

outfile = open('ECG_merged.csv', 'wb')
writer = csv.DictWriter(outfile, fieldnames=ordered_fieldnames)

writer.writeheader()

with open('ECG_sorted_unique.csv', 'r') as read_file:
	
	data = csv.DictReader(read_file)
	
	## Skip header
	next(data)

	prev = next(data)

	for row in data:
		cur=row

		comp_list1=[prev['ECG'],prev['Respiration Rate'],prev['SpO2'],prev['Pleth'],prev['Heart Rate'],prev['Airway'],prev['Non-invasive Blood Pressure'],prev['qos'],prev['alarms']]
		comp_list2=[cur['ECG'],cur['Respiration Rate'],cur['SpO2'],cur['Pleth'],cur['Heart Rate'],cur['Airway'],cur['Non-invasive Blood Pressure'],cur['qos'],cur['alarms']]
	
		if cur['alarms']=='ECG' and comp_list1==comp_list2:

			prev['alarms']=cur['alarms']
			
			writer.writerow(prev)

			prev=next(data)

		else:

			writer.writerow(prev)

			prev=cur

	comp_list1=[prev['ECG'],prev['Respiration Rate'],prev['SpO2'],prev['Pleth'],prev['Heart Rate'],prev['Airway'],prev['Non-invasive Blood Pressure'],prev['qos'],prev['alarms']]
	comp_list2=[cur['ECG'],cur['Respiration Rate'],cur['SpO2'],cur['Pleth'],cur['Heart Rate'],cur['Airway'],cur['Non-invasive Blood Pressure'],cur['qos'],cur['alarms']]
	
	if cur['alarms']=='ECG' and comp_list1==comp_list2:
		writer.writerow(cur)