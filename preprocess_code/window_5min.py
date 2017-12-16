import csv
from datetime import datetime
from datetime import timedelta

dates = set()
with open('../5-25_5_26_annotated_ekg.txt', 'r') as annotation_file:
    for line in annotation_file:
        date = str(line).strip('\n').strip('\r').strip('\t')
        dates.add(date)

csv_file = csv.DictReader(open("../ECG_merged.csv"))
next(csv_file)

fieldnames = ['timestamp','ECG','Respiration Rate','SpO2','Pleth','Heart Rate','Airway','Non-invasive Blood Pressure','qos','alarms']
writer = csv.DictWriter(open('../window_alarms.csv','w'), fieldnames=fieldnames)

history_records = list()
count_prior = dict()
for row in csv_file:

    if row["timestamp"] in dates:
        # Counter for prior timestamp
        cnt = 0
        # Annotated timestamp
        print(row["timestamp"])
        a = datetime.strptime(row["timestamp"], "%Y-%m-%dT%H:%M:%S.%f000")
        prior_date = a - timedelta(minutes = 5)
        prior_date_string = prior_date.strftime("%Y-%m-%dT%H:%M:%S.%f")
        # 5 mins prior timestamp
        print(prior_date_string)
        print("")

        for i in range(len(history_records)):
            r = history_records[i]

            try:
                t = datetime.strptime(r["timestamp"], "%Y-%m-%dT%H:%M:%S.%f000")
            except ValueError:
                t = datetime.strptime(r["timestamp"], "%Y-%m-%dT%H:%M:%S")

            if  prior_date <= t and t < a:
                cnt += 1
                print(r["timestamp"])
                writer.writerow(r)

        # if row["timestamp"] not in count_prior:
        count_prior[row["timestamp"]] = cnt
        # Clear history records
        del history_records[:]
        # Write annotated alarm to file
        writer.writerow(row)
        print("------")
    else:
        history_records.append(row)

print("************")
print(count_prior)
print("")
