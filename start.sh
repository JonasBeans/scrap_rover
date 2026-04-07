#!/bin/bash
mkdir -p ~/logs
python server.py > ~/logs/scrap_rover_webserver.logs 2>&1 &
echo $! > ~/run/server.pid

mediamtx > ~/logs/mediamtx.logs 2>&1 &
echo $! > ~/run/mediamtx.pid

echo "Scrap Rover services started."
