import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:async';

const String _baseUrl = 'https://api.poosd.zhiyan114.com';

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

class RollResult{
  final List<String> collections;
  final int dupCredits;
  final bool pulledMinEpic;

  RollResult({
    required this.collections,
    required this.dupCredits,
    required this.pulledMinEpic,
  });

  factory RollResult.fromJson(Map<String, dynamic> json){
    return RollResult(
      collections: List<String>.from(json['collections'] ?? []),
      dupCredits: json['dupCredits'] ?? 0,
      pulledMinEpic: json['pulledMinEpic'] ?? false
    );
  }
}

class CardModel {
  final String id;
  final String name;
  final String rarity;
  final String description;
  final String imageUrl;
  
  CardModel({
    required this.id,
    required this.name,
    required this.rarity,
    required this.description,
    required this.imageUrl,
  });
  
  factory CardModel.fromJson(Map<String, dynamic> json) {
    return CardModel(
      id: json['id'] as String,
      name: json['name'] as String,
      rarity: json['rarity'] as String,
      description: json['description'] as String,
      imageUrl: json['imageUrl'] as String,
    );
  }
}

class CardAPI{
  static Future<RollResult?> rollCards({required String token, required int count}) async{
    final url = Uri.parse('$_baseUrl/roll/$count');

    try{
      final response = await http.get(
        url,
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final responseBody = jsonDecode(response.body);
        print('Card roll successful for $count pull(s).');
        return RollResult.fromJson(responseBody);
      } else if (response.statusCode == 403) {
        throw Exception("Insufficient gems to roll. Status: 403");
      } else {
        print('Roll Failed (Status: ${response.statusCode}): ${response.body}');
        throw Exception('Failed to roll cards: ${response.body}');
      }
    } catch(e){
      print('Roll Error: $e');
      return null;
    }
  }

  static Future<CardModel?> getCardDetails({required String token, required String cardID}) async {
    final url = Uri.parse('$_baseUrl/card/$cardID');

    try{
      final response = await http.get(
        url,
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> responseBody = jsonDecode(response.body);
        return CardModel.fromJson(responseBody);
      } else {
        print('Get card details failed (Status: ${response.statusCode}): ${response.body}');
        throw Exception('Failed to roll cards: ${response.body}');
      }
    } catch(e){
      print('Get Card Details Error: $e');
      return null;
    }
  }
}