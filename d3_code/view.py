import json
import io
import pandas
import os
import sys
from collections import defaultdict
def insertdata(ll, obj):
	i = len(ll) - 1
	while i >= 0 and obj["timestamp"] < ll[i]["timestamp"]:
		i -= 1
	ll.insert(i + 1, obj)

def getterhelper(curr, sch):

	for key in curr:

		if key == 'timestamp':
			continue

		value = curr[key]

		#for undiscovered data
		if key not in sch:
			if isinstance(value, list):
				sch[key] = {"mean": {"min": sys.maxsize, "max": -sys.maxsize - 1}, 
							"std": {"min": sys.maxsize, "max": -sys.maxsize - 1}}
			elif isinstance(value, dict):
				sch[key] = {}
			else:
				sch[key] = defaultdict(int)

		if isinstance(value, list):
			stats = dict(pandas.Series(value).describe())
			
			curr[key] = {"val": value, "stats": stats}
			
			sch[key]["mean"]["min"] = min(sch[key]["mean"]["min"], stats["mean"])
			sch[key]["std"]["min"] = min(sch[key]["std"]["min"], stats["std"])
			sch[key]["mean"]["max"] = max(sch[key]["mean"]["max"], stats["mean"])
			sch[key]["std"]["max"] = max(sch[key]["std"]["max"], stats["std"])
			
		elif isinstance(value, dict):
			
			getterhelper(curr = value, sch = sch[key])
			
		else:
			if isinstance(sch[key], defaultdict):
				sch[key][value] += 1
				
			else:
				
				if value is not None and value != "Not a number":
					sch[key]["min"] = min(sch[key]["min"], value)
					sch[key]["max"] = max(sch[key]["max"], value)

			# print "PROCESSED A VALUE"

def getter():

	with io.open('../../original_data/' + 'x00-03.2017-05-25', 'r', encoding='utf-8') as data_file:
		minmax = {"ECG": {"mean": {"min": sys.maxsize, "max": -sys.maxsize - 1}, 
						"std": {"min": sys.maxsize, "max": -sys.maxsize - 1}
						},
				"Respiration Rate": {

				"min": sys.maxsize, "max": -sys.maxsize - 1
										
										},
				"timestamp": {"min": None, "max": None},
				"SpO2": {

				"min": sys.maxsize, "max": -sys.maxsize - 1
							
							},
				"Pleth": {"mean": {"min": sys.maxsize, "max": -sys.maxsize - 1}, 
							"std": {"min": sys.maxsize, "max": -sys.maxsize - 1}
							
							},
				"Airway": {"Respiration Rate": {
					"min": sys.maxsize, "max": -sys.maxsize - 1
												
												}, 
							"etCO2": {
					
					"min": sys.maxsize, "max": -sys.maxsize - 1
												
												}},
				"alarms": {
							
							}, 
				"qos": defaultdict(int),
				"Heart Rate": {
					
					"min": sys.maxsize, "max": -sys.maxsize - 1
												
												},
				"Non-invasive Blood Pressure": {"mean": {
					
					"min": sys.maxsize, "max": -sys.maxsize - 1
												
												}, 
												"systolic": {
					
					"min": sys.maxsize, "max": -sys.maxsize - 1
												
												}, 
												"diastolic": {
					
					"min": sys.maxsize, "max": -sys.maxsize - 1
												
												}}}

		data = []


		init = json.loads(next(data_file))
		minmax["timestamp"]["min"] = init["timestamp"]
		getterhelper(curr = init, sch = minmax)
		insertdata(ll=data, obj=init)

		x = 0
		for line in data_file:
			x += 1
			if x < 5000:
				continue

			if x > 10000:
				break

			curr = json.loads(line)
			
			getterhelper(curr = curr, sch = minmax)
			insertdata(ll = data, obj = curr)

		minmax["timestamp"]["max"] = curr["timestamp"]

		return json.dumps({"minmax": minmax, "amount": x, "data": data})


if __name__ == '__main__':
	getter()


