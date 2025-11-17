import 'package:flutter/material.dart';
import 'package:large_project_dart/utils/global_data.dart';
import 'package:large_project_dart/pages/page_inspect.dart';

class CollectionsPage extends StatefulWidget {
  const CollectionsPage({super.key});

  @override
  State<CollectionsPage> createState() => _CollectionsPageState();
}

class _CollectionsPageState extends State<CollectionsPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Column(
        children: [
          FavoritesBar(),
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 10),
            child: Divider(
              color: Colors.white,   // Line color
              thickness: 1,          // Line thickness
              indent: 20,            // Left margin
              endIndent: 20,         // Right margin
            ),
          ),
          CardsOwnedBar(),

          const SizedBox(height: 10),

          Expanded(child: CardList()),
        ],
      ),
    );
  }
}


class FavoritesBar extends StatefulWidget {
  const FavoritesBar({super.key});

  @override
  State<FavoritesBar> createState() => _FavoritesBarState();
}

class _FavoritesBarState extends State<FavoritesBar> {
  @override
  Widget build(BuildContext context) {
    print(GlobalData.favoritesListAsInt.length);
    return Container(
      color: Colors.black, // background color for the bar
      padding: const EdgeInsets.symmetric(vertical: 10),
      width: double.infinity, // full screen width
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly, // space images evenly
        children: [
          Stack(
            children: [ 
              // Positioned.fill(child: Container(color: Colors.white)),
              GlobalData.favoritesListAsInt.length >= 1 ?
              Image.network(
                GlobalData.cardsList[GlobalData.favoritesListAsInt[0]].imageURL,
                width: 80,
                height: 100,
              ) :
              Image(
                image: AssetImage('images/taco.png'),
                width: 80,
                height: 100,
              ),
            ],
          ),
          Stack(
            children: [ 
              // Positioned.fill(child: Container(color: Colors.grey[200])),
              GlobalData.favoritesListAsInt.length >= 2 ?
              Image.network(
                GlobalData.cardsList[GlobalData.favoritesListAsInt[1]].imageURL,
                width: 80,
                height: 100,
              ) :
              Image(
                image: AssetImage('images/taco.png'),
                width: 80,
                height: 100,
              ),
            ],
          ),
          Stack(
            children: [ 
              // Positioned.fill(child: Container(color: Colors.white)),
              GlobalData.favoritesListAsInt.length >= 3 ?
              Image.network(
                GlobalData.cardsList[GlobalData.favoritesListAsInt[2]].imageURL,
                width: 80,
                height: 100,
              ) :
              Image(
                image: AssetImage('images/taco.png'),
                width: 80,
                height: 100,
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class CardsOwnedBar extends StatefulWidget {
  const CardsOwnedBar({super.key});

  @override
  State<CardsOwnedBar> createState() => _CardsOwnedBarState();
}

class _CardsOwnedBarState extends State<CardsOwnedBar> {
  @override
  Widget build(BuildContext context) {
    
    List<String> strFormat = ['${GlobalData.ownedCommon}/${GlobalData.numCommon}', 
                              '${GlobalData.ownedRare}/${GlobalData.numRare}',
                              '${GlobalData.ownedEpic}/${GlobalData.numEpic}',
                              '${GlobalData.ownedLegendary}/${GlobalData.numLegendary}',
                              '${GlobalData.totalCardsOwned}/${GlobalData.totalCards}'];
    final List<Color> rarityColors = [
      Colors.green,
      Colors.blue,
      Colors.purple,
      Colors.orange,
      Colors.white
    ];

    return Container(
      color: Colors.black,
      padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 5),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: List.generate(strFormat.length, (index) {
          return Row(
            children: [
              Text(
                strFormat[index],
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                ),
              ),
              const SizedBox(width: 7), // spacing between box and number
              // Colored box
              Container(
                width: 20,
                height: 20,
                color: rarityColors[index],
              ),
            ],
          );
        }),
      ),
    );
  }
}

class CardList extends StatefulWidget {
  const CardList({super.key});

  @override
  State<CardList> createState() => _CardListState();
}

class _CardListState extends State<CardList> {
  @override
  Widget build(BuildContext context) {
    return Container(
      
      padding: const EdgeInsets.all(10),
      child: Scrollbar(
        thumbVisibility: false,
        child: GridView.builder(
          itemCount: GlobalData.cardImages.length,
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 3,
            crossAxisSpacing: 25,
            mainAxisSpacing: 20,
            childAspectRatio: .7,
          ),
          itemBuilder: (context, index) {
            return GestureDetector(
              onTap: () {
                if (GlobalData.isOwned[index])
                {
                  showDialog(
                  context: context,
                  barrierDismissible: true,
                  builder: (_) => ImagePopout(card: GlobalData.cardsList[index]),
                  );
                }
                
              },
              child: GlobalData.isOwned[index]  // This checks if card is owned, prints color or greyscale
              ? Image.network(
              GlobalData.cardImages[index],
              fit: BoxFit.cover,
              )
              : ColorFiltered(
                colorFilter: const ColorFilter.matrix(<double>[
                0.2126, 0.7152, 0.0722, 0, 0, //
                0.2126, 0.7152, 0.0722, 0, 0, //
                0.2126, 0.7152, 0.0722, 0, 0, //
                0,      0,      0,      1, 0, //
                ]),
                child: Image.network(
                  GlobalData.cardImages[index],
                  fit: BoxFit.cover
                  ),
                )
            );
          },
        ),
      )
    );
  }
}