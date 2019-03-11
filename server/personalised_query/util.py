#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Feb 27 19:01:22 2019

@author: zhenhao
"""

import pickle
import json

def retrieveFunc(fname, ftype='pickle'): 
    if ftype=='pickle':
        with open(fname, 'rb') as f:
            data=pickle.load(f)
        return data
    
    if ftype=='json':
        with open(fname) as f:
            data=json.load(f)
        return data

def storeFunc(data, fname, ftype='pickle'):
    if ftype=='pickle':
        with open(fname, 'wb') as f:
            pickle.dump(data, f)
    
    if ftype=='json':
        with open(fname, 'w') as f:
            json.dump(data, f)