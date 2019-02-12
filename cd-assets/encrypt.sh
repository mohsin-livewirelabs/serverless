#!/bin/bash

FILE=${SECRET_FILEPATH:?"You need to pass a SECRET_FILEPATH parament"}
STAGE=${DEPLOY_STAGE:?"You need to pass a DEPLOY_STAGE parameter"}
REGION=${DEPLOY_REGION:?"You need to pass a DEPLOY_REGION parameter"}
CREDS=${AWS_PROFILE:?"You need to pass a AWS_PROFILE parameter"}

case "$STAGE" in
    dev|int|stg|prod)
        perl -pi -e 'chomp if eof' ${SECRET_FILEPATH} # ensure there is no \n
        aws kms encrypt \
        --key-id=alias/something-exciting-${DEPLOY_STAGE}-key \
        --plaintext file://${SECRET_FILEPATH} \
        --query CiphertextBlob \
        --output text
        ;;
    *)
        echo "$STAGE is not a valid environment, please choose from: [dev, int, stg, prod]"
esac
