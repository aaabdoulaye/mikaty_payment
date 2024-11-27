import 'dart:convert';
import 'package:http/http.dart' as http;

Future<String?> authenticate() async {
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
    } else {
      print('Error: ${response.statusCode}');
    }
  } catch (error) {
    print('cashin error $error');
  }
}

