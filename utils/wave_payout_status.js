const dotenv = require('dotenv')
dotenv.config();
const axios = require('axios');

const token = process.env.WAVE_SECRET

async function getWavePayoutStatus(transaction_id){
    let result = ""
    await axios.get(`${process.env.WAVE_BASE_URL}/payout/${transaction_id}`, {'headers': {'Authorization': `Bearer ${token}`}}).then((response)=>{
        result = response.data
    }).catch((error) => {
        console.log(error)
    });
    return result
}

getWavePayoutStatus("cos-1t4qfcx8g1246").then((result)=> {
    console.log(`Transaction status : ${JSON.stringify(result)}`)
})

