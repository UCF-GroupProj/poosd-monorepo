import 'package:flutter/material.dart';
import 'package:large_project_dart/pages/global_appbar.dart';

class StorePage extends StatefulWidget{
  const StorePage({super.key});

  @override
  State<StorePage> createState() => _StorePageState();
}

class _StorePageState extends State<StorePage>{

  void _showPurchaseConfirmation(BuildContext context, {required String itemName, required String itemPrice}){
    showDialog(
      context: context,
      builder: (BuildContext dialogContext){
        return AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadiusGeometry.circular(15)),
          title: const Text("Confirm Purchase"),
          content: Text('Are you sure you want to buy $itemName for $itemPrice?'),
          actions: [
            TextButton(
              onPressed: (){
                Navigator.of(dialogContext).pop();
              },
              child: Text("Cancel"),
            ),
            TextButton(
              onPressed: (){
                Navigator.of(dialogContext).pop();
              },
              child: Text("Confirm"),
            )
          ],
        );
      } 
    );
  }

  Widget _buildStoreItem(BuildContext context, {required String title, required String description, required String price, required bool isPopular, required Color color}){
    final screenWidth = MediaQuery.of(context).size.width;

    return GestureDetector(
      onTap: (){
        _showPurchaseConfirmation(context, itemName: title, itemPrice: price);
      },
      child: Container(
        width: screenWidth * .9,
        padding: EdgeInsets.only(left: 10, top: 10, bottom: 10, right: 10),
        decoration: BoxDecoration(
          color: const Color.fromARGB(255, 201, 200, 200),
          borderRadius: BorderRadius.circular(15),
          boxShadow: [ BoxShadow(color: Colors.black.withAlpha(175), blurRadius: 3, offset: const Offset(0, 3)) ]
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            Stack(
              children: [
                Container(
                  width: 120,
                  height: 120,
                  decoration: BoxDecoration(
                    color: const Color.fromARGB(255, 48, 47, 47),
                    borderRadius: BorderRadius.circular(15)
                  ),
                  child: const Center(
                    child: Icon(Icons.ac_unit, color: Colors.orange, size: 100,)
                  ),         
                ),
                if(isPopular)
                  Positioned(
                    top: 0,
                    right: 0,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: color,
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: const Text("Popular", style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold))
                    )
                  )
                else
                  Positioned(
                    top: 0,
                    right: 0,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: color,
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: const Text("Value", style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold))
                    )
                  )
              ],
            ),
            const SizedBox(width: 15,),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.black)),
                  const SizedBox(height: 4,),
                  Text(description, style: const TextStyle(fontSize: 14, color: Colors.black87)),
                ],
              )
            ),
            Padding(
              padding: const EdgeInsets.all(5),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                decoration: BoxDecoration(
                  color: const Color.fromARGB(255, 48, 47, 47),
                  borderRadius: BorderRadius.circular(15),
                ),
                child: Text(price, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
              )
            )
          ],
        ),
      ),
    );
  }
  @override
  Widget build(BuildContext context){
    return Stack( //TODO Could remove the background and just make it gray, if so delete this stack
      children: [ 
            Positioned.fill(
              child: Image.asset("images/taco.png", fit: BoxFit.fill),
            ),
            
            Scaffold(
            //backgroundColor: const Color.fromARGB(255, 48, 47, 47), // If we want a darker look
            backgroundColor: Color.fromARGB(255, 177, 177, 177),
            //backgroundColor: Colors.transparent,
            appBar: GlobalAppbar(),
      
            body: SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.only(left: 20),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    const SizedBox(height: 20),
                    _buildStoreItem(context, title: "Ambrosia x10", description: "Get yourself started with 10 summons! Rare guaranteed!", price: "\$5.99", isPopular: true, color: Colors.red),
                    const SizedBox(height: 15),
                    _buildStoreItem(context, title: "Ambrosia x50", description: "Great Value!", price: "\$25.99", isPopular: false, color: Colors.green),
                    const SizedBox(height: 15),
                    _buildStoreItem(context, title: "Ambrosia x100", description: "Great value! Epic guaranteed!", price: "\$45.99", isPopular: false, color: Colors.green),
                    const SizedBox(height: 20),
                  ],
                ),
              ),
            ),
          ),
      ]
    );
  }
}