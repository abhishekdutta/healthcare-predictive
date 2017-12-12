import csv

## Merging values from previous row to retain the original alarm
g = csv.writer(open("ECG_merged.csv", "wb+"))
g.writerow(['timestamp','ECG','Respiration Rate','SpO2','Pleth','Heart Rate','Airway','Non-invasive Blood Pressure','qos','alarms'])

with open('ECG_sorted_unique_sample.csv', 'rb') as read_file:
	data = csv.reader(read_file)
	
	## Skip header
	next(data)

	prev = next(data)

	for row in data:
		cur=row
		if cur[9]=='ECG' and cur[5]=='':
			prev[9]=cur[9]
			g.writerow(prev)
			#next(data)
			prev=next(data)
			print(prev)
		else:
			g.writerow(prev)
			prev=cur

	if cur[9]=='ECG' and cur[5]!='':
		g.writerow(cur)