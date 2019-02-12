import json
import os
import boto3
import datetime
from datetime import timedelta

from botocore.vendored import requests

api_base = "https://" + os.environ['BAMBOOZLED_API_KEY'] + ":x@api.bamboohr.com/api/gateway.php/bitgamelabs/v1"

# ####################################################
def lambda_handler(event, context):

    headers       = {'Content-Type': 'application/json', 'Accept': 'application/json'}
    api_endpoint  = '/time_off/whos_out/'
    api_url       = api_base + api_endpoint
    response      = requests.get(api_url, headers=headers)
    
    
    jsonObject        = json.loads(response.text)
    filtered_objects  = []
    
    today = datetime.datetime.now().date()
    start_limit = today + timedelta(days=14)
    for key in jsonObject:
      start_date = datetime.datetime.strptime(key['start'], "%Y-%m-%d").date()
      end_date = datetime.datetime.strptime(key['end'], "%Y-%m-%d").date()

      if(start_limit >= start_date):    ## Start date should be at max 14 days from now
        
        if(start_date <= today and end_date >= today):
          key['out_of_office'] = True
        elif(start_date >= today):
          key['out_of_office'] = False

        if 'out_of_office' in key:
          range = datetime.datetime.strptime(key['start'], "%Y-%m-%d").strftime("%d %b") + "-" + datetime.datetime.strptime(key['end'], "%Y-%m-%d").strftime("%d %b")
          filtered_objects.append({"name": key['name'], "start": key['start'], "end": key['end'], "out_of_office": str(key['out_of_office']), "range": range})                  
    
    upload_s3(filtered_objects)
    r = upload_data_to_geckoboard(filtered_objects)
    
    return filtered_objects


# ####################################################
# Funtion Name:     upload_data_to_geckoboard()
# Params:           @data: List of dict
# Description:      Receives data/string as param and upload on Gechoboard dataset.
#                   upload it to S3 bucket.
def upload_data_to_geckoboard(data):
  headers = {'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': 'Basic ' + os.environ['GB_AUTHORIZATION_KEY']}
  data    = json.dumps({ 'data': data})
  
  return requests.put("https://api.geckoboard.com/datasets/bamboo_oof/data", data, headers=headers)  


# ####################################################
# Funtion Name:     upload_s3()
# Params:           @data: Data/String to write into file.
# Description:      Receives data/string as param, writes it to a file and 
#                   upload it to S3 bucket.
def upload_s3(data):
  print("Uploading to S3")
  encoded_string = str(data).encode('utf-8')

  bucket_name = os.environ['BUCKET_NAME']
  file_name = "employees.txt"
  s3_path = file_name

  s3 = boto3.resource("s3")
  s3.Bucket(bucket_name).put_object(Key=s3_path, Body=encoded_string)