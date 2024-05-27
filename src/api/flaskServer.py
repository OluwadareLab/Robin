#pip install flask-cors
#pip install flask

from flask import Flask, request, jsonify
from flask import Response
from flask_cors import CORS, cross_origin
import matplotlib as plt
import subprocess
import logging

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.before_request
def basic_authentication():
    if request.method.lower() == 'options':
        return Response()
    
@app.after_request
def add_header(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response

@app.route('/')
def hello() :
    return 'This is a test to check if the flask api is working.'


@app.route('/run', methods=['POST', 'OPTIONS'])
@cross_origin()
def run_code():
    data = request.get_json()
    code = data.get('code')
    
    try:
        output =  "No Errors Occured: \n" +  subprocess.check_output(['python3', '-c', code], stderr=subprocess.STDOUT, text=True)
    except subprocess.CalledProcessError as e:
        output = "An Error Occured:\n" + e.output +"\n" + e.output
    
    return jsonify({'output': output})

if __name__ == '__main__':
    app.run(debug=True, port=8087, host="0.0.0.0")
