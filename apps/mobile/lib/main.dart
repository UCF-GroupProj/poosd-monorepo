import 'package:flutter/material.dart';
import 'package:large_project_dart/routes/routes.dart';


// This library and code below allows us to preview the looks on many device without much configuration. Just plug the code in runApp rather than MyApp.
/* import 'package:device_preview/device_preview.dart';
 */

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

      routes: Routes.getRoutes(),
      initialRoute: Routes.COLLECTIONSPAGE,
    );
  }
}

