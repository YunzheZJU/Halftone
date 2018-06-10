@echo off
cd ..
set FLASK_APP=app.py
set FLASK_DEBUG=true
start flask run --host=0.0.0.0 --port=8080