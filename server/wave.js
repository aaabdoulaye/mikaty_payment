const axios = require('axios');
const dotenv = require('dotenv')
//import dotenv from 'dotenv'
dotenv.config();

const api_key = process.env.WAVE_SECRET;

async function payout(amount, phone_number, reference, client_name=null, aggregated_merchant_id=null){
    /* 
        send payout from business to customer 
        params: 
            amount <int>: amount to send 
            phone_number <string> : International number that will receive the money
            reference <string> : Internal  reference of the transaction
            client_name <string>: (Optional) name of the client
            aggregatedMerchantId <string> : (Optional) merchand id
    */
    let idem_key = crypto.randomUUID();
    let params = {"receive_amount": amount, currency: "XOF", "mobile": phone_number, "client_reference": reference}
    if(client_name !== null){
        params["name"] = client_name
    }
    if (aggregated_merchant_id !== null){
        params["aggregated_merchant_id"] = aggregated_merchant_id
    }
    try{
        const response = await axios.post('https://api.wave.com/v1/payout', params, {
            headers: {
                'Authorization': `Bearer ${api_key}`,
                'Content-Type': 'application/json',
                'idempotency-key' : idem_key
            },
        })
        console.log(response.data)
        return response.data
        }catch(error){
            console.error(error);
        };
}

payout(1000, "776928060", "WA0001")