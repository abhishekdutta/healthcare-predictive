import json
import io
import pandas
import os
import sys
from collections import defaultdict
# from scipy import stats
# import matplotlib.pyplot as plt

# pandas.set_option('display.precision', 2)
# # data = []
# sch = dict()

# def schema_organizer(obj, schema):
# 	for key in obj:
# 			# key = json.dumps(k)
# 			if key not in schema:
# 				schema[key] = {"type": None, "numnulls": 0, "numvalues": 0, "values": None}

# 			value = obj[key]
			
# 			if value is None:
# 				schema[key]["numnulls"] += 1

# 			else:
# 				schema[key]["numvalues"] += 1
# 				schema[key]["type"] = type(value).__name__

# 				if isinstance(value, list):

# 					if schema[key]["values"] is None:
# 						schema[key]["values"] = []

# 					schema[key]["values"].append(pandas.Series(value).describe())

# 				elif isinstance(value, dict):

# 					if schema[key]["values"] is None:
# 						schema[key]["values"] = dict()

# 					schema_organizer(obj=value, schema=schema[key]["values"])

# 				else:

# 					if schema[key]["values"] is None:
# 						schema[key]["values"] = []

# 					schema[key]["values"].append(value)

# def schema_printer(ob, tabs):
# 	intro = ""
# 	for i in range(tabs):
# 		intro += "\t"

# 	for key in ob:
# 		string = intro + json.dumps(key) + ':'
# 		if isinstance(ob[key], dict):
# 			print string
# 			schema_printer(ob = ob[key], tabs = tabs + 1)
# 		else:
# 			print (intro + json.dumps(key) + ": " + json.dumps(ob[key]))

# def get_min_max_dates():
# 	with codecs.open('../data/Brown datathon 3.4-5.2017 files/x00-01.1982-06-25 (de-id)', encoding='utf-8') as data_file:
# 		minim = json.loads(next(data_file))["timestamp"]

# 		for line in data_file:
# 			pass

# 		maxim = json.loads(line)["timestamp"]

# 		return json.dumps({"minDate": minim, "maxDate": maxim})
def insertdata(ll, obj):
	i = len(ll) - 1
	while i >= 0 and obj["timestamp"] < ll[i]["timestamp"]:
		i -= 1
	ll.insert(i + 1, obj)

def getterhelper(curr, sch):
	# print "JUST ENTERED"

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
			# insertdata(ll = sch[key]["values"], obj = {"timestamp": timestamp, 
			# 		"value": 
			curr[key] = {"val": value, "stats": stats}
					# )
			# sch[key]["values2"][timestamp] = {"val": value, "stats": stats} if value is not None else None
			# if value is not None:
			sch[key]["mean"]["min"] = min(sch[key]["mean"]["min"], stats["mean"])
			sch[key]["std"]["min"] = min(sch[key]["std"]["min"], stats["std"])
			sch[key]["mean"]["max"] = max(sch[key]["mean"]["max"], stats["mean"])
			sch[key]["std"]["max"] = max(sch[key]["std"]["max"], stats["std"])
			# print "PROCESSED A LIST"
		elif isinstance(value, dict):
			# if "times" in sch[key]:
			# 	if key == "alarms":
			# 		sch[key]["times"].append({"timestamp": timestamp, "alarms": value, "qos": curr["qos"]})
			# 	else:
			# 		sch[key]["times"].append(timestamp)
			getterhelper(curr = value, sch = sch[key])
			# print "PROCESSED A DICT"
		else:
			if isinstance(sch[key], defaultdict):
				sch[key][value] += 1
				# .append(timestamp)
			else:
				# if key != "Airway" and key != "alarms" and key != "Non-invasive Blood Pressure":
				# 	# print ("HEREEEEEEEEEEEEEE", key, value)
				# 	insertdata(ll = sch[key]["values"], obj = {"timestamp": timestamp, "value": value})
				# 	# sch[key]["values2"][timestamp] = value
				if value is not None and value != "Not a number":
					sch[key]["min"] = min(sch[key]["min"], value)
					sch[key]["max"] = max(sch[key]["max"], value)

			# print "PROCESSED A VALUE"

