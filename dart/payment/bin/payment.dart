import 'package:payment/payment.dart' as payment;
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'dart:math';

// replace this with your own credentials
final WAVE_API_Key = "";

final OM_CLIENT_ID = "";
final OM_CLIENT_SECRET = "";
final OM_BASE_URL = "https://api.sandbox.orange-sonatel.com/";
final OM_MERCHAND_CODE = 00000;


Future<String?> WaveAskForPayment(int amount, {String? aggregatedMerchantId}) async {
 /* 
    send checkout session 
    params: 
        amount <int>: amount to send 
        aggregatedMerchantId <string> : Optional merchand id
*/
  var params = {
    "amount": amount,
    "currency": "XOF",
    "error_url": "https://sms.tinsight.tech",
    "success_url": "https://sms.tinsight.tech"
  };

  if (aggregatedMerchantId != null) {
    params["aggregated_merchant_id"] = aggregatedMerchantId;
  }

  try {
    final response = await http.post(
      Uri.parse('https://api.wave.com/v1/checkout/sessions'),
      headers: {
        'Authorization': 'Bearer $WAVE_API_Key',
        'Content-Type': 'application/json',
      },
      body: jsonEncode(params),
    );

    if (response.statusCode == 200) {
      var data = jsonDecode(response.body);
      print(data['wave_launch_url']);
      return data['wave_launch_url'];
    } else {
      print('Error: ${response.body}');
    }
  } catch (error) {
    print(error);
  }
  return null;
}

Future<String?> OMAuthentication() async {
  /*  
    Orange money authentication
    return access_token with a validity of 5 mn
  */
  try {
    final credentials = {
      'client_id': '$OM_CLIENT_ID',
      'client_secret': '$OM_CLIENT_SECRET',
      'grant_type': 'client_credentials'
    };
    
    final response = await http.post(
      Uri.parse('$OM_BASE_URL/oauth/token'),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: credentials,
    );

    final data = jsonDecode(response.body);
    return data['access_token'];
  } catch (error) {
    print('authentication error $error');
  }
}


Future<dynamic> OMAskForpayment(double amount) async {
  /* Asking for payment the function return an url that will be use by the customer to pay the merchand */

  final token = await OMAuthentication();
  dynamic result;
  final data = {
    "amount": {"unit": "XOF", "value": amount},
    "code": OM_MERCHAND_CODE,
    "name": "Mikaty"
  };

  try {
    final response = await http.post(
      Uri.parse('$OM_BASE_URL/api/eWallet/v4/qrcode'),
      headers: {'Authorization': 'Bearer $token', 'Content-Type': 'application/json'},
      body: jsonEncode(data),
    );

    result = jsonDecode(response.body);
  } catch (error) {
    print('receivedPayment error ${jsonEncode(error)}');
  }
  print(result);
  return result;
}



// test Orange money and wave payment 
void main(List<String> arguments) {
  WaveAskForPayment(1000);
  OMAskForpayment(1000);
}
