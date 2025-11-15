import 'package:flutter/material.dart';
import 'package:large_project_dart/routes/routes.dart';
import 'package:large_project_dart/utils/get_api.dart';
import 'package:large_project_dart/utils/global_data.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  bool _isLoading = false;
  String? _errorMessage;

  @override
  void dispose(){
    _emailController.dispose();
    _passwordController.dispose;
    super.dispose();
  }

  bool isEmailValid(String email) {
    final bool emailValid = RegExp(r"^[a-zA-Z0-9.a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9]+\.[a-zA-Z]+").hasMatch(email);
    return emailValid;
  }

  Future<void> _handleLogin() async{
    final email = _emailController.text;
    final password = _passwordController.text;

    if(!isEmailValid(email)){ 
      setState(() {
        _errorMessage = "Please enter a valid email address.";
      });
      return;
    }
    
    if(password.isEmpty){
      setState(() {
        _errorMessage = "Please enter a password.";
      });
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try{
      final token = await EmailLogIn.login(email, password);

      setState(() {
        _isLoading = false;
      });

      if(token != null){
        GlobalData.token = token;

        if(mounted){ // Used to check if the user is still on the page
          Navigator.pushNamedAndRemoveUntil(context, Routes.MAINAPPPAGE, (route) => false);
        }
      } else{
        _errorMessage = "Wrong Credentials";
      }
    } catch (e){
      setState(() {
        _isLoading = false;
        _errorMessage = e.toString().replaceFirst("Exception: ", "");
      });
    }
  }
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.amber[400],
      body: Center(
        child: Container(
          margin: EdgeInsets.symmetric(horizontal: 24),
          padding: EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: .8),
            borderRadius: BorderRadius.circular(24),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: .2),
                blurRadius: 10,
                offset: Offset(0, 5),
              ),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                "Welcome, Traveler!",
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Color.fromARGB(255, 17, 11, 75), 
                ),
              ),
              SizedBox(height: 20),
              Align(
                alignment: Alignment.bottomLeft,
                child: Text(
                  "Email",
                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                    color: Color.fromARGB(255, 17, 11, 75),
                  ),
                ),
              ),
              SizedBox(height: 8),
              TextField(
                controller: _emailController,
                keyboardType: TextInputType.emailAddress,
                decoration: InputDecoration(
                  hintText: "Type your email",
                  hintStyle: TextStyle(color: Colors.grey),
                  filled: true,
                  fillColor: Colors.white,
                  contentPadding: EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(18),    
                    borderSide: BorderSide.none,
                  ),
                ),
              ),
              SizedBox(height: 16),
              Align(
                alignment: Alignment.bottomLeft,
                child: Text(
                  "Password",
                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                    color: Color.fromARGB(255, 17, 11, 75),
                  ),
                ),
              ),
              SizedBox(height: 8),
              TextField(
                controller: _passwordController,
                obscureText: true,
                decoration: InputDecoration(
                  hintText: "Type your password",
                  hintStyle: TextStyle(color: Colors.grey),
                  filled: true,
                  fillColor: Colors.white,
                  contentPadding: EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(18),
                    borderSide: BorderSide.none,
                  ),
                ),
              ),
              if(_errorMessage != null)
                Padding(
                  padding: const EdgeInsets.only(top: 10),
                  child: Text(_errorMessage!, style: const TextStyle(color: Colors.red, fontWeight: FontWeight.bold), textAlign: TextAlign.center),
                ),
              Align(
                alignment: Alignment.center,
                child: 
                TextButton(
                  onPressed: (){
                    //Navigator.of(context).pop();

                    Navigator.pushNamed(context, Routes.REGISTERPAGE);
                  },
                  style: TextButton.styleFrom(
                    foregroundColor: Color.fromARGB(255, 17, 11, 75),
                    padding: EdgeInsets.zero,
                  ),
                  child: Text(
                    "or Sign Up",
                    style: TextStyle(
                      decoration: TextDecoration.underline,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),
              SizedBox(height: 10),
              Align(
                alignment: Alignment.topRight,
                child: TextButton(
                  onPressed: (){
                    //Navigator.of(context).pop();

                    Navigator.pushNamed(context, Routes.PASSWORDRESETPAGE);
                  },
                  style: TextButton.styleFrom(
                    foregroundColor: Color.fromARGB(255, 17, 11, 75),
                    padding: EdgeInsets.zero,
                  ),
                  child: Text(
                    "Forgot your password?",
                    style: TextStyle(
                      decoration: TextDecoration.underline,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),
              SizedBox(height: 12),
              SizedBox(
                width: 150,
                height: 50,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _handleLogin,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Color.fromARGB(255, 17, 11, 75),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(24),
                    ),
                    padding: EdgeInsets.symmetric(vertical: 14),
                  ),
                  child: Text(
                    "Login",
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}