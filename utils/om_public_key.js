const dotenv = require('dotenv')
dotenv.config();
const axios = require('axios');
const om_auth = require('./om_authentication')

async function getOMPublicKey() {
    const token = await om_auth.authenticate()
    let result = ""
    await axios.get(`${process.env.OM_BASE_URL}/api/account/v1/publicKeys`, {'headers': {'Authorization': `Bearer ${token}`}}).then((response)=>{
        result = response.data.key 
    }).catch((error) => {
        console.log(error)
    });
    return result
}

getOMPublicKey().then((key) => {
    console.log(`public key : ${key}`)
})
