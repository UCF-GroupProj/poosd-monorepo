import 'package:flutter/material.dart';
import 'package:flutter_scroll_shadow/flutter_scroll_shadow.dart';

class SummonPage extends StatefulWidget {
  const SummonPage({super.key});

  @override
  State<SummonPage> createState() => _SummonPageState();
}

class _SummonPageState extends State<SummonPage> {
  
  // Helper Widget for the x1/x10 buttons, stylized to look like the image.
  Widget _buildSummonButton({
    required String text,
    required Color gemColor,
    required VoidCallback onTap,
    }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: BoxDecoration(
          color: const Color(0xFF1A1A1A), // Dark background
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: gemColor.withValues(alpha: 0.8), width: 2), // Colored border
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.5),
              blurRadius: 5,
              offset: const Offset(0, 3),
            )
          ],
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              text,
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 14,
              ),
            ),
            const SizedBox(width: 5),
            // Placeholder for the gem/currency icon (using a filled hexagon)
            Icon(Icons.hexagon, color: gemColor, size: 16),
          ],
        ),
      ),
    );
  }

  // Method to build the main Summon Card with all floating elements 
  Widget _buildInfoCard(BuildContext context) {
    // We use a Stack to float the x1/x10 buttons relative to the main card container.
    return Stack(
      clipBehavior: Clip.none, // Essential to allow the buttons to float outside the Stack's bounds
      children: [
        // 1. The main card content, wrapped in its original horizontal Padding
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF1A1A1A),
              borderRadius: BorderRadius.circular(30),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.4),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                )
              ],
            ),
            child: Column(
              children: [
                SizedBox(
                  height: 140,
                  child: ScrollShadow(
                    color: const Color(0xFF1A1A1A),
                    child: SingleChildScrollView(
                      child: Text(
                        "The heroes of Old Greece were blahblahblah blah blah blah "
                        "blah blahblahblah blah blahblahblah blah blahblahblah "
                        "blah blahblahblah blah blahblahblah blah blahblahblah "
                        "blah blahblahblah blah blahblahblah blah blahblahblah "
                        "blah blahblahblah blah blahblahblah...blahblahblah blah blah blah "
                        "blah blahblahblah blah blahblahblah blah blahblahblah "
                        "blah blahblahblah blah blahblahblah blah blahblahblah "
                        "blah blahblahblah blah blahblahblah blah blahblahblah "
                        "blah blahblahblah blah blahblahblah...",
                        style: const TextStyle(
                          color: Colors.white,
                          height: 1.3,
                        ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 5),

                /// DROP RATES BUTTON
                ElevatedButton(
                  onPressed: () {
                    showDialog(
                      context: context,
                      builder: (context) {
                        return AlertDialog(
                          backgroundColor: const Color(0xFF1A1A1A),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(20),
                          ),
                          title: const Text(
                            "Drop Rates",
                            style: TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          // ---- COLORED DROP RATES TEXT ----
                          content: Column(
                            mainAxisSize: MainAxisSize.min,
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: const [
                              Text.rich(
                                TextSpan(
                                  children: [
                                    TextSpan(text: "85% ", style: TextStyle(color: Colors.white)),
                                    TextSpan(text: "common", style: TextStyle(color: Colors.white)),
                                  ],
                                ),
                              ),
                              SizedBox(height: 4),
                              Text.rich(
                                TextSpan(
                                  children: [
                                    TextSpan(text: "10% ", style: TextStyle(color: Colors.white)),
                                    TextSpan(text: "rare", style: TextStyle(color: Colors.blue)),
                                  ],
                                ),
                              ),
                              SizedBox(height: 4),
                              Text.rich(
                                TextSpan(
                                  children: [
                                    TextSpan(text: "4% ", style: TextStyle(color: Colors.white),),
                                    TextSpan(text: "  epic", style: TextStyle(color: Colors.purple)),
                                  ],
                                ),
                              ),
                              SizedBox(height: 4),
                              Text.rich(
                                TextSpan(
                                  children: [
                                    TextSpan(text: "1% ", style: TextStyle(color: Colors.white)),
                                    TextSpan(text: "  legendary", style: TextStyle(color: Colors.orange)),
                                  ],
                                ),
                              ),
                            ],
                          ),
                          actions: [
                            TextButton(
                              onPressed: () => Navigator.pop(context),
                              child: const Text(
                                "CONFIRM",
                                style: TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            )
                          ],
                        );
                      },
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: Colors.black,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(18),
                    ),
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 10,
                    ),
                  ),
                  child: const Text(
                    "DROP RATES",
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
          ),
        ),

        // 2. The x1 and x10 buttons positioned at the top right of the card
        Positioned(
          right: 20,
          top: -22, 
          child: Row(
            children: [
              _buildSummonButton(
                text: "x1",
                gemColor: Colors.purple.shade300,
                onTap: () => print("x1 Summon Tapped"),
              ),
              const SizedBox(width: 8),
              _buildSummonButton(
                text: "x10",
                gemColor: Colors.orange.shade300,
                onTap: () => print("x10 Summon Tapped"),
              ),
            ],
          ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.amber, // Simple flat background
      body: Column(
        children: [
          const SizedBox(height: 20),

          /// ---------------- TITLE ----------------
          Column(
            children: const [
              Text(
                "OLD HEROES OF",
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                  shadows: [
                    Shadow(
                      color: Colors.black45,
                      offset: Offset(1, 1),
                      blurRadius: 4,
                    ),
                  ],
                ),
              ),
              Text(
                "GREECE",
                style: TextStyle(
                  fontSize: 28,
                  letterSpacing: 2,
                  fontWeight: FontWeight.w700,
                  color: Colors.white,
                  shadows: [
                    Shadow(
                      color: Colors.black45,
                      offset: Offset(1, 1),
                      blurRadius: 4,
                    ),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: 20),

          /// ------------ HERO IMAGE PLACEHOLDER -------------
          Expanded(
            child: Center(
              child: Container(
                width: 260,
                height: 420,
              ),
            ),
          ),

          /// ---------------- CARD + DROP RATES BUTTON + x1/x10 BUTTONS ----------------
          _buildInfoCard(context),

          const SizedBox(height: 10),
        ],
      ),
    );
  }
}