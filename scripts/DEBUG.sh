#!/bin/bash
cd ..
export FLASK_APP=app.py
export FLASK_DEBUG=true
flask run --host=0.0.0.0 --port=8080
