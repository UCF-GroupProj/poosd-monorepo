import 'package:http/http.dart' as http;
import 'dart:convert';

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
    final response = await http.get(
      Uri.parse('https://api.poosd.zhiyan114.com/card/'),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      print(data);   // Swagger API response
    } else {
    print("Error: ${response.statusCode}");
  }
}
  // Fetch card collection statistics
  static Future<void> getUserCardSummary() async {
    final response = await http.get(
      Uri.parse('https://api.poosd.zhiyan114.com/card/summary/'),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      print(data);   // Swagger API response
    } else {
    print("Error: ${response.statusCode}");
  }
}
  
  static void addCardToCollection(int cardID) {
    
  }

  static void favoriteCard(bool isFavorite) {
    
  }
}

class UserData {
  static Future<void> getUserProfile() async {
    final response = await http.get(
      Uri.parse('https://api.poosd.zhiyan114.com/profile/'),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      print(data);   // Swagger API response
    } else {
    print("Error: ${response.statusCode}");
  }

  void setCurrency(int amount) {
    
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