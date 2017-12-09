import view
from flask import Flask
app = Flask(__name__)

@app.route('/')
def root():
	return app.send_static_file('index1.html')

@app.route('/data')
def givedata():
	# print "HI!!!!!!!"
	res = view.getter()
	# print res
	return res


if __name__ == "__main__":
	app.run()