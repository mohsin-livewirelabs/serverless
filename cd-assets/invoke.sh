#!/bin/bash

# https://serverless.com/framework/docs/providers/aws/cli-reference/invoke/

REGION=${DEPLOY_REGION:?"You need to pass a DEPLOY_REGION parameter"}
CREDS=${AWS_PROFILE:?"You need to pass a AWS_PROFILE parameter"}
STAGE=${DEPLOY_STAGE:?"You need to pass a DEPLOY_STAGE parameter"}
FUN=${FUNCTION:?"You need to pass a FUNCTION parameter"}
DATA=${EVENT_DATA:?"You need to pass a EVENT_DATA parameter"}

case "$STAGE" in
    dev|int|stg|prod)
        echo "Deploying serverless on $STAGE..."
        SLS_DEBUG=* serverless invoke -f ${FUN} -s ${STAGE} --log --data ${DATA}
        ;;
    *)
        echo "$STAGE is not a valid environment, please choose from: [dev, int, stg, prod]"
esac
