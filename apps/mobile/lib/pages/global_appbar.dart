import 'package:flutter/material.dart';
import 'package:large_project_dart/routes/routes.dart';

class GlobalAppbar extends StatelessWidget implements PreferredSizeWidget{
  const GlobalAppbar({super.key});

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);

  void _getMoreGems(BuildContext context){
    showDialog(
      context: context,
      builder: (BuildContext context){
        return AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
          title: const Text("Purchase More Currency?"),
          content: const Text("Would you like to visit the Store now to stock up on ambrosia?"),
          actions: [
            TextButton(
              onPressed: (){
                Navigator.of(context).pop();
              },
              child: const Text("Not Now")
            ),
            TextButton(
              onPressed: (){
                Navigator.of(context).pop();

                Navigator.pushNamed(context, Routes.STOREPAGE);
              },
              style: ElevatedButton.styleFrom(backgroundColor: Colors.amber),
              child: const Text("Go to Store")
            ),
          ]
        );
      }
    );
  }
  
  @override
  Widget build(BuildContext context) {
    return AppBar(
        elevation: 0,
        backgroundColor: const Color.fromARGB(255, 238, 237, 237),
        leadingWidth: 130,
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
                        print("pressed settings");
                        //Navigator.pushNamed(context, Routes.SETTINGSPAGE);
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
        actionsPadding: EdgeInsets.only(right: 20),
        actions: [
          Center(
            child: GestureDetector(
              onTap: () {_getMoreGems(context);},
              child: Container(
                width: 120,
                height: 40,
                decoration: BoxDecoration(
                  color: const Color.fromARGB(255, 48, 47, 47),
                  borderRadius: BorderRadius.circular(15),
                  border: BoxBorder.all(color: Colors.amber),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      Text("Placeholder", style: TextStyle(color: Color.fromARGB(255, 221, 221, 221)),),
                      Padding(
                        padding: const EdgeInsets.only(left: 3,right: 5),
                        child: Icon(Icons.ac_unit, color: Colors.orange),
                      ),
                    ],
                  ),
                ),
            ),
          ),
        ],
      );
  }
}