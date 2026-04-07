from flask import Flask, request, send_from_directory, jsonify
import requests
import threading
import queue

app = Flask(__name__)

# Queue with max size — drops backlog if camera is slow
camera_queue = queue.Queue(maxsize=5)

def camera_worker():
    while True:
        job = camera_queue.get()
        try:
            requests.post(
                "http://192.168.0.53/camera-cgi/com/ptz.cgi",
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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
