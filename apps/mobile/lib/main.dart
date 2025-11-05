import 'package:flutter/material.dart';
//import 'package:large_project_dart/page_login.dart';
import 'package:large_project_dart/page_collections.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Olympull',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: const CollectionsPage(),
    );
  }
}

