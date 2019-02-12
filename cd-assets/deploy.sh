#!/bin/bash

REGION=${DEPLOY_REGION:?"You need to pass a DEPLOY_REGION parameter"}
CREDS=${AWS_PROFILE:?"You need to pass a AWS_PROFILE parameter"}
STAGE=${DEPLOY_STAGE:?"You need to pass a DEPLOY_STAGE parameter"}

case "$STAGE" in
    dev|int|stg|prod)
        echo "Deploying serverless on $STAGE..."
        SLS_DEBUG=* serverless deploy -v -s ${STAGE}
        ;;
    *)
        echo "$STAGE is not a valid environment, please choose from: [dev, int, stg, prod]"
esac