def getter():

	# for filename in os.listdir('../data/Brown datathon 3.4-5.2017 files'):
	# datalength = 0
	# with io.open('../data/Brown datathon 3.4-5.2017 files/' + 'x00-01.1982-06-25 (de-id)', 'r', encoding='utf-8') as data_file:
	# 	for line in data_file:
	# 		datalength += 1

	with io.open('../' + 'good_quality_data_new.txt', 'r', encoding='utf-8') as data_file:
		minmax = {"ECG": {"mean": {"min": sys.maxsize, "max": -sys.maxsize - 1}, 
						"std": {"min": sys.maxsize, "max": -sys.maxsize - 1}
						# ,"values": [],
						# "values2": {}
						},
				"Respiration Rate": {
				# "minmax": {
				"min": sys.maxsize, "max": -sys.maxsize - 1
										# },"values": [],
										# "values2": {}
										},
				"timestamp": {"min": None, "max": None},
				"SpO2": {
				# "minmax": {
				"min": sys.maxsize, "max": -sys.maxsize - 1
							# },"values": [],
							# "values2": {}
							},
				"Pleth": {"mean": {"min": sys.maxsize, "max": -sys.maxsize - 1}, 
							"std": {"min": sys.maxsize, "max": -sys.maxsize - 1}
							# ,"values": [],
							# "values2": {}
							},
				"Airway": {"Respiration Rate": {
					# "minmax": {
					"min": sys.maxsize, "max": -sys.maxsize - 1
												# },"values": [],
												# "values2": {}
												}, 
							"etCO2": {
					# "minmax": {
					"min": sys.maxsize, "max": -sys.maxsize - 1
												# },"values": [],
												# "values2": {}
												}},
				"alarms": {
							# "Alarm_T_2": {"source":defaultdict(int), "state":defaultdict(int), "code":defaultdict(int), 
							# 			"type": defaultdict(int), "string":defaultdict(int)
							# 			# , "times": []
							# 			}, 
							# "Alarm_T_3": {"source":defaultdict(int), "state":defaultdict(int), "code":defaultdict(int), 
							# 			"type": defaultdict(int), "string":defaultdict(int)
							# 			# , "times": []
							# 			}, 
							# "Alarm_T_0": {"source":defaultdict(int), "state":defaultdict(int), "code":defaultdict(int), 
							# 			"type": defaultdict(int), "string":defaultdict(int)
							# 			# , "times": []
							# 			}, 
							# "Alarm_T_1": {"source":defaultdict(int), "state":defaultdict(int), "code":defaultdict(int), 
							# 			"type": defaultdict(int), "string":defaultdict(int)
							# 			# , "times": []
							# 			}, 
							# "Alarm_P_0": {"source":defaultdict(int), "state":defaultdict(int), "code":defaultdict(int), 
							# 			"type": defaultdict(int), "string":defaultdict(int)
							# 			# , "times": []
							# 			}
							# ,"times": []
							}, 
				"qos": defaultdict(int),
				"Heart Rate": {
					# "minmax": {
					"min": sys.maxsize, "max": -sys.maxsize - 1
												# },"values": [],
												# "values2": {}
												},
				"Non-invasive Blood Pressure": {"mean": {
					# "minmax": {
					"min": sys.maxsize, "max": -sys.maxsize - 1
												# },"values": [],
												# "values2": {}
												}, 
												"systolic": {
					# "minmax": {
					"min": sys.maxsize, "max": -sys.maxsize - 1
												# },"values": [],
												# "values2": {}
												}, 
												"diastolic": {
					# "minmax": {
					"min": sys.maxsize, "max": -sys.maxsize - 1
												# },"values": [],
												# "values2": {}
												}}}

		data = []

		# init = json.loads(next(data_file))
		# while init["Non-invasive Blood Pressure"]["mean"] is None or init["Non-invasive Blood Pressure"]["mean"] == "Not a number":
		# 	init = json.loads(next(data_file))
			
		# for i in range(0, 137778):
		# 	next(data_file)


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
			# if curr["Non-invasive Blood Pressure"] is None:
			# 	continue
			# print "Inside", line["timestamp"]
			# value = curr["Heart Rate"]
			# if value is not None and value != "Not a number":
			# 	print value  
			# minmax["Heart Rate"]["values"].append({"timestamp": curr["timestamp"], "value": value})
			# if value is not None and value != "Not a number":
			# 		minmax["Heart Rate"]["minmax"]["min"] = min(minmax["Heart Rate"]["minmax"]["min"], value)
			# 		minmax["Heart Rate"]["minmax"]["max"] = max(minmax["Heart Rate"]["minmax"]["max"], value)
			getterhelper(curr = curr, sch = minmax)
			insertdata(ll = data, obj = curr)

		minmax["timestamp"]["max"] = curr["timestamp"] 

		# with io.open('../data/processed/' + 'x00-01.1982-06-25 (de-id)' + '.json', 'w', encoding='utf-8') as writefile:
		# 	json.dump({"minmax": minmax, "amount": x, "data": data}, writefile)

		return json.dumps({"minmax": minmax, "amount": x, "data": data})
		# writefile.close()

		# schema_printer(ob = minmax, tabs = 0)
		# with io.open('../data/processed/' + filename + '.json', 'w', encoding='utf-8') as writefile:
		# 	writefile.write(unicode(json.dumps({"minmax": minmax, "amount": x})))

		# print res
		# return  json.dumps({"minmax": minmax, "amount": x, "data": data})

if __name__ == '__main__':
	getter()


