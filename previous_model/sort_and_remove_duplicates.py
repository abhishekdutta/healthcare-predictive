import csv
import operator
import json

## Sorting file based on timestamp
with open('5-25_5-26_ECG.csv', 'rb') as read_file:
	data = csv.reader(read_file)
	header = next(data)
	sortedlist = sorted(data, key=lambda row: row[2])

g = csv.writer(open("ECG_sorted.csv", "wb+"))
g.writerow(header)

for ele in sortedlist:
	g.writerow(ele)


## Removing duplicates and merging values from different rows with same timestamp
g = csv.writer(open("ECG_sorted_unique.csv", "wb+"))
g.writerow(['timestamp','ECG','Respiration Rate','SpO2','Pleth','Heart Rate','Airway','Non-invasive Blood Pressure','qos','alarms'])


with open('ECG_sorted.csv', 'rb') as read_file:
	
	data = csv.DictReader(read_file)

	## Skip header
	next(data)
	
	## Extract the first row values and then skip it
	val=next(data)

	val_dict = val['Airway']
	val_dict = val_dict.replace("'",'"')
	val_dict = val_dict.replace('u"','"')
	val['Airway'] = val_dict.replace('None','0')

	val_dict = val['Non-invasive Blood Pressure']
	val_dict = val_dict.replace("'",'"')
	val_dict = val_dict.replace('u"','"')
	val['Non-invasive Blood Pressure'] = val_dict.replace('None','0')
	
	val_list=[val['ECG'],val['Respiration Rate'],val['SpO2'],val['Pleth'],val['Heart Rate'],val['Airway'],val['Non-invasive Blood Pressure'],val['qos']]
	time=val['timestamp']
	alarm=val['alarms']

	for row in data:
		if row['timestamp']==time:
			
			row_list=[row['ECG'],row['Respiration Rate'],row['SpO2'],row['Pleth'],row['Heart Rate'],row['Airway'],row['Non-invasive Blood Pressure'],row['qos']]
			
			for k in range(0,5):
				if row_list[k]:
					val_list[k]=row_list[k]
				
			val_dict = row_list[5]
			val_dict = val_dict.replace("'",'"')
			val_dict = val_dict.replace('u"','"')
			row_list[5] = val_dict.replace('None','0')

			val_next=json.loads(row_list[5])

			if val_next['etCO2']!=0:
				val_list[5]=row_list[5]

			val_dict = row_list[6]
			val_dict = val_dict.replace("'",'"')
			val_dict = val_dict.replace('u"','"')
			row_list[6] = val_dict.replace('None','0')

			val_next=json.loads(row_list[6])

			if val_next['diastolic']!=0:
				val_list[6]=row_list[6]

			if row['alarms']:
				alarm=row['alarms']

		else:
			final_list=[time]
			final_list.extend(val_list)
			final_list.append(alarm)
			g.writerow(final_list)


			val=row
			
			val_dict = val['Airway']
			val_dict = val_dict.replace("'",'"')
			val_dict = val_dict.replace('u"','"')
			val['Airway'] = val_dict.replace('None','0')

			val_dict = val['Non-invasive Blood Pressure']
			val_dict = val_dict.replace("'",'"')
			val_dict = val_dict.replace('u"','"')
			val['Non-invasive Blood Pressure'] = val_dict.replace('None','0')
			
			val_list=[val['ECG'],val['Respiration Rate'],val['SpO2'],val['Pleth'],val['Heart Rate'],val['Airway'],val['Non-invasive Blood Pressure'],val['qos']]
			time=val['timestamp']
			alarm=val['alarms']

	
	final_list=[time]
	final_list.extend(val_list)
	final_list.append(alarm)
	g.writerow(final_list)