const dotenv = require('dotenv')
dotenv.config();
const axios = require('axios');
const om_auth = require('../utils/om_authentication')


async function receivePayment(amount, merchand_code, merchand_name){
    const token = await om_auth.authenticate()
    let result = null
    const data = {"amount":{"unit": "XOF", "value": amount}, "code": merchand_code, "name": merchand_name}
    await axios.post(`${process.env.OM_BASE_URL}/api/eWallet/v4/qrcode`, data, {'headers': {'Authorization': `Bearer ${token}`}}).then((response) => {
        result = response.data
    }).catch((error) => {
        console.log(`receivedPayment error ${JSON.stringify(error)}`)
    })
    console.log(result)
    return result
}

receivePayment(1000, process.env.OM_MERCHAND_CODE, "INSIGHT")
//checkout("776928060", "771899902", 269, encrypted_pin, "TEST0038");
