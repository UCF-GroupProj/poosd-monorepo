import 'package:flutter/material.dart';
import 'package:large_project_dart/pages/page_collections.dart';
import 'package:large_project_dart/utils/get_api.dart';
import 'package:large_project_dart/utils/global_data.dart';

class ImagePopout extends StatelessWidget {
  final CardData card;

  const ImagePopout({required this.card});

  static String cardName = "";
  static String rarity = "";  
  static String flavorText = "";

  @override
  Widget build(BuildContext context) {
    cardName = card.name;
    rarity = card.rarity;
    flavorText = card.description;

    return Dialog(
      backgroundColor: Colors.transparent,  // make popup fullscreen
      insetPadding: EdgeInsets.zero,
      child: Column(
      children: [
        // --- Top Half (GestureDetector) ---
        Expanded(
          flex: 4,
          child: GestureDetector(
            onTap: () => Navigator.pop(context),
            child: Container(
              color: Colors.black..withValues(alpha: .7),
              child: Center(
                child: Column(
                  children: [
                    InspectNameBar(),
                    Expanded(
                      child: Center( // centers the column on the screen
                        child: Column(
                          mainAxisSize: MainAxisSize.min, // shrink column to its children
                          children: [
                            Container(
                              decoration: BoxDecoration(
                              border: Border.all(
                              color: Colors.brown, // border color
                              width: 4,          // border width
                            ),
                          borderRadius: BorderRadius.circular(12), // optional: rounded corners
                        ),
                        child: ClipRRect(
                        borderRadius: BorderRadius.circular(12), // same as borderRadius
                        child: Image.network(
                          card.imageURL,
                          width: 250,
                          height: 400,
                          fit: BoxFit.scaleDown,
                        ),
                      ),
                    )                         
                          ],
                        ),
                      )
                    )
                  ],
                ),
              ),
            ),
          ),
        ),

        // --- Bottom Half (non-tappable) ---
        Expanded(
          flex: 2,
          child: Container(

            color: Colors.black.withOpacity(0.70),
            child: Center(
              child: InspectTextbox(card),
            ),
          ),
        ),
      ],
    )     
    );
  }
}


class InspectNameBar extends StatelessWidget {

  @override
  Widget build(BuildContext context) {

    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min, // shrink to content
        children: [
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 20,
                height: 20,
                color: Colors.green,
              ),
              SizedBox(width: 10), // spacing
              Text(
                ImagePopout.cardName,
                style: TextStyle(
                  fontSize: 50,
                  color: Colors.white,
                  decoration: TextDecoration.underline,
                  decorationColor: Colors.white,
                  ),
              ),
              SizedBox(width: 10), // spacing
              Container(
                width: 20,
                height: 20,
                color: Colors.green,
              ),
            ],
          ),
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                ImagePopout.rarity,
                style: TextStyle(
                  height: -1.2,
                  fontSize: 10,
                  color: Colors.white,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class InspectTextbox extends StatefulWidget {
  final CardData card;  

  InspectTextbox(this.card);

  @override
  _InspectTextboxState createState() =>
      _InspectTextboxState();
}

class _InspectTextboxState extends State<InspectTextbox> {
  bool favorited = false;

  @override
  Widget build(BuildContext context) {
//    for (int i = 0; i < GlobalData.favoritesList.length; i++) {
//      if (GlobalData.cardsList[GlobalData.favoritesListAsID[i]].cardID == widget.card.cardID) {
//        favorited = true;
//      }
//    }

    return Column(
      children: [
        // --- Button at the top ---
        Padding(
          padding: const EdgeInsets.all(0),
          child: IconButton(
            iconSize: 40,
            color: favorited ? Colors.deepPurple : Colors.grey,
            icon: Icon(favorited ? Icons.star : Icons.star_border),
            onPressed: () {
              setState(() {
                CardsData.updateFavorite(widget.card, !favorited);
//                favorited ? GlobalData.favoritesList.removeWhere((id) => GlobalData.cardsList[id].cardID == widget.card.cardID)
//                : GlobalData.favoritesList.add(widget.card.cardID);

                favorited = !favorited;

                // TODO: Set global favorited flag here
              });
            },
          ),
        ),

        // --- Scrollable Text Box ---
        Expanded(
          child: Container(
            margin: EdgeInsets.all(40),
            padding: EdgeInsets.all(20),
            decoration: BoxDecoration(
              border: Border.all(color: Colors.grey),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Scrollbar(
              thumbVisibility: true,
              trackVisibility: true,
              child: SingleChildScrollView(
                child: Text(
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " *
                      20, // repeated text to demonstrate scrolling
                    style: TextStyle(
                    fontSize: 16,
                    color: Colors.grey,
                    ),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}