const axios = require('axios');
const dotenv = require('dotenv')
dotenv.config();

const api_key = process.env.WAVE_SECRET;

async function receivePayment(amount, aggregated_merchant_id=null){
    /* 
        send checkout session 
        params: 
            amount <int>: amount to send 
            aggregatedMerchantId <string> : Optional merchand id
    */
    let params = {"amount": amount, currency: "XOF", error_url:process.env.WAVE_ERROR_URL, success_url:process.env.WAVE_SUCCESS_URL}
    if (aggregated_merchant_id !== null){
        params["aggregated_merchant_id"] = aggregated_merchant_id
    }
    try{
        const response = await axios.post('https://api.wave.com/v1/checkout/sessions', params, {
            headers: {
                'Authorization': `Bearer ${api_key}`,
                'Content-Type': 'application/json',
            },
        })
        console.log(response.data.wave_launch_url)
        return response.data.wave_launch_url
        }catch(error){
            console.error(error);
        };
}

receivePayment(1000)
//payout(100, "+221776928060", "TEST002", client_name="Abdoul Aziz", )


