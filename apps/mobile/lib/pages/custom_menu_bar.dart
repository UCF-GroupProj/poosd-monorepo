import 'package:flutter/material.dart';

class CustomMenuBar extends StatelessWidget {
  const CustomMenuBar({super.key});

  @override
  Widget build(BuildContext context) {
    final int currencyVal = 12345;  // TODO: Pull currency from DB
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      color: Colors.grey.shade200,
      child: Row(
        children: [
          // Left section: 3 icons
          const Row(
            children: [
              Icon(Icons.home, color: Colors.black87),
              SizedBox(width: 12),
              Icon(Icons.favorite, color: Colors.black87),
              SizedBox(width: 12),
              Icon(Icons.notifications, color: Colors.black87),
            ],
          ),

          // Spacer pushes the next section to the right
          const Spacer(),

          // Right section: Text field and an icon
          Text(
            '$currencyVal',
            style: TextStyle(fontSize: 25, color: Colors.black87),
          ),
          const SizedBox(width: 8),
          const Icon(Icons.search, color: Colors.black87),
        ],
      ),
    );
  }
}