#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Fri Mar  1 14:15:33 2019

@author: zhenhao
"""

import pandas as pd

fname='scenarios/scenarios.csv'

scenarioList=pd.read_csv(fname)
scenarioDict={}
for i in list(range(len(scenarioList))):
    scenarioDict[scenarioList.iloc[i,0]]= scenarioList.iloc[i,4]

def getClassDetails(classId):
    return scenarioDict[classId]

def getClassValue(classIdList):
    store=[]
    for i in classIdList:
        store.append(getClassDetails(i))
        
    return store

#a=getClassValue([1,2,3])
