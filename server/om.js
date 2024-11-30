const dotenv = require('dotenv')
dotenv.config();
const axios = require('axios');
const om_auth = require('../utils/om_authentication')

async function sendPayment(user_number, merchand_number, amount, encrypted_pin, transaction_id) {
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
    const token = await om_auth.authenticate()
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

const encrypted_pin = "tJpwLlgpgNK0P2gi9b5d1CGehGN+kSRYvRyVVDpzosOlJkjHMz+NZcsKPwlYp48Gc2Ee8GPKhKJ/ufrMhWJJCYm7rILEKYmd4FhCSoX/HtS4iuCZzzlIUeAOwpn9TNo0UHQT8zwTPGV7fQzfOzBi8oPWKsX194jz/g6dQ92E/q1HPiDIzsEa3L5NvnbG/xqcGMhMdTXkoRkqNa8tVyd2tKhVlUv2vFGT4UmJI32iZAGZeVH9VxaKaCVQShn8jrll4dH2jLifQAc0PR8v6JTUhgQ1fTlLjlk9Fg6jZ2UYq8kHgfrg2g7iY5NfS4YJyhGgAC3myOxAXzHugZmxA8ClzA=="
sendPayment("776928060", "771899744", "1000", encrypted_pin, "OM0001")