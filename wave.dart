import 'dart:convert';
import 'package:http/http.dart' as http;
import 'dart:math';

Future<String?> checkoutSession(int amount, {String? aggregatedMerchantId}) async {
 /* 
    send checkout session 
    params: 
        amount <int>: amount to send 
        aggregatedMerchantId <string> : Optional merchand id
*/
  var params = {
    "amount": amount,
    "currency": "XOF",
    "error_url": const String.fromEnvironment('WAVE_ERROR_URL'),
    "success_url": const String.fromEnvironment('WAVE_SUCCESS_URL')
  };

  if (aggregatedMerchantId != null) {
    params["aggregated_merchant_id"] = aggregatedMerchantId;
  }

  try {
    final response = await http.post(
      Uri.parse('https://api.wave.com/v1/checkout/sessions'),
      headers: {
        'Authorization': 'Bearer $apiKey',
        'Content-Type': 'application/json',
      },
      body: jsonEncode(params),
    );

    if (response.statusCode == 200) {
      var data = jsonDecode(response.body);
      print(data['wave_launch_url']);
      return data['wave_launch_url'];
    } else {
      print('Error: ${response.statusCode}');
    }
  } catch (error) {
    print(error);
  }
  return null;
}

Future<dynamic> payout(int amount, String phoneNumber, String reference, {String? clientName, String? aggregatedMerchantId}) async {
  /*
      send payout from business to customer 
      params: 
          amount <int>: amount to send 
          phone_number <string> : International number that will receive the money
          reference <string> : Internal  reference of the transaction
          client_name <string>: (Optional) name of the client
          aggregatedMerchantId <string> : (Optional) merchand id
  */
  String idemKey = _generateUUID();
  Map<String, dynamic> params = {
    "receive_amount": amount,
    "currency": "XOF",
    "mobile": phoneNumber,
    "client_reference": reference
  };
  
  if (clientName != null) {
    params["name"] = clientName;
  }
  
  if (aggregatedMerchantId != null) {
    params["aggregated_merchant_id"] = aggregatedMerchantId;
  }
  
  try {
    final response = await http.post(
      Uri.parse('https://api.wave.com/v1/payout'),
      headers: {
        'Authorization': 'Bearer $apiKey',
        'Content-Type': 'application/json',
        'idempotency-key': idemKey
      },
      body: jsonEncode(params),
    );
    
    print(response.body);
    return jsonDecode(response.body);
  } catch (error) {
    print(error);
  }
}

String _generateUUID() {
  var rng = Random();
  return List.generate(36, (index) {
    if (index == 8 || index == 13 || index == 18 || index == 23) {
      return '-';
    }
    return rng.nextInt(16).toRadixString(16);
  }).join();
}



