import urllib
from zipfile import ZipFile
import os

fdir="./server/personalised_query/test/"
try:
    os.mkdir(fdir)
except:
    t=1

zipstore=fdir+"multi_cased_L-12_H-768_A-12.zip"
fstore=fdir
urllib.request.urlretrieve("https://storage.googleapis.com/bert_models/2018_11_23/multi_cased_L-12_H-768_A-12.zip", zipstore)

with ZipFile(zipstore, 'r') as zipper:
    zipper.extractall(fstore)