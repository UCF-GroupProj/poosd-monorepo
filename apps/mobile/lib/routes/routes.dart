import 'package:flutter/material.dart';
import 'package:large_project_dart/pages/page_login.dart';
import 'package:large_project_dart/pages/page_register.dart';
import 'package:large_project_dart/pages/page_collections.dart';
import 'package:large_project_dart/pages/page_pw_reset.dart';
import 'package:large_project_dart/pages/page_store.dart';
import 'package:large_project_dart/pages/page_summon.dart';
import 'package:large_project_dart/pages/main_app_shell.dart';

class Routes{
  static const String LOGINPAGE = '/login';
  static const String REGISTERPAGE = '/register';
  static const String PASSWORDRESETPAGE = '/reset';
  static const String COLLECTIONSPAGE = '/collections';
  static const String SETTINGSPAGE = '/settings';
  static const String STOREPAGE = '/store';
  static const String SUMMONSPAGE = '/summons';
  static const String MAINAPPPAGE = '/main';

  static Map<String, Widget Function(BuildContext)> getRoutes(){
    return {
        '/': (context) => LoginPage(),
        LOGINPAGE: (context) => LoginPage(),
        REGISTERPAGE: (context) => RegisterPage(),
        COLLECTIONSPAGE: (context) => CollectionsPage(),
        PASSWORDRESETPAGE: (context) => ResetPage(),
        STOREPAGE: (context) => StorePage(),
        // SETTINGSPAGE: (context) => SettingsPage(),
        SUMMONSPAGE: (context) => SummonPage(),
        MAINAPPPAGE: (context) => MainAppShell()
    };
  }
}