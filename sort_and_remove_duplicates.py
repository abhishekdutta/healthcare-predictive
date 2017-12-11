import csv
import operator
import json

## Sorting file based on timestamp
with open('ECG.csv', 'rb') as read_file:
	data = csv.reader(read_file)
	next(data)
	sortedlist = sorted(data, key=lambda row: row[2])

g = csv.writer(open("ECG_sorted.csv", "wb+"))
g.writerow(['ECG','Respiration Rate','timestamp','SpO2','Pleth','alarms','Airway','Heart Rate','qos','Non-invasive Blood Pressure'])

for ele in sortedlist:
	g.writerow(ele)


## Removing duplicates and merging values from different rows with same timestamp
g = csv.writer(open("ECG_sorted_unique.csv", "wb+"))
g.writerow(['timestamp','ECG','Respiration Rate','SpO2','Pleth','Heart Rate','Airway','Non-invasive Blood Pressure','qos','alarms'])


with open('ECG_sorted.csv', 'rb') as read_file:
	data = csv.reader(read_file)
	
	## Skip header
	next(data)
	
	## Extract the first row values and then skip it
	val=next(data)
	val_dict = val[6]
	val_dict = val_dict.replace("'",'"')
	val_dict = val_dict.replace('u"','"')
	val[6] = val_dict.replace('None','0')

	val_dict = val[9]
	val_dict = val_dict.replace("'",'"')
	val_dict = val_dict.replace('u"','"')
	val[9] = val_dict.replace('None','0')
	
	val_list=[val[0],val[1],val[3],val[4],val[7],val[6],val[9],val[8]]
	time=val[2]
	alarm=val[5]

	i_val=0
	for row in data:
		if row[2]==time:
			row_list=[row[0],row[1],row[3],row[4],row[7],row[6],row[9],row[8]]
			for k in range(0,5):
				if row_list[k]:
					val_list[k]=row_list[k]
				
			val_dict = row_list[5]
			val_dict = val_dict.replace("'",'"')
			val_dict = val_dict.replace('u"','"')
			row_list[5] = val_dict.replace('None','0')

			val_next=json.loads(row_list[5])

			#val_list[5]=json.loads(val_list[5])

			if val_next['etCO2']!=0:
				val_list[5]=row_list[5]

			val_dict = row_list[6]
			val_dict = val_dict.replace("'",'"')
			val_dict = val_dict.replace('u"','"')
			row_list[6] = val_dict.replace('None','0')

			val_next=json.loads(row_list[6])
			#val_list[6]=json.loads(val_list[6])

			if val_next['diastolic']!=0:
				val_list[6]=row_list[6]

			if row[5]:
				alarm=row[5]

		else:
			final_list=[time]
			final_list.extend(val_list)
			final_list.append(alarm)
			g.writerow(final_list)


			val=row
			
			val_dict = val[6]
			val_dict = val_dict.replace("'",'"')
			val_dict = val_dict.replace('u"','"')
			val[6] = val_dict.replace('None','0')

			val_dict = val[9]
			val_dict = val_dict.replace("'",'"')
			val_dict = val_dict.replace('u"','"')
			val[9] = val_dict.replace('None','0')
			

			val_list=[val[0],val[1],val[3],val[4],val[7],val[6],val[9],val[8]]
			time=val[2]
			alarm=val[5]
	
	final_list=[time]
	final_list.extend(val_list)
	final_list.append(alarm)
	g.writerow(final_list)

'''
with open('ECG_sample.csv') as csvDataFile:
    csvReader = csv.reader(csvDataFile)
    for row in csvReader:
        print(row)
'''