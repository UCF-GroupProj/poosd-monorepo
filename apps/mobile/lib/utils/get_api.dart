import 'package:http/http.dart' as http;
import 'dart:convert';

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