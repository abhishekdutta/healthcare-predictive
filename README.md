# healthcare-predictive

### Stage 1 (Preprocessing):

#### A) Extracting Good Quality Data with qOS = 1:
Input data: 5-25-5-26.csv or data.txt (JSON format) <br/>
i) preprocess-5-25-5-26.py -----> 5-25-5-26_good.csv

#### B) Filter data using manual annotations to mark signals:
Input data: 5-25-5-26_good.csv <br/>
i) filter_annotated_ECG.py -----> 5-25-5-26_ECG.csv

#### C) Sorting and deduplication of data:
sort_and_remove_duplicates.py

Input data: 5-25-5-26_ECG.csv <br/>
i) Sorted the data based on timestamps -----> ECG_sorted.csv <br/>
ii) De-duplicated data based on timestamps and <br/>
merged values from different rows with same timestamp -----> ECG_sorted_unique.csv

---------------------------------------------------------

### Stage 2 (Merging):
merge_retain_orginal.py.py

Input data: ECG_sorted_unique.csv <br/>
i) Merged previous row to retain the original alarm before reset -----> ECG_merged.csv

---------------------------------------------------------

### Stage 3 (Window for Signals):
window_preprocess.py.py

Input data: ECG_merged.csv <br/>
i) Setting a threshold limit for the amount of data generated from signals to raise an alarm -----> ECG_window.csv

---------------------------------------------------------

### Stage 4 (Preprocessing for Training):
time_series_preprocess.py

Input data: ECG_window.csv <br/>
i) Transformed features from vertical data to horizontal data for training process <br/>
ii) Converted data to time series data + <br/>
padding (max number of signals required to raise an alarm) -----> ECG_time_series.csv

---------------------------------------------------------

### Stage 5 (Training the Model- Machine Learning):
train_model.ipynb

Input data: ECG_time_series.csv <br/>
i) Trained the model for a single-label classification using One Class SVM (Accuracy: 99.866%) <br/>
ii) Stored the data to visualize accuracy and performance of the model -----> ECG_visualization_data.csv
