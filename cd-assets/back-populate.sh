#!/bin/bash

REGION=${DEPLOY_REGION:?"You need to pass a DEPLOY_REGION parameter"}
CREDS=${AWS_PROFILE:?"You need to pass a AWS_PROFILE parameter"}
STAGE=${DEPLOY_STAGE:?"You need to pass a DEPLOY_STAGE parameter"}
FUN=update

SLS_DEBUG=* serverless invoke -f ${FUN} -s ${STAGE} --log --data '{"date":"2018-10-01"}'
SLS_DEBUG=* serverless invoke -f ${FUN} -s ${STAGE} --log --data '{"date":"2018-09-01"}'
SLS_DEBUG=* serverless invoke -f ${FUN} -s ${STAGE} --log --data '{"date":"2018-08-01"}'
SLS_DEBUG=* serverless invoke -f ${FUN} -s ${STAGE} --log --data '{"date":"2018-07-01"}'
SLS_DEBUG=* serverless invoke -f ${FUN} -s ${STAGE} --log --data '{"date":"2018-06-01"}'
SLS_DEBUG=* serverless invoke -f ${FUN} -s ${STAGE} --log --data '{"date":"2018-05-01"}'
SLS_DEBUG=* serverless invoke -f ${FUN} -s ${STAGE} --log --data '{"date":"2018-04-01"}'
SLS_DEBUG=* serverless invoke -f ${FUN} -s ${STAGE} --log --data '{"date":"2018-03-01"}'
SLS_DEBUG=* serverless invoke -f ${FUN} -s ${STAGE} --log --data '{"date":"2018-02-01"}'
SLS_DEBUG=* serverless invoke -f ${FUN} -s ${STAGE} --log --data '{"date":"2018-01-01"}'
