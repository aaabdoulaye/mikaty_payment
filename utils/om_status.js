const dotenv = require('dotenv')
dotenv.config();
const axios = require('axios');
const om_auth = require('./om_authentication')

async function getOMtransactionStatus(transaction_id){
    const token = await om_auth.authenticate()
    let result = ""
    await axios.get(`${process.env.OM_BASE_URL}/api/eWallet/v1/transactions/${transaction_id}/status`, {'headers': {'Authorization': `Bearer ${token}`}}).then((response)=>{
        result = response.data
    }).catch((error) => {
        console.log(error)
    });
    return result
}

getOMtransactionStatus("CI241130.1251.B00651").then((result) => {
    console.log(`Status of transaction is ${JSON.stringify(result)}`)
})