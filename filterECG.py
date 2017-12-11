import csv
import re

cnt_good=0
cnt_un=0
cnt_bad=0

json_data=[]
good_data=[]

#g = csv.writer(open("ECG.csv", "wb+"))
fieldnames = ['ECG','Respiration Rate','timestamp','SpO2','Pleth','alarms','Airway','Heart Rate','qos','Non-invasive Blood Pressure']

csv_file = csv.DictReader(open("data/good.csv"))
writer = csv.DictWriter(open('ECG.csv','w'), fieldnames=fieldnames)
#writer.writerow(dict((fn,fn) for fn in csv_file.fieldnames))

ECG_pattern = re.compile(r"{\w+'(.*)(Alarm\w+':\s{(u'\w+':\su'\w+'),\s)*(u'string': u'ECG)")
other_pattern = re.compile(r"{\w+'(.*)(Alarm)")

sequence = []

for row in csv_file:
    
    r_ecg = ECG_pattern.match(row["alarms"])
    r_other = other_pattern.match(row["alarms"])
    if r_ecg:
        row["alarms"] = "ECG"
        sequence.append(row)

        for timestamp in sequence:
            writer.writerow(timestamp)
        sequence = []
    

    elif r_other:
        sequence = []
    else:
        sequence.append(row)
