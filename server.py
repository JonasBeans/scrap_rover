from flask import Flask, request
import requests

app = Flask(__name__)

@app.route('/ptz', methods=['POST'])
def ptz():
    print(request.data)
    response = requests.post(
        "http://192.168.0.53/camera-cgi/com/ptz.cgi",
        data=request.data,
        headers={
        "Authorization": "Basic YWRtaW46MTIzNA==",
        "Accept-Encoding": "gzip, deflate, br"
        }
    )
    return response.text

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
