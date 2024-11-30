# Requirements

To run these function you need to have all access from orange money Senegal and WAVE. 

you have to provide for orange money

- OM_CLIENT_ID 
- OM_CLIENT_SECRET 
- OM_BASE_URL <"https://api.sandbox.orange-sonatel.com/"> (for production replace it with the good one)
- OM_MERCHAND_CODE

for wave money you need
- WAVE_SECRET 
- WAVE_BASE_URL  <"https://api.wave.com/v1">
- WAVE_ID 
- WAVE_SUCCESS_URL 
- WAVE_ERROR_URL 

# client directory 
this directory contains 2 javascript files . 
- wave.js contains the function that will allow to request for a payment using wave . for testing it  just run 

node client/wave.js 

- om.js contains the function that will allow to request for a payment using orange money api . for testing it just run 

node client/om.js 

# dart directory 
dart directory contains functions that will allow to request for a payment using wave and orange money apis. these functions are loacated under the directory dart/payment/bin/payment.dart. 

For testing it edit the file and provide all missing informations in the file about your credentials. After that just run 

dart dart/payment/bin/payment.dart

# Server directory
before runing these file your can edit user informations with the correct one. 

this directory contains 2 javascript files . 
- wave.js contains the function that will allow to send money to your customer using wave api . for testing it  just run 

node server/wave.js 

- om.js contains the function that will allow to send money to your customer using wave using orange money api . for testing it just run 

node server/om.js 

# utils directory

this directory contains some functions that can help you to complete the process of mobile money payment

- utils/om_authentication.js : contains function that give you the orange money access_token that you will need to process other operations

node utils/om_authentication.js

- utils/om_public_key.js : contains function that give you your orange money public key. This key will help you to encrypt your pin code . For that you can do it here https://www.devglan.com/online-tools/rsa-encryption-decryption. Please RSA encryption

node utils/om_public_key.js

- utils/om_status.js : contains function that help you to retreive an orange money transaction status 

node utils/om_status.js

- utils/wave_checkout_status.js : contains function that help you to retreive a wave transaction request status 

node utils/wave_checkout_status.js

- utils/wave_payout_status.js : contains function that help you to retreive a wave transaction refund status 

node utils/wave_payout_status.js


