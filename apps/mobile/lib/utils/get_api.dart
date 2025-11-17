import 'package:http/http.dart' as http;
import 'dart:convert';

import 'package:large_project_dart/utils/global_data.dart';
const String _baseUrl = 'https://api.poosd.zhiyan114.com';


class API{
  static void initAPI(){
    CardsData.getAllCards();
    CardsData.getUserCardSummary();
//    UserData.getUserProfile();
  }
}

class CardsData {
  
  // Fetch all cards from the API
  static Future<void> getAllCards() async {
    final response = await http.get(
      Uri.parse('$_baseUrl/card/'),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      for (int i = 0; i < data.length; i++) {
        var card = data[i];
        GlobalData.cardsList.add(
          CardData(card["name"], card["rarity"], card["description"], card["imageUrl"], card["id"].toString()),
        );
        GlobalData.cardImages.add(card["imageUrl"]);
      }
    } else {
    print("Error: ${response.statusCode}");
  }
}
  // Fetch card collection statistics
  static Future<void> getUserCardSummary() async {
    final response = await http.get(
      Uri.parse('$_baseUrl/summary/'), 
      headers:{
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${GlobalData.token}',
        },
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      print(data);   // Swagger API response
    } else {
    print("Error: ${response.statusCode}");
  }
}
}

class UserData {
  static Future<void> getUserProfile() async {
    final response = await http.get(
      Uri.parse('$_baseUrl/profile/'),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      print(data);   // Swagger API response
    } else {
    print("Error: ${response.statusCode}");
  }
}

/*
  static Future<String> getJson(String url, String outgoing) async
  {
    String ret = "";
    try
    {
      http.Response response = await http.post(Uri.parse(url),
        body: utf8.encode(outgoing),
        headers:
        {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        encoding: Encoding.getByName("utf-8")
      );
      ret = response.body;
    }
    catch (e)
    {
      print(e.toString());
    }
    return ret;
  }
*/
}

class EmailLogIn{
  static Future<String?> login(String email, String password) async{
    final url = Uri.parse('$_baseUrl/login');

    try{
      final response = await http.post(
        url,
        headers:{
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'email': email,
          'password': password,
        }),
      );

      if(response.statusCode == 200){
        final responseBody = jsonDecode(response.body);
        return responseBody['token'];
      } else if(response.statusCode == 401 || response.statusCode == 400 || response.statusCode == 403){
        throw Exception(response.body);
      } else{
        throw Exception('Failed to log in: ${response.body}');
      }
    } catch (e){
      print('Login Error: $e');
      return null;
    }
  }
}

class Register{
  static Future<String?> register(String email, String password) async{
    final url = Uri.parse('$_baseUrl/register');

    try{
      final response = await http.post(
        url,
        headers:{
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'email': email,
          'password': password,
        }),
      );

      if(response.statusCode == 200){
        return response.body;
      } else if(response.statusCode == 409){
        throw Exception(response.body);
      } else{
        throw Exception('Registration Failed: ${response.body}');
      }
    } catch (e){
      print('Register Error $e');
      return null;
    }
  }
}

class UserProfile{
  static Future<bool> patchUserCurrency({required String token, required int currencyChange}) async{
    final url = Uri.parse('$_baseUrl/profile');

    try{
      final response = await http.patch(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'incCurrency': currencyChange,
        }),
      );

      if(response.statusCode == 200){
        print('User currency updated!');
        return true;
      } else{
        print('Currency Change Failed (Status: ${response.statusCode}): ${response.body}');
        throw Exception('Failed to update currency: ${response.body}');
      }
    } catch (e){
      print('Currency Change Error: $e');
      return false;
    }
  }
}
/*
class CardsData {
  static Future<String> getJson(String url, String outgoing) async
  {
    String ret = "";
    try
    {
      http.Response response = await http.post(Uri.parse(url),
        body: utf8.encode(outgoing),
        headers:
        {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        encoding: Encoding.getByName("utf-8")
      );
      ret = response.body;
    }
    catch (e)
    {
      print(e.toString());
    }
    return ret;
  }
}
*/