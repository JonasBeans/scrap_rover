from flask import Flask, request, send_from_directory, jsonify
from gpiozero import PWMLED
from time import sleep
import requests
import threading
import queue

led = PWMLED(17)

app = Flask(__name__)

led_enabled = True
led_thread = None
stop_pulsate = threading.Event()

def pulsate_loop():
    while not stop_pulsate.is_set():
        for i in range (0, 101, 5):
            if stop_pulsate.is_set():
                return
            led.value = i / 100
            sleep(0.03)
        for i in range(100, -1, -5):
            if stop_pulsate.is_set():
                return
            led.value = i / 100
            sleep(0.03)

def start_pulsating():
    global led_thread
    stop_pulsate.clear()
    led_thread = threading.Thread(target=pulsate_loop, daemon=True)
    led_thread.start()

def stop_pulsating(): 
    stop_pulsate.set()
    if led_thread:
        led_thread.join(timeout=1)
    led.value = 0

start_pulsating()

# Queue with max size — drops backlog if camera is slow
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

@app.route('/switch/light', methods=['POST'])
def switch_light():
    global led_enabled
    led_enabled = not led_enabled
    if led_enabled:
        start_pulsating()
    else:
        stop_pulsating()
    return jsonify({"light": "on" if led_enabled else "off"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)


