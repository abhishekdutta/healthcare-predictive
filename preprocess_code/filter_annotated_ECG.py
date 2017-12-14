import csv
import json
import re

fieldnames = ['timestamp','ECG','Heart Rate','Respiration Rate','Airway','Pleth','SpO2','Non-invasive Blood Pressure','qos','alarms']

csv_file = csv.DictReader(open("../../clean_data/5_25-5_26_good.csv"))
writer = csv.DictWriter(open('../../clean_data/5-25_5-26_ECG.csv','w'), fieldnames=fieldnames)

#other_pattern = re.compile(r"'(Alarm)")

dates = set()
with open('../../original_data/5-25_5_26_annotated_ekg.txt', 'r') as annotation_file:
    for line in annotation_file:
        date = str(line).strip('\n').strip('\t')
        dates.add(date)
#print(dates)
#print(len(dates))
#print('2017-05-25T14:00:40.400000' in dates)
#exit()

for row in csv_file:

    if row["timestamp"] in dates:
        print(row["timestamp"] in dates)
        row["alarms"] = "ECG"
    else:
        row["alarms"] = ""
    writer.writerow(row)
