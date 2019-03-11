#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Feb 27 15:27:13 2019

@author: zhenhao
"""

import spacy

nlp = spacy.load('en_core_web_sm')

text='Apple is looking at buying U.K. startup for $1 billion'
doc = nlp(text)

for ent in doc.ents:
    print(ent.text, ent.label_)