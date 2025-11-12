import 'package:flutter/material.dart';

class ResetPage extends StatefulWidget {
  const ResetPage({super.key});

  @override
  State<ResetPage> createState() => _ResetPageState();
}

class _ResetPageState extends State<ResetPage> {
  final emailController = TextEditingController();

  @override
  void dispose(){
    emailController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    
    return Stack(
        children:[
          Positioned.fill(
            child: Image.asset("images/taco.png", fit: BoxFit.fill),
          ),
        
          Scaffold(
            backgroundColor: Colors.transparent,
            appBar: AppBar(
              elevation: 0,
              backgroundColor: Colors.blue,
            ),
            body: Center(
              child: Container(
                width: screenWidth * .8,
                height: screenWidth * .6,
                decoration: BoxDecoration(
                  color: const Color.fromARGB(255, 120, 156, 173),
                  borderRadius: BorderRadius.circular(15)
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    SizedBox(height: 10),
                    Center(
                      child: Text("Password Reset", style: TextStyle(fontSize: 24.0, color: Colors.white, fontWeight: FontWeight.w500),),
                    ),
                    SizedBox(height: 20),
                    Padding(
                      padding: const EdgeInsets.only(left: 25),
                      child: Text("Email", style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold)),
                    ),
                    Padding(
                      padding: const EdgeInsets.only(left: 15, right: 15),
                      child: TextField(
                        controller: emailController,
                        decoration: InputDecoration(
                          enabledBorder: OutlineInputBorder(
                            borderSide: BorderSide(color: Colors.transparent),
                            borderRadius: BorderRadius.circular(15)
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderSide: BorderSide(color: Colors.black),
                            borderRadius: BorderRadius.circular(12)
                          ),
                          hintText: "example@gmail.com",
                          fillColor: Colors.grey[200],
                          filled: true,
                          labelText: "Type your email",
                          floatingLabelBehavior: FloatingLabelBehavior.never
                        )
                      ),
                    ),
                    Center(
                      child: Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: ElevatedButton(
                          onPressed: (){
                            print("button 1");
                          },
                          child: const Text("confirm")
                          ),
                      ),
                    )
                  ],
                )
              )
            ),
          ),
        ],
    );
  }
}