#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Thu Feb 28 14:14:53 2019

@author: zhenhao
"""

def update(intent, answer):
    replies=answer.split(';')
    replies=[x.strip() for x in replies]
    
    
    