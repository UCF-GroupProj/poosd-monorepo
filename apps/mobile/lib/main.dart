import 'package:flutter/material.dart';
//import 'package:large_project_dart/page_login.dart';
import 'package:large_project_dart/page_login.dart';
import 'package:large_project_dart/page_collections.dart';
import 'package:large_project_dart/page_pw_reset.dart';


// This library and code below allows us to preview the looks on many device without much configuration. Just plug the code in runApp rather than MyApp.
/* import 'package:device_preview/device_preview.dart';
DevicePreview(builder: (context) => MyApp()) */

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,

      title: 'Olympull',
      theme: ThemeData(primarySwatch: Colors.blue),
      
      routes:{
        '/': (context) => const LoginPage(),
        '/collections': (context) => const CollectionsPage(),
        '/reset': (context) => const ResetPage(),
      },
      initialRoute: '/reset',
    );
  }
}

