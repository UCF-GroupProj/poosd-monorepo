import 'package:flutter/material.dart';
import 'package:large_project_dart/pages/global_appbar.dart';
import 'package:large_project_dart/pages/page_collections.dart';
import 'package:large_project_dart/pages/page_store.dart';
import 'package:large_project_dart/utils/get_api.dart';

class MainAppShell extends StatefulWidget {
  const MainAppShell({super.key});

  @override
  State<MainAppShell> createState() => _MainAppShellState();
}

class _MainAppShellState extends State<MainAppShell> {
  int _selectedIndex = 0;
  late PageController _pageController;

  final List<Widget> _pages = const [
    CollectionsPage(),
    StorePage(),
    //TODO SummonsPage(),
  ];

  @override
  void initState() {
    super.initState();
    _pageController = PageController(initialPage: _selectedIndex);

    // Initialize the API
    API.initAPI();
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _onIconTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });

    _pageController.animateToPage(
      index,
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeOut,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: GlobalAppbar(pageController: _pageController), 

      body: PageView(
        controller: _pageController,
        children: _pages,
        onPageChanged: (index) {
          setState(() {
            _selectedIndex = index;
          });
        },
      ),

      bottomNavigationBar: Container(
        height: 80,
        color: const Color.fromARGB(255, 40, 40, 40),
        padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 15),
        
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            _buildCarouselItem(Icons.collections_bookmark, 0), 
            _buildCarouselItem(Icons.storefront, 1),
            _buildCarouselItem(Icons.add_to_photos, 2),
          ],
        ),
      ),
    );
  }

  Widget _buildCarouselItem(IconData icon, int index) {
    final bool isSelected = index == _selectedIndex;
    
    return GestureDetector(
      onTap: () => _onIconTapped(index),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        curve: Curves.easeIn,
        width: 60,
        height: 60,
        decoration: BoxDecoration(
          //color: isSelected ? Colors.amber.withAlpha(0) : Colors.transparent, //TODO Might delete if dont want yellowish tint
          borderRadius: BorderRadius.circular(15),
          border: isSelected ? Border.all(color: Colors.amber, width: 2.0) : Border.all(color: Colors.transparent),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon( icon, color: isSelected ? Colors.amber : Colors.white60, size: 28,),
          ],
        ),
      ),
    );
  }
}