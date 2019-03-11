#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Feb 27 18:39:26 2019

@author: zhenhao
"""

import requests
import json

url='http://0.0.0.0:3001/register?name=zhen hao'
#url='http://0.0.0.0:3001/query?question=question?session_id=session id string'
#url='http://0.0.0.0:3001/follow-up??session_id=session id string?intent_id=intent id string'
#body={
#     'question':'query'
#      }

df=requests.get(url)
print(df.text)

#with open('bert_embeddings/embeddings.json') as f:
#    a=json.loads(f)
    
