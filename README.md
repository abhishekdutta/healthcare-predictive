# healthcare-predictive

### Stage 1 (Preprocessing):
sort_and_remove_duplicates.py

Actual data: ECG.csv
Sorted the data based on timestamps ----> ECG_sorted.csv
De-duplicated the data based on timestamps and merged values from different rows with same timestamp -----> ECG_sorted_unique.csv

---------------------------------------------------------

### Stage 2 (Merging):
merge_retain_orginal.py.py

Merged previous row to retain the original alarm before reset -----> ECG_merged.csv

---------------------------------------------------------

### Stage 3 (Preprocessing for Training):
time_series_preprocess.py

Transformed features from vertical data to horizontal data for training process. 
Converted data to time series data + padding (max number of signals required to raise an alarm) ----->   ECG_time_series.csv

---------------------------------------------------------

### Stage 4:
train_model.ipynb

Trained the model for a single-label classification using One Class SVM (Accuracy: 99.866%)
