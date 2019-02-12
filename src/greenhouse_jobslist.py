import json
import os
import boto3

from botocore.vendored import requests

api_base = 'https://harvest.greenhouse.io/v1'

def lambda_handler(event, context):
  headers       = {'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': 'Basic ' + os.environ['GREENHOUSE_AUTH_KEY']}
  api_endpoint  = '/jobs?status=open'
  api_url       = api_base + api_endpoint
  response      = requests.get(api_url, headers=headers)
  
  upload_s3(response.text)
  return response.json()
  
# ####################################################
# Funtion Name:     upload_s3()
# Params:           @data: Data/String to write into file.
# Description:      Receives data/string as param, writes it to a file and 
#                   upload it to S3 bucket.
def upload_s3(data):
  encoded_string = str(data).encode('utf-8')

  bucket_name = os.environ['BUCKET_NAME']
  file_name = "greenhouse-jobslist.txt"
  s3_path = file_name

  s3 = boto3.resource("s3")
  s3.Bucket(bucket_name).put_object(Key=s3_path, Body=encoded_string)