import 'package:flutter/material.dart';

class GlobalAppbar extends StatelessWidget implements PreferredSizeWidget{
  final PageController pageController;

  const GlobalAppbar({super.key, required this.pageController});

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);

  void _getMoreGems(BuildContext context){
    showDialog(
      context: context,
      builder: (BuildContext diaglogContext){
        return AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
          title: const Text("Purchase More Currency?"),
          content: const Text("Would you like to visit the Store now to stock up on ambrosia?"),
          actions: [
            TextButton(
              onPressed: (){
                Navigator.of(diaglogContext).pop();
              },
              child: const Text("Not Now")
            ),
            TextButton(
              onPressed: (){
                Navigator.of(diaglogContext).pop();

                pageController.animateToPage(
                  1, 
                  duration: const Duration(milliseconds: 300),
                  curve: Curves.easeOut,
                );
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
            width: 50,
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
                  padding: const EdgeInsets.all(5),
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