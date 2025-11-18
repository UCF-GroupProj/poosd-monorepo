import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:large_project_dart/utils/global_data.dart';
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

class Reset{
  static Future<void> reset(String email) async{
    final url = Uri.parse('$_baseUrl/pwdreset');

    try{
      final response = await http.post(
        url,
        headers:{
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'email': email,
        }),
      );

      if(response.statusCode == 200){
        return;
      } else if(response.statusCode == 400){
        throw Exception(response.body);
      } else if(response.statusCode == 500){
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


class API{
  static void initAPI(){
    CardsData.getAllCards();
    CardsData.getUserCardSummary();
    UserData.getUserProfile();
  }
}

class CardsData {
  
  // Fetch all cards from the API
  static Future<void> getAllCards() async {
    try{
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
          GlobalData.totalCards = data.length;  // Takes total number of cards from DB
        }
      } else {
        print("Error: ${response.statusCode}");
      }
    } catch (e){
      print("Get All Cards Error: $e");
    }
  }

  // Fetch card collection statistics
  static Future<void> getUserCardSummary() async {
    try{
    final response = await http.get(
      Uri.parse('$_baseUrl/summary/'), 
      headers:{
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${GlobalData.token}',
        },
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      GlobalData.ownedCommon = data["commonOwned"];
      GlobalData.ownedRare = data["rareOwned"];
      GlobalData.ownedEpic = data["epicOwned"];
      GlobalData.ownedLegendary = data["legendaryOwned"];
      GlobalData.totalCardsOwned = data["totalUniqueCards"];
    } else {
    print("Error: ${response.statusCode}");
  }
    } catch (e){
      print("Get User Card Summary Error: $e");
    }
}

static Future<void> updateFavorite(CardData card, bool makeFavorite) async
{
  String id = getCardIndexByID(card.cardID).toString();
  makeFavorite ? GlobalData.favoritesListAsID.add(card.cardID) : GlobalData.favoritesListAsID.remove(card.cardID);
  makeFavorite ? GlobalData.favoritesListAsInt.add(int.parse(id)) : GlobalData.favoritesListAsInt.remove(int.parse(id));

    try{
    final response = await http.patch(
      Uri.parse('$_baseUrl/profile/'),
      headers:{
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${GlobalData.token}',
      },
      body: jsonEncode({
        'favorites': GlobalData.favoritesListAsID,
      }),
    );

    if (response.statusCode == 200) {
      print('Favorite status updated!');
    } else {
      print("Error: ${response.statusCode}");
    }
    } catch (e){
      print("Update Favorite Error: $e");
    }
  }


static int? getCardIndexByID(String cardID) {
    for (int i = 0; i < GlobalData.cardsList.length; i++) {
      if (GlobalData.cardsList[i].cardID == cardID) {
        return i;
      }
    }
    return null;
  }
}

class UserData {

  static Future<void> getUserProfile() async {
    try{
    final response = await http.get(
      Uri.parse('$_baseUrl/profile/'),
      headers:{
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${GlobalData.token}',
        },
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);

      // Set owned cards
      for (int i = 0; i < data["collection"].length; i++) {
        for (int j = 0; j < GlobalData.cardsList.length; j++) {
          if (data["collection"][i] == GlobalData.cardsList[j].cardID) {
            GlobalData.isOwned[j] = true;
          }
        }
      }

      // Set favorited cards
      for (int i = 0; i < data["favorites"].length; i++) {
        int counter = 0;
        if (i > 2) break; // Only first 3 favorites
        for (int j = 0; j < GlobalData.cardsList.length; j++) {
          if (data["favorites"][i] == GlobalData.cardsList[j].cardID) {
            GlobalData.favoritesListAsInt.add(j);  // Store cardsList index of favorite cards
            GlobalData.favoritesListAsID.add(GlobalData.cardsList[j].cardID);  // Store cardID of favorite cards
            counter++;
          }
        }
      }
      print(data);   // Swagger API response
    } else {
    print("Error: ${response.statusCode}");
  }
    } catch (e){
      print("Get User Profile Error: $e");
    }
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