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
    try{
        const credentials = {'client_id': process.env.OM_CLIENT_ID, 'client_secret': process.env.OM_CLIENT_SECRET, 'grant_type': 'client_credentials'}
        const request = await axios.post(process.env.OM_BASE_URL+"/oauth/token", credentials, {headers: { 'Content-Type': 'application/x-www-form-urlencoded'}})
        console.log(`authentication data ${JSON.stringify(request.data)}`)
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

async function make_cash_in(sender_number, customer_number, amount, encrypted_pin, transaction_id) {
    const token = await authenticate()
    console.log(`Token ${token}`)
    try{
        const data = {
            "partner": {
                "idType": "MSISDN",
                "id": sender_number,
                "encryptedPinCode": encrypted_pin
            },
            "customer": {
                "idType": "MSISDN",
                "id":customer_number
            },
            "amount": {
                "value": amount,
                "unit": "XOF"
            },
            "reference": transaction_id,
            "receiveNotification": false
        }
        console.log(data)
        axios.post(`${process.env.OM_BASE_URL}/api/eWallet/v1/cashins`, data, {'headers': {'Authorization': `Bearer ${token}`}}).then((result) => {
            console.log(result.data)
        }).catch((error) => {
            console.log(error)
        })
        //console.log(`cashin result ${JSON.stringify(result.data)}`)
        //return result.data
    }catch(error){
        console.log(`cashin error ${error}`)
    }
}


const encrypted_pin = "H4y1VHXlHOIcbCzqt3a5qLyhNraloKbrso50hoWbGFSgJxB5YCgBQ3BAeboAEZdPYy9D0+/6H0u6fJBYDV4NQHUsdLQ71vxpwTTDcOnpWEML0bsypHweTVvtqC4tC9lEiW5UHUxZ5U0aUaPTTpn3HksONDNQrEhmIBgWE1a8NGObGvQqoR3+cYUfCc2RSk9VVsRLcLXLkfiqfzKCWmUscuoMjfGZ5pg4SxUNFQ7jYv5Nwu+znecvr1GPyM1MF/7C0gr1VlZRCW668okZ7WoJukMfcrU+2T/jCAIigHCcuHF+Kn6C27hGJoepE0nHtAt73sX1UTKD2zxQr/qO+PNtIA=="
make_cash_in("771899744", "776928060", 400, encrypted_pin, "TEST0006");