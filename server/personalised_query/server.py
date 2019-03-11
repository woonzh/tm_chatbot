#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Feb 27 16:18:29 2019

@author: zhenhao
"""

import flask
from flask import Flask, request, make_response, render_template, redirect
from flask_cors import CORS, cross_origin
from flask_restful import Resource, Api
import json
import orchestrator
import os

port = os.environ.get('TM_PORT', os.environ.get('TM_PORT', 3001))
app = Flask(__name__)
api = Api(app)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route('/register')
@cross_origin()
def register():
    name = request.args.get('name')
    print(name)
    reply=orchestrator.register(name)
    resp = flask.Response(json.dumps(reply))
    resp.headers['Content-Type'] = 'application/json'
    return resp

@app.route('/query')
@cross_origin()
def query():
    question = request.args.get('question')
    session_id = request.args.get('session_id',type = str, default="session id")
    print(question, session_id)
    reply=orchestrator.query(question, session_id)
    resp = flask.Response(json.dumps(reply))
    resp.headers['Content-Type'] = 'application/json'
    return resp

@app.route('/follow-up')
@cross_origin()
def follow_up():
    session_id = request.args.get('session_id',type = str, default="session id")
    intent_id=request.args.get('intent_id',type = str, default="testing")
    print(session_id, intent_id)
    reply=orchestrator.update(session_id, intent_id)
    resp = flask.Response(json.dumps(reply))
    resp.headers['Content-Type'] = 'application/json'
    return resp

if __name__ == '__main__':
#     app.run(debug=True, host='0.0.0.0', port=5000)
     app.run(debug=True, host='0.0.0.0', port=port)
