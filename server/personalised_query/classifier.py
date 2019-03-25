#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue Feb 26 17:00:06 2019

@author: zhenhao
"""

import extractor

from sklearn import model_selection, preprocessing, linear_model, naive_bayes, metrics, svm
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn import decomposition, ensemble
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.decomposition import PCA

import nltk
from nltk.stem.porter import PorterStemmer
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords

import pandas as pd

import json
import pickle
import time
import openpyxl
from statistics import mean
import matplotlib.pyplot as plt

class bertClassifier:
    def __init__(self):
        self.extract=extractor.extractor2()
        self.embeddings_store='bert_embeddings/embeddings.json'
        self.rawScenarioFile='scenarios/new scenarios.csv'
        try:
            with open(self.embeddings_store, 'r') as f:
                self.store=json.load(f)
        except:
            self.store=None
            
        self.classifier_model_store='bert_embeddings/svm_model.p'
        try:
            with open(self.classifier_model_store, 'rb') as f:
                self.clf = pickle.load(f)
        except:
            self.clf = None
#            self.clf = svm.SVC(kernel='rbf', probability=True)
            
        self.pca_store='bert_embeddings/pca_model.p'
        try:
            with open(self.pca_store, 'rb') as f:
                self.pcaMod = pickle.load(f)
        except:
            self.pcaMod = PCA(n_components=2)
    
    def performPCA(self):
        embeddings=self.embeddings_store['embeddings']
        
        
    
    def getLastLayer(self, lines):
        batch=32
        count=0
        print(len(lines))
#        print(lines[0])
        
        embeds=[]
        while count<len(lines):
            curLines=lines[count:min(count+batch, len(lines))]
            count+=batch
            
            store=self.extract.extractLastLayer(curLines)
            
            print('-----------%s----------------'%(count))
            
            for i in store:
                embed=i[0]['values']
                embeds.append(embed)
        
        return embeds
    
    def storeFunc(self, data, fname, ftype='pickle'):
        if ftype=='pickle':
            with open(fname, 'wb') as f:
                pickle.dump(data, f)
        
        if ftype=='json':
            with open(fname, 'w') as f:
                json.dump(data, f)
    
    def fitData(self,x, y):
#        self.parameters = {'C':[1, 10, 50]}
#        self.svc=svm.SVC(kernel='linear', probability=True)
#        self.clf = GridSearchCV(self.svc, self.parameters, cv=5)
        self.clf=svm.SVC(kernel='linear', probability=True, decision_function_shape='ovr')
        self.clf.fit(x,y)
        self.storeFunc(self.clf, self.classifier_model_store, 'pickle')
    
    def predict(self,text, num_results=1):
        embeddings=self.getLastLayer([text])[0]
        prob=self.clf.predict_proba([embeddings])
        return prob
        result=self.getTopRanks(prob,num_results)
        print(result)
        return result
    
    def getTopRanks(self, probList, num_results=1, max_cum_prob=0.7):
        indexList=list(self.clf.classes_)
        df=pd.DataFrame({'prob':probList, 'index':indexList})
        df=df.sort_values('prob', 0, ascending=False)
        
        totProb=0
        for i in list(range(min(num_results,len(df)))):
            totProb+=df.iloc[i,0]
            if totProb>=max_cum_prob or i+1 == num_results:
                df=df.loc[list(df.index)[0:i+1]].values.tolist()
                return df
            
#        df=df.loc[list(df.index)[0:num_results]].values.tolist()
        
#        return df
    
    def predictBulk(self,textList, num_results=1, max_cum_prob=0.7, embedding=None):
        if embedding is None:
            embeddings=self.getLastLayer(textList)
        else:
            embeddings=embedding
        store=[]
        for embed in embeddings:
            prob=self.clf.predict_proba([embed])[0]
            tem=self.getTopRanks(prob,num_results, max_cum_prob)
            store.append(tem)
        return store, embeddings
    
    def trainClassifier(self, texts, generateEmbeddings=True):
        if generateEmbeddings:
            rawText=[x[0] for x in texts]
            classification=[x[1] for x in texts]
            embeddings=self.getLastLayer(rawText)
            
            self.store={
                'text': rawText,
                'embeddings': embeddings,
                'classification':classification
                    }
            
            self.storeFunc(self.store, self.embeddings_store, 'json')
        
        self.fitData(self.store['embeddings'], self.store['classification'])
        
    def writeScenarioToFile(self):
        texts=self.store['text']
        classification=self.store['classification']
#        print(classification)
        
        
        store={}
        for count, value in enumerate(classification):
            try:
                store[value].loc[len(store[value])]=[texts[count]]
            except:
                store[value]=pd.DataFrame(columns=[value])
                store[value].loc[len(store[value])]=[texts[count]]
                
        scenarios=pd.DataFrame()
        
        for i in store:
            scenarios=pd.concat([scenarios, store[i]], ignore_index=True, axis=1)
        
        scenarios.to_csv(self.rawScenarioFile, index=False)        
        
    def reTrainClassifier(self, embedding, text, classification):
        if text not in self.store['text']:
            self.store['text'].append(text)
            self.store['embeddings'].append(embedding)
            self.store['classification'].append(classification)
            
            self.storeFunc(self.store, self.embeddings_store, 'json')
            self.fitData(self.store['embeddings'], self.store['classification'])
    
    def getSimilarity(self,text1, text2):
        embeds=self.getLastLayer([text1, text2])
        return cosine_similarity([embeds[0]], [embeds[1]])
    
class nlpClassifier:
    def __init__(self):
        self.wordnet_lemmatizer = WordNetLemmatizer()
        self.stopwords=stopwords.words('english')
        
        self.tfidf_store='nlp_embeddings/tfidf.p'
        try:
            with open(self.tfidf_store, 'rb') as f:
                self.tfidf = pickle.load(f)
        except:
            self.tfidf = TfidfVectorizer(tokenizer=self.tokenize, analyzer='word', ngram_range=(1,3))
        
        self.embeddings_store='nlp_embeddings/embeddings.json'
        try:
            with open(self.embeddings_store) as f:
                self.store=json.load(f)
        except:
            self.store=None
            
        self.classifier_model_store='nlp_embeddings/svm_model.p'
        try:
            with open(self.classifier_model_store, 'rb') as f:
                self.clf = pickle.load(f)
        except:
            self.clf = svm.SVC(kernel='linear', probability=True)
        
    def tokenize(self, text):
        tokens = nltk.word_tokenize(text)
        tokens=[w for w in tokens if not w in self.stopwords]
        lemmatise=[]
        for item in tokens:
            lemmatise.append(self.wordnet_lemmatizer.lemmatize(item))
    #        stems.append(stemmer.stem(item))
        return lemmatise
    
    def fitSVM(self, x, y):
        self.clf.fit(x, y)
        self.storeFunc(self.clf, self.classifier_model_store, 'pickle')
        
    def storeFunc(self, data, fname, ftype='pickle'):
        if ftype=='pickle':
            with open(fname, 'wb') as f:
                pickle.dump(data, f)
        
        if ftype=='json':
            with open(fname, 'w') as f:
                json.dump(data, f)
    
    def tfidVectorise(self, text_list):
        vector=self.tfidf.fit_transform(text_list)
        features=self.tfidf.get_feature_names()
        vocab={}
        for count, val in enumerate(features):
            vocab[val]=count
#        print(vocab)
        self.tfidf = TfidfVectorizer(tokenizer=self.tokenize, analyzer='word', ngram_range=(1,3), vocabulary=vocab)
        self.storeFunc(self.tfidf, self.tfidf_store, 'pickle')
#        print(self.tfidf.get_feature_names())
#        print(vector.toarray())
        
        return vector.toarray().tolist()
    
    def trainClassifier(self, texts):
        rawText=[x[0] for x in texts]
        x=self.tfidVectorise(rawText)
        y=[y[1] for y in texts]
#        print(x)
#        print(y)
        self.fitSVM(x,y)
    
    def predict(self, text):
        vector=self.tfidVectorise([text])
        prob=self.clf.predict_proba(vector)
#        print(prediction)
        prediction=self.clf.predict(vector)
        print(prediction)
        return prediction, max(prob[0])
    
    def predictBulk(self, textlist):
        store=[]
        for text in textlist:
            pred, prob=self.predict(text)
            store.append([prob, pred])
        
        return store
        
#texts=[['how do i troubleshoot the router setup','a'],
#       ['what steps do i take for router troubleshooting','a'], 
#       ['what are your opening hours','b'],
#       ['what time do you open daily','b']]
#
#testText='tell me how to troubleshoot router'

fileName='scenarios/TM Virtual Agent - DEMO DATA - Compiled.csv'
trainName='scenarios/x_train.csv'
testName='scenarios/x_test.csv'

def train(texts, generateEmbeddings=True):
    bertclass.trainClassifier(texts, generateEmbeddings)
#    nlpClass.trainClassifier(texts)

def predict(text, num_result=1):
    result, prob=bertclass.predict(text, num_result)    
#    result2, prob2=nlpClass.predict(testText)
    
    print('%s classified as %s with probability %s with bert'%(text, result[0], str(prob)))
#    print('%s classified as %s with probability %s with tfidf'%(text, result2[0], str(prob2))) 
    
    return result
    
#    if prob > prob2:
#        print('bert result chosen')
#        return result, prob
#    else:
#        print('tfidf result chosen')
#        return result2, prob
    
def predictBulk(textlist, num_result=1,max_cum_prob=0.7, embedding=None):
    texts=[x[0] for x in textlist]
    if embedding is None:
        bertPred, embeddings=bertclass.predictBulk(texts, num_result, max_cum_prob)
    else:
        bertPred, embeddings=bertclass.predictBulk(texts, num_result, max_cum_prob, embedding)
#    tdifPred=nlpClass.predictBulk(texts)
    return bertPred, embeddings
#    return bertPred, tdifPred
    
def findAns(ansList, corAns):
    totProb=0
    for count, i in enumerate(ansList):
        try:
            ans=str(int(i[1]))
        except:
            ans=str(i[1])
        totProb+=i[0]
        if (ans==str(corAns)):
            return ans, count+1, totProb, len(ansList)
        
    try:
        ans=str(int(ansList[0][1]))
    except:
        ans=str(ansList[0][1])
    
    return ans, 0, totProb, len(ansList)
    
def runTest(textlist, num_result=1, probabilities=[0.7]):
    store={}
    for count, i in enumerate(probabilities):
        if count ==0:
            bertPred, embeddings=predictBulk(textlist, num_result, i)
        else:
            bertPred, embeddings=predictBulk(textlist, num_result, i, embeddings)
        
        
        results=pd.DataFrame(columns=['text', 'correct', 'predicted bert', 'bert result', 'ranking', 'cummulative prob', 'ans length'])
        for count2, val in enumerate(textlist):
            text=val[0]
            correctAns=val[1]
            bertAnsList=bertPred[count2]
            bertAns, ranking, cumProb, ansLen=findAns(bertAnsList, correctAns)
            bertRes=(str(correctAns)==str(bertAns))
            results.loc[count2]=[text, correctAns, bertAns, bertRes, ranking, cumProb, ansLen]
        
        
#        print('single ans accuracy: ', sum(results['ranking']==1)/len(results), ' cummularive probability: ', mean(results[results['ranking']==1]['cummulative prob']))
#        print('double ans accuracy: ', sum(results['ranking']==2)/len(results), ' cummularive probability: ', mean(results[results['ranking']==2]['cummulative prob']))
#        print('triple ans accuracy: ', sum(results['ranking']==3)/len(results), ' cummularive probability: ', mean(results[results['ranking']==3]['cummulative prob']))
        
        store[i]=results
    
    return store

def prepareData(fname=fileName):
    df=pd.read_csv(fname)
    data=pd.DataFrame(columns=['text', 'cat'])
    count=0
    for i in list(df):
        tem=df[str(i)]
        for itm in tem:
            if str(itm)!='nan':
                data.loc[count]=[itm, i]
                count+=1
            
    X_train, X_test = train_test_split(data, test_size=0.2)
    X_train.to_csv('scenarios/x_train.csv', index=False)
    X_test.to_csv('scenarios/x_test.csv', index=False)
    
def readData(train=trainName, test=testName):
    trainDf=pd.read_csv(train)
    testDf=pd.read_csv(test)
    traintext=trainDf.values.tolist()
    testtext=testDf.values.tolist()
    
    return traintext, testtext

def singlePredict(text, num_result=1, min_cum_prob=0.6):
    res, embeddings= predictBulk([[text]], 3, min_cum_prob)
    result=[int(x[1]) for x in res[0]]
    return result, embeddings[0]

def retrainModel(text, embedding, classification):
    bertclass.reTrainClassifier(embedding, text, classification)
    
def min_cum_analysis(results):
    #-----cum based ans analysis
    falseResults=results[results['bert result']==False]
    trueResults=results[results['bert result']==True]
    lengthSets=list(set(list(results['ans length'])))
    falseBreakdown=[sum(falseResults['ans length']==x) for x in lengthSets]
    trueBreakdown=[sum(trueResults['ans length']==x) for x in lengthSets]
    countBreakdown=[sum(results['ans length']==x)for x in lengthSets]
    countPercen=[x/len(results) for x in countBreakdown]
    
    oAccuracy=sum(results['bert result'])/len(results)
    
    
    overallAccuracy=[oAccuracy]*len(lengthSets)
    accuracyBreakdown=[x/y for x, y in zip(trueBreakdown, countBreakdown)]
    #
    cumBreakdown=pd.DataFrame(columns=lengthSets)
    cumBreakdown.loc['true']=trueBreakdown
    cumBreakdown.loc['false']=falseBreakdown
    cumBreakdown.loc['count']=countBreakdown
    cumBreakdown.loc['countPercen']=countPercen
    cumBreakdown.loc['accuracy']=accuracyBreakdown
    cumBreakdown.loc['overall accuracy']=overallAccuracy
    
    options=list(set(results['correct']))
    optCount=[sum(results['correct']==x) for x in options]
    optCorrect=[sum(results[results['correct']==x]['bert result']) for x in options]
    optAccuracy=[x/y for x, y in zip(optCorrect, optCount)]
    
    optBreakdown=pd.DataFrame(columns=options)
    optBreakdown.loc['count']=optCount
    optBreakdown.loc['correct']=optCorrect
    optBreakdown.loc['accuracy']=optAccuracy
    
    print('----accuracy: ', oAccuracy)
    
    return cumBreakdown, optBreakdown
    
    
#nlpClass=nlpClassifier()
bertclass=bertClassifier()

reply=bertclass.predict('i am hungry. where can i find food.')
    
#---------data prep-----------
#prepareData()
#traintext, testtext=readData()

#---------training--------
#train(traintext, True)

#---------testing----------

#results=runTest(testtext, 3, [0.5, 0.6, 0.7, 0.8, 0.9])
#
#resultAnalysis={}
#for index in results:
#    print('-------', index)
#    tem_cum, tem_opt=min_cum_analysis(results[index])
#    print(tem_cum)
#    print(tem_opt)
#    resultAnalysis[index]=[tem_cum, tem_opt]

#---ans spread analysis
#first=results[results['ranking']==1]
#second=results[results['ranking']==2]
#third=results[results['ranking']==3]

#firstGraph=list(first['cummulative prob'])
#secondGraph=list(second['cummulative prob'])
#thirdGraph=list(third['cummulative prob'])
#
#firstGraph.sort()
#secondGraph.sort()
#thirdGraph.sort()
#
#plt.plot(firstGraph,'ro')
#plt.plot(secondGraph, 'ro')
#plt.plot(thirdGraph, 'ro')
#plt.show()
    
#--------test single predict--------
#start=time.time()
#res, embeddings= singlePredict('I want turbo service upgrade NOW', 3)
#end = time.time()
#print('time taken: %s secs' %(str(end - start)))
