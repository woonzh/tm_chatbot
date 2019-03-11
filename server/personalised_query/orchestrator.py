#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Feb 27 16:12:46 2019

@author: zhenhao
"""

import util
import datetime
import classifier
import classManager
import rule_based_intent_processor

class sessionClass:
    def __init__(self):
        self.storeDir='session/logs.json'
        try:
            self.logs=util.retrieveFunc(self.storeDir,'json')
        except:
            self.logs={}
        self.curSessionLog=None
    
    def extract_session(self, session_id):
        return self.logs[session_id]
    
    def update_session(self, session_id, new_log):
        self.logs[session_id]=new_log
        util.storeFunc(self.logs, self.storeDir, 'json')
        
    def generateSessionId(self):
        curTime=datetime.datetime.now()
        mainStr='session_%04d%02d%02d%02d%02d%02d'%(curTime.year,curTime.month,curTime.day,curTime.hour,curTime.minute,curTime.second)
        return mainStr
    
    def newSessionLog(self, name, sessionId, exists):
        self.curSessionLog={'name':name, 'intents':{}, 'question':{}, 'exists': exists}
        self.update_session(sessionId, self.curSessionLog)

session=sessionClass()

def register(name):
    sessionId=session.generateSessionId()
    exists=rule_based_intent_processor.init_name(name)
    session.newSessionLog(name, sessionId, exists)
    
    reply={
        'session_id': sessionId,
        'intents':[],
        'answer':''
            }
    return reply

def query(question, sessionId):
    print('question: %s'%(question))
    intentIds, embedding=classifier.singlePredict(question, 3)
    intentValue=classManager.getClassValue(intentIds)
    sessionLog=session.extract_session(sessionId)
    name=sessionLog['name']
    print('-----------', intentIds)
    answers=rule_based_intent_processor.personalized_query(name, intentIds)
    
    curIntentLen=len(sessionLog['intents'])
    curQuestIndex=len(sessionLog['question'])
    intentReply=[]
    for count, i in enumerate(intentIds):
        sessionLog['intents'][curIntentLen]={'id':i,'value':intentValue[count], 'answer':answers[count], 'quest_id': curQuestIndex}
        intentReply.append({'id': curIntentLen, 'value': intentValue[count]})
        curIntentLen+=1
    
    sessionLog['question'][curQuestIndex]={'value': question, 'embedding': embedding}
        
    print(intentReply)
        
    reply={
        'session_id':sessionId,
        'intents': intentReply,
        'answer':''
        }
    
    session.update_session(sessionId, sessionLog)
    
    return reply

def update(sessionId, intentId):
    print("------------session and intent id:", sessionId, intentId)
    sessionLog=session.extract_session(sessionId)
    print('----------------', sessionLog)    
    
    answer=sessionLog['intents'][int(intentId)]['answer']
    
    questionId=sessionLog['intents'][int(intentId)]['quest_id']
    question=sessionLog['question'][questionId]['value']
    embedding=sessionLog['question'][questionId]['embedding']
    classification=sessionLog['intents'][int(intentId)]['id']
    
    classifier.retrainModel(question, embedding, classification)
    
    reply={
        'session_id':sessionId,
        'intents': [],
        'answer':answer
        }
    return reply

#init=register('mr shah')
#sessionid=init['session_id']
#reply=query('what is my outstanding bill amount', sessionid)
#reply2=update(sessionid, reply['intents'][0]['id'])
    