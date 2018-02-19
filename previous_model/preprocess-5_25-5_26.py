import json
import csv

cnt_good=0
cnt_un=0
cnt_bad=0

json_data=[]
good_data=[]

g = csv.writer(open("../../clean_data/5_25-5_26_good.csv", "w"))
g.writerow(['timestamp','ECG','Heart Rate','Respiration Rate','alarms','Airway','Pleth','SpO2','Non-invasive Blood Pressure','qos'])

with open('../../original_data/5-25-5-26', 'r') as handle:
	for line in handle:
		temp_data=json.loads(line)

		if temp_data['qos']==1:
			cnt_good+=1
			good_data.append(temp_data)

			temp=[]
			for key,val in temp_data.items():
				temp.append(val)
			g.writerow(temp)

		elif temp_data['qos']==0:
			cnt_un+=1

		else:
			cnt_bad+=1
  
		json_data.append(temp_data)

print('Good: '+str(cnt_good))
print('Undetermined: '+str(cnt_un))
print('Bad: '+str(cnt_bad))

total=cnt_good+cnt_un+cnt_bad

print('Total: '+str(total))
print('Good Percentage: '+str(float(cnt_good)/total))
print('Undetermined Percentage: '+str(float(cnt_un)/total))
print('Bad Percentage: '+str(float(cnt_bad)/total))

'''
f = csv.writer(open("all.csv", "wb+"))

for ele in json_data:
	f.writerow([ele])

g = csv.writer(open("good.csv", "wb+"))

for ele in good_data:
	temp=[]
	for val in ele:
		temp.append(val)
	g.writerow(temp)

'''
