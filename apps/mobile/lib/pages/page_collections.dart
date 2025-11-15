import 'package:flutter/material.dart';

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
    return Container(
      color: Colors.black, // background color for the bar
      padding: const EdgeInsets.symmetric(vertical: 10),
      width: double.infinity, // full screen width
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly, // space images evenly
        children: [
          Stack(
            children: [ 
              Positioned.fill(child: Container(color: Colors.white)),
              Image(
                image: AssetImage('images/taco.png'),
                width: 80,
                height: 100,
              ),
            ],
          ),
          Stack(
            children: [ 
              Positioned.fill(child: Container(color: Colors.grey[200])),
              Image(
                image: AssetImage('images/taco.png'),
                width: 80,
                height: 100,
              ),
            ],
          ),
          Stack(
            children: [ 
              Positioned.fill(child: Container(color: Colors.white)),
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
    // Example numbers and colors
    final List<String> numbers = ['1/16', '0/8', '0/4', '0/2', '1/30'];  // TODO: Pull amount from DB
    final List<Color> colors = [
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
        children: List.generate(numbers.length, (index) {
          return Row(
            children: [
              Text(
                numbers[index].toString(),
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
                color: colors[index],
              ),
              
              // Number
              
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
    final List<String> images = List.generate(30, (index) => 'images/taco.png');

    return Container(
      
      padding: const EdgeInsets.all(10),
      child: Scrollbar(
        thumbVisibility: false,
        child: GridView.builder(
          itemCount: images.length,
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 3,
            crossAxisSpacing: 25,
            mainAxisSpacing: 20,
            childAspectRatio: .7,
          ),
          itemBuilder: (context, index) {
            return Image.asset(
              images[index],
              fit: BoxFit.fill,
            );
          },
        ),
      ),
    );
  }
}