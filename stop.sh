#!/bin/bash
for pidfile in ~/.run/server.pid ~/.run/mediamtx.pid; do
    if [ -f "$pidfile" ]; then
        kill $(cat "$pidfile") && echo "Stopped $(basename $pidfile .pid)"
        rm "$pidfile"
    else
        echo "No PID file: $pidfile"
    fi
done
