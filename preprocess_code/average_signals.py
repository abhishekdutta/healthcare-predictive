import csv
import json
import numpy as np

fieldnames = ['timestamp','ECG','Respiration Rate','SpO2','Pleth','Heart Rate','etCO2','diastolic BP','systolic BP','mean BP','qos','alarms']

csv_file = csv.reader(open("data/ECG_merged.csv"))
writer = csv.writer(open('ECG_avg.csv','w'))
next(csv_file)
writer.writerow(fieldnames)

for row in csv_file:
    new_row = []
    
    for i in range(10):
        if row[i] and row[i] != "Not a number":
            
            if i == 1 or i == 4:
                temp=row[i].replace('[','')
                temp=temp.replace(']','')
                temp=temp.replace(' ','')
                temp=temp.split(',')
                temp=[float(ele) for ele in temp]
                
                avg_signal = np.mean(temp)
                new_row.append(avg_signal)
            elif i == 6:
                Airway = json.loads(row[i])
                new_row.append(Airway['etCO2'])
            elif i == 7:
                Blood_pressure = json.loads(row[i])
                if Blood_pressure['diastolic'] != "Not a number":
                    new_row.append(Blood_pressure['diastolic'])
                else:
                    new_row.append(0)
                
                if Blood_pressure['systolic'] != "Not a number":
                    new_row.append(Blood_pressure['systolic'])
                else:
                    new_row.append(0)
                
                if Blood_pressure['mean'] != "Not a number":
                    new_row.append(Blood_pressure['mean'])
                else:
                    new_row.append(0)
                        
            elif i == 9:
                new_row.append(1)
            else:
                new_row.append(row[i])
        else:
            new_row.append(0)

    writer.writerow(new_row)
