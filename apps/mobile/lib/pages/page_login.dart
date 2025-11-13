import 'package:flutter/material.dart';
import 'package:large_project_dart/routes/routes.dart';
//import 'package:large_project_dart/page_collections.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
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
              Align(
                alignment: Alignment.center,
                child: 
                TextButton(
                  onPressed: (){
                    Navigator.of(context).pop();

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
              Align(
                alignment: Alignment.center,
                child: TextButton(
                  onPressed: () {},
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
                    Navigator.of(context).pop();

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
                  onPressed: (){
                    Navigator.of(context).pop();

                    Navigator.pushNamed(context, Routes.COLLECTIONSPAGE); //TEMPORARY
                  },
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