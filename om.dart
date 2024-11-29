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


Future<String?> generateOtp(String encryptedPin, String phoneNumber) async {
  /*
      Customer has to generate an OTP for payment 
      Params:
          encryptedPin <string> : RSA encoded pin of the client
          phoneNumber <string>: Local phone_number 
      Returns:
          response object
  */
  final token = await authenticate();
  try {
    final data = {
      "encryptedPinCode": encryptedPin,
      "id": phoneNumber,
      "idType": "MSISDN"
    };
    print(data);
    final response = await http.post(
      Uri.parse('${String.fromEnvironment('OM_BASE_URL')}/api/eWallet/v1/payments/otp'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json'
      },
      body: jsonEncode(data),
    );
    print('otp result ${jsonDecode(response.body)}');
    return jsonDecode(response.body)['otp'];
  } catch (error) {
    print('OTP error $error');
  }
}


Future<dynamic> payout(String userNumber, String merchandCode, double amount, String encryptedPin, String reference) async {
  final token = await authenticate();
  final otpCode = await generateOtp(encryptedPin, userNumber);
  
  try {
    final data = {
      "amount": {"unit": "XOF", "value": amount},
      "customer": {"id": userNumber, "idType": "MSISDN", "otp": otpCode},
      "partner": {"idType": "CODE", "id": merchandCode},
      "reference": reference
    };
    
    print(data);
    
    final response = await http.post(
      Uri.parse('${String.fromEnvironment('OM_BASE_URL')}/api/eWallet/v1/payments/onestep'),
      headers: {'Authorization': 'Bearer $token'},
      body: jsonEncode(data),
    );
    
    print('cash out result ${response.body}');
    return jsonDecode(response.body);
  } catch (error) {
    print('payout error $error');
  }
}



Future<void> checkout(String senderNumber, String customerNumber, double amount, String encryptedPin, String transactionId) async {
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

