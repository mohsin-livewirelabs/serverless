# Something Exciting
We need data to inspire people - and we need it now!

[![Serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com/)

## Introduction
A data centric and serverless project that collects the number of active users and stores it in an S3 Bucket and also 
pushes the data to a geckoboard dashboard. 

## Glossary
Active user: a user that has placed a completed bet in either the sports book or the casino.

## How to deploy
1. Install serverless globally:
    ```bash
    npm install -g serverless
    ```
    
2. Add an AWS Named Profile to `~/.aws/credentials`.

3. Fill in missing values in `config.yml`.

4. Run the deploy:
    ```bash
    AWS_PROFILE=<profile> DEPLOY_REGION=<region> DEPLOY_STAGE=<stage> sh ./cd-assets/deploy.sh
    ```

5. You will need to encrypt the secrets. This can be done by placing the secret in a file, then running the following command:
    ```bash
    AWS_PROFILE=<profile> DEPLOY_REGION=<region> DEPLOY_STAGE=<stage> SECRET_FILEPATH=~/secrets sh ./cd-assets/encrypt.sh
    ```
    Then copy the encrypted secret to `secrets.yml`.

6. Redeploy.
    ```bash
    AWS_PROFILE=<profile> DEPLOY_REGION=<region> DEPLOY_STAGE=<stage> sh ./cd-assets/deploy.sh
    ```
7. __You're all set to go!__

### Optional steps

- Back populate the datasets, this fills for the current year. But modify as necessary.
    ```bash
    AWS_PROFILE=<profile> DEPLOY_REGION=<region> DEPLOY_STAGE=<stage> sh ./cd-assets/back-populate.sh
    ```

- Initial population of current month.
    ```bash
    AWS_PROFILE=bgl-preprod SLS_DEBUG=* serverless invoke -f current --log -s <stage>
    ```
 