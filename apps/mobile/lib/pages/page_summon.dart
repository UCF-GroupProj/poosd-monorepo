import 'package:flutter/material.dart';
import 'package:flutter_scroll_shadow/flutter_scroll_shadow.dart';

void main() {
  runApp(const SummonPage());
}

class SummonPage extends StatelessWidget {
  const SummonPage({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: const _SumonsPageState(),
    );
  }
}

class _SumonsPageState extends StatelessWidget {
  const _SumonsPageState({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.amber, // Simple flat background
      body: SafeArea(
        child: Column(
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
                  decoration: BoxDecoration(
                    color: Colors.black.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: const Center(
                    child: Text(
                      "HERO IMAGE",
                      style: TextStyle(
                        fontSize: 20,
                        color: Colors.white70,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
              ),
            ),

            /// ---------------- CARD + DROP RATES BUTTON ----------------
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFF1A1A1A),
                  borderRadius: BorderRadius.circular(30),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.4),
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
                        color: Color(0xFF1A1A1A),
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
                      ) 
                    ),
                    const SizedBox(height: 5),

                    /// DROP RATES BUTTON
                    ElevatedButton(
                      onPressed: () {},
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
            const SizedBox(height: 10),
          ],
        ),
      ),
    );
  }
}
