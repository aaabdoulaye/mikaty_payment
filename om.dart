import 'dart:convert';
import 'package:http/http.dart' as http;

Future<String?> authenticate() async {
  /*  
    Orange money authentication
    return access_token with a validity of 5 mn
  */
  try {
    final credentials = {
      'client_id': const String.fromEnvironment('OM_CLIENT_ID'),
      'client_secret': const String.fromEnvironment('OM_CLIENT_SECRET'),
      'grant_type': 'client_credentials'
    };
    
    final response = await http.post(
      Uri.parse('${const String.fromEnvironment('OM_BASE_URL')}/oauth/token'),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: credentials,
    );

    print('authentication data ${jsonEncode(response.body)}');
    final data = jsonDecode(response.body);
    return data['access_token'];
  } catch (error) {
    print('authentication error $error');
  }
}

Future<void> makeCashIn(String senderNumber, String customerNumber, double amount, String encryptedPin, String transactionId) async {
   /*  
    Orange money make a cash in 
    params:
        senderNumber <string> :  MISDN of the sender 
        customerNumber <string> : string MISDN of the customer
        amount <double> : amount to send 
        encryptedPin <string> : rsa encoded pin of the sender 
        transactionId <string> : transactionId of the intern process
    returns :
        response <dict> : status response of process
  */
  final token = await authenticate();
  print('Token $token');
  try {
    final data = {
      "partner": {
        "idType": "MSISDN",
        "id": senderNumber,
        "encryptedPinCode": encryptedPin
      },
      "customer": {
        "idType": "MSISDN",
        "id": customerNumber
      },
      "amount": {
        "value": amount,
        "unit": "XOF"
      },
      "reference": transactionId,
      "receiveNotification": false
    };
    print(data);
    
    final response = await http.post(
      Uri.parse('${String.fromEnvironment('OM_BASE_URL')}/api/eWallet/v1/cashins'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json'
      },
      body: jsonEncode(data),
    );

    if (response.statusCode == 200) {
      print(jsonDecode(response.body));
      return jsonDecode(response.body)
    } else {
      print('Error: ${response.statusCode}');
    }
  } catch (error) {
    print('cashin error $error');
  }
}

