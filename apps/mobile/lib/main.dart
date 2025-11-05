import 'package:flutter/material.dart';
import 'package:carousel_slider/carousel_slider.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Image Layout Example',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: const ImageLayoutPage(),
    );
  }
}

class ImageLayoutPage extends StatelessWidget {
  const ImageLayoutPage({super.key});

  @override
  Widget build(BuildContext context) {
    // Example image URLs (replace with your own)
    final List<String> imageUrls = [
      'https://picsum.photos/400/200?1',
      'https://picsum.photos/400/200?2',
      'https://picsum.photos/400/200?3',
      'https://picsum.photos/400/200?4',
      'https://picsum.photos/400/200?5',
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Olympull'),
        centerTitle: true,
      ),
      body: Column(
        children: [
          // 🔹 Top image
          SizedBox(
            width: double.infinity,
            height: 200,
            child: Image.network(
              'https://picsum.photos/800/400',
              fit: BoxFit.cover,
            ),
          ),

          const SizedBox(height: 10),

          // 🔹 Scrollable array of images (horizontal)
          SizedBox(
            height: 120,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 10),
              itemCount: imageUrls.length,
              separatorBuilder: (_, __) => const SizedBox(width: 10),
              itemBuilder: (context, index) {
                return ClipRRect(
                  borderRadius: BorderRadius.circular(10),
                  child: Image.network(
                    imageUrls[index],
                    width: 160,
                    fit: BoxFit.cover,
                  ),
                );
              },
            ),
          ),

          const SizedBox(height: 20),

          // 🔹 Carousel slider
          Expanded(
            child: CarouselSlider(
              options: CarouselOptions(
                height: double.infinity,
                autoPlay: true,
                enlargeCenterPage: true,
                viewportFraction: 0.8,
              ),
              items: imageUrls.map((url) {
                return Builder(
                  builder: (BuildContext context) {
                    return Container(
                      width: MediaQuery.of(context).size.width,
                      margin: const EdgeInsets.symmetric(horizontal: 5.0),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(12),
                        color: Colors.grey[200],
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(12),
                        child: Image.network(url, fit: BoxFit.cover),
                      ),
                    );
                  },
                );
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }
}