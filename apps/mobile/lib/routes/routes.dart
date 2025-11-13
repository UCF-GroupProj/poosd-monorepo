import 'package:flutter/material.dart';
import 'package:large_project_dart/pages/page_login.dart';
import 'package:large_project_dart/pages/page_register.dart';
import 'package:large_project_dart/pages/page_register.dart';
import 'package:large_project_dart/pages/page_collections.dart';
import 'package:large_project_dart/pages/page_pw_reset.dart';
import 'package:large_project_dart/pages/page_store.dart';

class Routes{
  static const String LOGINPAGE = '/login';
  static const String REGISTERPAGE = '/register';
  static const String PASSWORDRESETPAGE = '/reset';
  static const String COLLECTIONSPAGE = '/collections';
  static const String SETTINGSPAGE = '/settings';
  static const String STOREPAGE = '/store';
  static const String CAROUSELPAGE = '/carousel';
  static const String SUMMONSPAGE = '/summons';

  static Map<String, Widget Function(BuildContext)> getRoutes(){
    return {
        '/': (context) => LoginPage(),
        LOGINPAGE: (context) => LoginPage(),
        REGISTERPAGE: (context) => RegisterPage(),
        REGISTERPAGE: (context) => RegisterPage(),
        COLLECTIONSPAGE: (context) => CollectionsPage(),
        PASSWORDRESETPAGE: (context) => ResetPage(),
        STOREPAGE: (context) => StorePage(),
        // SETTINGSPAGE: (context) => SettingsPage(),
        // CAROUSELPAGE: (context) => CarouselPage(),
        // SUMMONSPAGE: (context) => SummonsPage(),
    };
  }
}