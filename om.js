const dotenv = require('dotenv')
dotenv.config();
const axios = require('axios');
const pino =  require('pino');
const crypto = require('crypto');

const logger = pino()

const api = axios.create({
    baseURL: process.env.OM_BASE_URL,
    headers: {
      'Content-Type': 'application/json'
    }
});

async function authenticate () {
    /*  
        Orange money authentication
        return access_token with a validity of 5 mn
    */
    try{
        const credentials = {'client_id': process.env.OM_CLIENT_ID, 'client_secret': process.env.OM_CLIENT_SECRET, 'grant_type': 'client_credentials'}
        const request = await axios.post(process.env.OM_BASE_URL+"/oauth/token", credentials, {headers: { 'Content-Type': 'application/x-www-form-urlencoded'}})
        //console.log(`authentication data ${JSON.stringify(request.data)}`)
        return request.data.access_token
    }catch(error){
        console.log(`authentication error ${error}`)
    }
}

/* api.interceptors.response.use(response => response, async error => {
    logger.info(`interceptor error ${error}`)
    if (error.response.status === 401) {
      await authenticate();
      return api(error.config);
    }
    return Promise.reject(error);
}); */

const encrypt_pin = async (pin) => {
    try{
        const request = await api.get('/api/account/v1/publicKeys')
        logger.info(`encryption info ${request.data.key}`)
        const header = '-----BEGIN PUBLIC KEY-----'
        const footer = '-----END PUBLIC KEY-----'
        const key = request.data.key.match(/.{1,64}/g).join('\n');
        const pem_key = `${header}\n${key}\n${footer}`;
        logger.info(`Key encrypted ${ crypto.publicEncrypt(pem_key, Buffer.from(pin)).toString('base64')}`)
        return crypto.publicEncrypt(pem_key, Buffer.from(pin)).toString('base64')
    }catch(error){
        logger.error(`encryption error ${error}`)
    }
}

async function generate_otp(encrypted_pin, phone_number){
    /* 
        Customer has to generate an OTP for payment 
        Params:
            encryptedPin <string> : RSA encoded pin of the client
            phone_number <string>: Local phone_number 
        Returns:
            response object
    */
    const token = await authenticate()
    try{
        const data = {"encryptedPinCode": encrypted_pin, "id": phone_number, "idType": "MSISDN"}
        console.log(data)
        const response = await axios.post(`${process.env.OM_BASE_URL}/api/eWallet/v1/payments/otp`, data, {'headers': {'Authorization': `Bearer ${token}`}})
        console.log(`otp result ${JSON.stringify(response.data)}`)
        return response.data.otp
    }catch(error){
        console.log(`OTP error ${error}`)
    }
}

async function payout(user_number, merchand_code, amount, encrypted_pin, reference){
    const token = await authenticate()
    const otp_code = await generate_otp(encrypted_pin, user_number)
    try{
        const data = {"amount":{"unit": "XOF", "value": amount}, 
                    "customer": {"id": user_number, "idType": "MSISDN", "otp": otp_code }, 
                    "partner":{ "idType": "CODE", "id": merchand_code},
                    "reference":reference}
        console.log(data)
        const response = await axios.post(`${process.env.OM_BASE_URL}/api/eWallet/v1/payments/onestep`, data, {'headers': {'Authorization': `Bearer ${token}`}})
        console.log(`cash out result ${JSON.stringify(response.data)}`)
        return response.data
    }catch(error){
        console.log(`payout error ${error}`)
    }

}

async function checkout(user_number, merchand_number, amount, encrypted_pin, transaction_id) {
    /*  
        Orange money make a cash in 
        params:
            senderNumber <string> :  MISDN of the sender 
            customerNumber <string> : string MISDN of the customer
            amount <double> : amount to send 
            encryptedPin <string> : RSA encoded pin of the sender 
            transactionId <string> : transactionId of the intern process
        returns :
            response <dict> : status response of process
  */
    const token = await authenticate()
    try{
        const data = {
            "partner": {
                "idType": "MSISDN",
                "id": merchand_number,
                "encryptedPinCode": encrypted_pin
            },
            "customer": {
                "idType": "MSISDN",
                "id":user_number
            },
            "amount": {
                "value": amount,
                "unit": "XOF"
            },
            "reference": transaction_id,
            "receiveNotification": false
        }
        const response = await axios.post(`${process.env.OM_BASE_URL}/api/eWallet/v1/cashins`, data, {'headers': {'Authorization': `Bearer ${token}`}})
        console.log(`checkout result ${JSON.stringify(response.data)}`)
        return response.data
    }catch(error){
        console.log(`checkout error ${error}`)
    }
}


const encrypted_pin = "H4y1VHXlHOIcbCzqt3a5qLyhNraloKbrso50hoWbGFSgJxB5YCgBQ3BAeboAEZdPYy9D0+/6H0u6fJBYDV4NQHUsdLQ71vxpwTTDcOnpWEML0bsypHweTVvtqC4tC9lEiW5UHUxZ5U0aUaPTTpn3HksONDNQrEhmIBgWE1a8NGObGvQqoR3+cYUfCc2RSk9VVsRLcLXLkfiqfzKCWmUscuoMjfGZ5pg4SxUNFQ7jYv5Nwu+znecvr1GPyM1MF/7C0gr1VlZRCW668okZ7WoJukMfcrU+2T/jCAIigHCcuHF+Kn6C27hGJoepE0nHtAt73sX1UTKD2zxQr/qO+PNtIA=="
//payout("786175709", "365815", 1000.0,  encrypted_pin, "OUT003")
checkout("776928060", "771899902", 269, encrypted_pin, "TEST0038");
