const dotenv = require('dotenv')
dotenv.config();
const axios = require('axios');

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

module.exports.authenticate = authenticate;

/* authenticate().then((result) => {
    console.log(`Token return ${result}`)
}) */
