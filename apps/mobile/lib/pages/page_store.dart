import 'package:flutter/material.dart';

class StorePage extends StatefulWidget{
  const StorePage({super.key});

  @override
  State<StorePage> createState() => _StorePageState();
}

class _StorePageState extends State<StorePage>{

  @override
  Widget build(BuildContext context){
    return Stack(
        children:[
          Positioned.fill(
            child: Image.asset("images/taco.png", fit: BoxFit.fill),
          ),
          Scaffold(
            backgroundColor: Colors.transparent,
            appBar: AppBar(
              elevation: 0,
              backgroundColor: const Color.fromARGB(255, 238, 237, 237),
              leadingWidth: 150,
              leading: Center(
                child: Container(
                  width: 90,
                  height: 40,
                  decoration: BoxDecoration(
                    color: const Color.fromARGB(255, 48, 47, 47),
                    borderRadius: BorderRadius.circular(15),
                    border: BoxBorder.all(color: Colors.amber),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      Padding(
                        padding: const EdgeInsets.only(left: 5),
                        child: Container(
                          width: 31,
                          height: 31,
                          decoration: BoxDecoration(
                            color: const Color.fromARGB(255, 221, 221, 221),
                            shape: BoxShape.circle,
                          ),
                          child: IconButton(
                            icon: const Icon(Icons.person_outline, color: Color.fromARGB(255, 0, 0, 0)),
                            onPressed: () {
                              print("person pressed"); // LogOut
                            },
                            padding: EdgeInsets.zero,
                            constraints: const BoxConstraints(),
                          ),
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.only(left: 5, right: 4),
                        child: Container(
                          width: 31,
                          height: 31,
                          decoration: BoxDecoration(
                            color: const Color.fromARGB(255, 221, 221, 221),
                            shape: BoxShape.circle,
                          ),
                          child: IconButton(
                            icon: const Icon(Icons.settings_outlined, color: Color.fromARGB(255, 0, 0, 0)),
                            onPressed: () {
                              print("settings pressed"); // Navigation.push settings page
                            },
                            padding: EdgeInsets.zero,
                            constraints: const BoxConstraints(),
                          ),
                        ),
                      ),
                    ],
                  ),
                )
              ),
              actionsPadding: EdgeInsets.only(right: 12),
              actions: [
                Center(
                child: Container(
                  width: 120,
                  height: 40,
                  decoration: BoxDecoration(
                    color: const Color.fromARGB(255, 48, 47, 47),
                    borderRadius: BorderRadius.circular(15),
                    border: BoxBorder.all(color: Colors.amber),
                    ),
                    child: Row(
                      children: [
                        
                        Icon(Icons.ac_unit, color: Colors.orange),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          )
        ],

        
    );
  }
}