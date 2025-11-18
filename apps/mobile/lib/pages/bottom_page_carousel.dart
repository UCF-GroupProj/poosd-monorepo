import 'package:flutter/material.dart';
import 'package:carousel_slider/carousel_slider.dart';

class BottomPageCarousel extends StatelessWidget {
  const BottomPageCarousel({super.key});

  @override
  Widget build(BuildContext context) {

    final List<String> images = [
      'images/taco.png',
      'images/taco.png',
      'images/taco.png',
    ];
//TODO Pop navigation stack until it is not current route (Gabe).
// For example, if on store page and press "Go to Store" it pushes another store route on to stack and if you scroll away with carousel it will only pop one if we dont implement popUntil.
// Or maybe not since this is on webbrowser maybe? I dont know.
return Center(
      child: CarouselSlider(
        options: CarouselOptions(
          height: 100,
          viewportFraction: 1.0, // ✅ Only 1 image visible at a time
          enlargeCenterPage: false,
        ),
        items: images.map((imagePath) {
          return Builder(
            builder: (BuildContext context) {
              return Image.asset(
                imagePath,
                width: double.infinity,
              );
            },
          );
        }).toList(),
      ),
    ); 
  }
}