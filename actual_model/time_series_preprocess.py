import csv
import numpy as np
import json

g = csv.writer(open("ECG_time_series.csv", "wb+"))

with open('ECG_window.csv', 'rb') as read_file:
	data = csv.DictReader(read_file)
	
	## Skip header
	next(data)

	cur=0
	max_cur=0
	for row in data:
		cur+=1
		if row['alarms']=='ECG':
			max_cur=max(max_cur,cur)
			cur=0

	print(max_cur)

#max_cur=10

## max_cur is before an alarm is 
num_features=4
num_alarms=1

signal_list=[0]*(max_cur+num_features+num_alarms-1)

temp_list=['timestamp']

temp_str='ECG'
for i in range(0,max_cur):
	final_str=temp_str+str(i)
	temp_list.append(final_str)

temp_list.extend(['diastolic','systolic','mean'])

temp_list.append('alarms')

g.writerow(temp_list)

with open('ECG_window.csv', 'rb') as read_file:
	
	data = csv.DictReader(read_file)
	
	## Skip header
	next(data)

	iter_val=0
	for row in data:
		if row['ECG']:
			temp=row['ECG'].replace('[','')
			temp=temp.replace(']','')
			temp=temp.replace(' ','')
			temp=temp.split(',')
			temp=[float(ele) for ele in temp]
			avg_val=np.mean(temp)

			signal_list[iter_val]=avg_val

		val_next=json.loads(row['Non-invasive Blood Pressure'])
		signal_list[max_cur]=val_next['diastolic']
		signal_list[max_cur+1]=val_next['systolic']
		signal_list[max_cur+2]=val_next['mean']

		iter_val+=1

		if row['alarms']=='ECG':
			signal_list[max_cur+3]=1

			total_list=[row['timestamp']]
			total_list.extend(signal_list)

			g.writerow(total_list)

			signal_list=[0]*(max_cur+num_features+num_alarms-1)
			iter_val=0

		else:
			total_list=[row['timestamp']]
			total_list.extend(signal_list)

			g.writerow(total_list)