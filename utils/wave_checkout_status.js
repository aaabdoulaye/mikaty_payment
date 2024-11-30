const dotenv = require('dotenv')
dotenv.config();
const axios = require('axios');

const token = process.env.WAVE_SECRET

async function getWaveCheckoutStatus(transaction_id){
    let result = ""
    await axios.get(`${process.env.WAVE_BASE_URL}/checkout/sessions?transaction_id=${transaction_id}`, {'headers': {'Authorization': `Bearer ${token}`}}).then((response)=>{
        result = response.data
    }).catch((error) => {
        console.log(error)
    });
    return result
}

getWaveCheckoutStatus("cos-1t4qfcx8g1246").then((result)=> {
    console.log(`Transaction status : ${JSON.stringify(result)}`)
})

