import 'package:flutter/material.dart';
import 'package:large_project_dart/utils/get_api.dart';
import 'package:large_project_dart/routes/routes.dart';

class ResetPage extends StatefulWidget {
  const ResetPage({super.key});

  @override
  State<ResetPage> createState() => _ResetPageState();
}

class _ResetPageState extends State<ResetPage> {
  final _emailController = TextEditingController();
  bool _isLoading = false;
  final String _successMessage = 'Email will be sent momentarily if it exist';

  bool isEmailValid(String email) {
    final bool emailValid = RegExp(r"^[a-zA-Z0-9.a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9]+\.[a-zA-Z]+").hasMatch(email);
    return emailValid;
  }

  Future<void> _handleReset() async{
    final email = _emailController.text;
    final context = this.context;

    setState(() {
      _isLoading = true;
    });

    try{
      await Reset.reset(email);

      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(_successMessage), backgroundColor: Colors.green, duration: const Duration(seconds: 2)));

      setState(() {
        _isLoading = false;
      });
    } catch (e){
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  void dispose(){
    _emailController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    
    return Stack(
        children:[
          Positioned.fill(
            child: Image.asset("images/background(mobile).png", fit: BoxFit.fill),
          ),
        
          Scaffold(
            backgroundColor: Colors.transparent,
            body: Center(
              child: Container(
                width: screenWidth * .8,
                height: screenWidth * .7,
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: .8),
                  borderRadius: BorderRadius.circular(15)
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    SizedBox(height: 10),
                    Center(
                      child: Text("Password Reset", style: TextStyle(fontSize: 24.0, color: Color.fromARGB(255, 17, 11, 75), fontWeight: FontWeight.w500),),
                    ),
                    SizedBox(height: 20),
                    Padding(
                      padding: const EdgeInsets.only(left: 25),
                      child: Text("Email", style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold)),
                    ),
                    Padding(
                      padding: const EdgeInsets.only(left: 15, right: 15),
                      child: TextField(
                        controller: _emailController,
                        decoration: InputDecoration(
                          enabledBorder: OutlineInputBorder(
                            borderSide: BorderSide(color: Colors.transparent),
                            borderRadius: BorderRadius.circular(15)
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderSide: BorderSide(color: Color.fromARGB(255, 17, 11, 75),),
                            borderRadius: BorderRadius.circular(12)
                          ),
                          hintText: "example@gmail.com",
                          fillColor: Colors.white,
                          filled: true,
                          labelText: "Type your email",
                          floatingLabelBehavior: FloatingLabelBehavior.never
                        )
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.only(right: 20, top: 5),   // ⭐ Add this
                      child: Align(
                        alignment: Alignment.topRight,
                        child: TextButton(
                          onPressed: () {
                            Navigator.pushNamed(context, Routes.LOGINPAGE);
                          },
                          style: TextButton.styleFrom(
                            foregroundColor: Color.fromARGB(255, 17, 11, 75),
                            padding: EdgeInsets.zero,
                          ),
                          child: Text(
                            "back to Log In",
                            style: TextStyle(
                              decoration: TextDecoration.underline,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ),
                    ),
                    Center(
                      child: Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: ElevatedButton(
                          onPressed: _isLoading ? null : _handleReset,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Color.fromARGB(255, 17, 11, 75),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(16),
                            ),
                            padding: EdgeInsets.symmetric(vertical: 14, horizontal: 20),
                          ),
                          child: Text("Confirm", style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: Colors.white)),
                        ),
                      ),
                    ),
                  ],
                )
              )
            ),
          ),
        ],
    );
  }
}