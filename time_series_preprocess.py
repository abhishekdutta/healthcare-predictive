import csv
import numpy as np
import json

g = csv.writer(open("ECG_time_series.csv", "wb+"))
#g.writerow(['timestamp','ECG','Non-invasive Blood Pressure','qos','alarms'])

with open('ECG_merged.csv', 'rb') as read_file:
	data = csv.reader(read_file)
	
	## Skip header
	next(data)

	cur=0
	max_cur=0
	for row in data:
		cur+=1
		if row[9]=='ECG':
			max_cur=max(max_cur,cur)
			cur=0

	print(max_cur)

signal_list=[0]*(max_cur+4)

temp_list=['features']

for i in range(1,max_cur+3):
	temp_list.append('')

temp_list.append('alarms')
g.writerow(temp_list)

with open('ECG_merged.csv', 'rb') as read_file:
	data = csv.reader(read_file)
	
	## Skip header
	next(data)

	iter_val=0
	for row in data:
		if row[1]:
			temp=row[1].replace('[','')
			temp=temp.replace(']','')
			temp=temp.replace(' ','')
			temp=temp.split(',')
			temp=[float(ele) for ele in temp]
			avg_val=np.mean(temp)

			signal_list[iter_val]=avg_val

		val_next=json.loads(row[7])
		signal_list[max_cur]=val_next['diastolic']
		signal_list[max_cur+1]=val_next['systolic']
		signal_list[max_cur+2]=val_next['mean']

		iter_val+=1

		if row[9]=='ECG':
			signal_list[max_cur+3]=1
			g.writerow(signal_list)

			signal_list=[0]*(max_cur+4)
			iter_val=0

		else:
			g.writerow(signal_list)