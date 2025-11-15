import 'package:flutter/material.dart';

class CollectionsPage extends StatelessWidget {
  const CollectionsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Column(
        children: [
          FavoritesBar(),
          Divider(
            color: Colors.white,   // Line color
            thickness: 1,          // Line thickness
            indent: 20,            // Left margin
            endIndent: 20,         // Right margin
          ),
          CardsOwnedBar(),

          const SizedBox(height: 10),

          CardList(),
        ],
      ),
    );
  }
}

class FavoritesBar extends StatelessWidget {
  const FavoritesBar({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.black, // background color for the bar
      padding: const EdgeInsets.symmetric(vertical: 10),
      width: double.infinity, // full screen width
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly, // space images evenly
        children: [
          Image(
            image: AssetImage('images/taco.png'),
            width: 100,
            height: 100,
          ),
          Image(
            image: AssetImage('images/taco.png'),
            width: 100,
            height: 100,
          ),
          Image(
            image: AssetImage('images/taco.png'),
            width: 100,
            height: 100,
          ),
        ],
      ),
    );
  }
}

class CardsOwnedBar extends StatelessWidget {
  const CardsOwnedBar({super.key});

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

class CardList extends StatelessWidget {
  const CardList({super.key});

  @override
  Widget build(BuildContext context) {
    final List<String> images = [
      'images/taco.png',
      'images/taco.png',
      'images/taco.png',
      'images/taco.png',
      'images/taco.png',
      'images/taco.png',
      'images/taco.png',
      'images/taco.png',
      'images/taco.png',
      'images/taco.png',
      'images/taco.png',
      'images/taco.png',
      'images/taco.png',
      'images/taco.png',
      'images/taco.png',
    ];

    return Container(
      height: 500, // ✅ fixed height //TODO Fixed height doesnt touch the bottom of the nav bar
      padding: const EdgeInsets.all(10),
      child: Scrollbar( //TODO Another exception was thrown: The PrimaryScrollController is attached to more than one ScrollPosition. Might be the cause for exception?
        thumbVisibility: true, // shows vertical scrollbar
        child: GridView.builder(
          itemCount: images.length,
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 3,       // 3 images per row
            crossAxisSpacing: 25,
            mainAxisSpacing: 10,
            childAspectRatio: 1.25,     // square images
          ),
          itemBuilder: (context, index) {
            return Image.asset(
              images[index],
              fit: BoxFit.cover,
            );
          },
        ),
      ),
    );
  }
}