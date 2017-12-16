import csv

count=0
with open('ECG_merged.csv', 'rb') as read_file:
	data = csv.reader(read_file)
	
	for row in data:

		if all('' == s or s.isspace() for s in row):
			count+=1

	print(count)
