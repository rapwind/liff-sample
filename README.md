# LIFF Sample
## Dependencies
node: 12.13.0

## Installation
```
npm i -s nuxt
npm i -sD @nuxt/typescript-build @nuxt/typescript-runtime
npm i
```

### Create enviroment file
env/dev.yml
```
VpcBlock: 10.0.0.0/16
LineChannelAccessToken: *****
LineChannelId: *****
LineChannelSecret: *****
ApiUrl: https://*****.cloudfront.net
FrontUrl: https://*****.cloudfront.net
CognitoUserPoolId: ap-northeast-*****
CognitoClientId: *****
CognitoDomain: *****.auth.ap-northeast-1.amazoncognito.com
StripePublicKey: pk_test_*****
StripeSecretKey: sk_test_*****
```

## Run lint
```
npm run lint
```
or with fix
```
npm run fix
```

## Deploy
```
npm run deploy:dev
```

## API and Infrastructure by Serverless
### Run local server
```
npm run local
```

## Build
```
npm run build
```

## Web Front by Vue.js
### Run develop server
```
npm run nuxt
```

## Generate
```
npm run nuxt:gen
```
