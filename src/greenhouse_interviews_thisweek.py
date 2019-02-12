import json
import os
import boto3
import datetime
from datetime import timedelta

from botocore.vendored import requests

# ####################################################
def lambda_handler(event, context):
  today = datetime.datetime.now().date()
  start = today - timedelta(days=today.weekday())
  end = start + timedelta(days=7)
  
  headers = {'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': 'Basic ' + os.environ['GREENHOUSE_AUTH_KEY']}
  api_url = f'https://harvest.greenhouse.io/v1/scheduled_interviews?starts_after={start}&ends_before={end}'
  
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
  file_name = "greenhouse_interviews_thisweek.txt"  
  s3_path = file_name

  s3 = boto3.resource("s3")
  s3.Bucket(bucket_name).put_object(Key=s3_path, Body=encoded_string)