@echo off
cd ..
set FLASK_APP=app.py
start flask run --host=0.0.0.0 --port=8080