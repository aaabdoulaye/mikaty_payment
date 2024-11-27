import 'dart:convert';
import 'package:http/http.dart' as http;

Future<String?> checkoutSession(int amount, {String? aggregatedMerchantId}) async {
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

