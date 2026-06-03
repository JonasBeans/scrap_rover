from flask import Flask, request, send_from_directory, jsonify
from gpiozero import PWMLED
from time import sleep
import requests
import threading
import queue

led = PWMLED(17)
app = Flask(__name__)

# Queue with max size 1 — drops backlog if camera is slow
camera_queue = queue.Queue(maxsize=1)

def camera_worker():
    while True:
        job = camera_queue.get()
        try:
            requests.post(
                "http://192.168.1.102/camera-cgi/com/ptz.cgi",
                data=job["data"],
                headers={
                    "Authorization": "Basic YWRtaW46MTIzNA==",
                    "Accept-Encoding": "gzip, deflate, br"
                },
                timeout=3
            )
        except Exception as e:
            print(f"Camera command failed: {e}")
        finally:
            camera_queue.task_done()

# Start worker thread once at startup
worker = threading.Thread(target=camera_worker, daemon=True)
worker.start()

@app.route('/')
def index():
    return send_from_directory('website', 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('website', path)

@app.route('/ptz', methods=['POST'])
def ptz():
    print(request.data)
    try:
        camera_queue.put_nowait({"data": request.data})
        return jsonify({"status": "queued"})
    except queue.Full:
        return jsonify({"status": "busy"}), 429

@app.route('/motor', methods=['POST'])
def set_motor():
    data = request.get_json()
    if data is None or "speed" not in data:
        return jsonify({"error": "Missing 'speed' field"}), 400

    try:
        speed = float(data["speed"])
    except (TypeError, ValueError):
        return jsonify({"error": "'speed' must be a number"}), 400

    if not 0 <= speed <= 1:
        return jsonify({"error": "'speed' must be between 0 and 1"}), 400

    # TODO: Implement motor control logic here
    # For now, just logging the speed value
    print(f"Motor speed set to: {speed}")
    return jsonify({"motor": speed})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
