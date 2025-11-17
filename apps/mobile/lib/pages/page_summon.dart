import 'package:flutter/material.dart';
import 'package:flutter_scroll_shadow/flutter_scroll_shadow.dart';
import 'package:large_project_dart/utils/global_data.dart';
import 'package:large_project_dart/utils/get_api.dart';


class SummonPage extends StatefulWidget {
  const SummonPage({super.key});

  @override
  State<SummonPage> createState() => _SummonPageState();
}

class _SummonPageState extends State<SummonPage> {

  void _showSummonResult(BuildContext context, List<CardModel> pulledCards, int dupcredits, int rollcount){
    showDialog(
      context: context,
      builder: (BuildContext dialogContext) {
        final isNewCard = pulledCards.isNotEmpty;

        /* final pulledCount = result.collections.length;
        final uniqueMessage = pulledCount > 0  ? 'Congratulations! You pulled $pulledCount new card(s).' : 'Roll complete. No new unique cards';
        final refundMessage = result.dupCredits > 0 ? 'You received ${result.dupCredits} gem(s) back as duplicate credit.' : ''; */

        /* return AlertDialog(
          title: const Text("Summon Results"),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(uniqueMessage, style: const TextStyle(fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                if (result.dupCredits > 0) Text(refundMessage),
                const SizedBox(height: 12),
                const Text("Pulled Card IDs:", style: TextStyle(decoration: TextDecoration.underline)),
                // Display the IDs of all pulled cards (new and duplicates)
                ...result.collections.map((id) => Text('- ID: $id')).toList(),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(dialogContext).pop(),
              child: const Text("Close"),
            ),
          ],
        ); */

        return Dialog(
          backgroundColor: Colors.transparent,
          insetPadding: const EdgeInsets.all(16),
          child: Container(
            decoration: BoxDecoration(
              color: const Color.fromARGB(255, 26, 26, 26),
              borderRadius: BorderRadius.circular(15),
              border: Border.all(color: Colors.amber, width: 2),
            ),
            padding: const EdgeInsets.all(20),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(isNewCard ? 'New Card Summoned!' : '', style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)),
                const Divider(color: Colors.white24),
                if(dupcredits > 0)
                  Text('Refunded $dupcredits Gems (from duplicates)', style: const TextStyle(color: Colors.green, fontSize: 16)),
                const SizedBox(height: 10),

                SizedBox(
                  height: isNewCard ? 300 : 100,
                  child: ListView.builder(
                    itemCount: pulledCards.length,
                    itemBuilder: (context, index){final card = pulledCards[index]; return _buildPulledCardItem(context, card);},
                  )
                ),

                if(!isNewCard)
                  const Padding(
                    padding: EdgeInsets.symmetric(vertical: 20),
                    child: Text('No New Cards', style: TextStyle(color: Colors.white70))
                  ),

                const SizedBox(height: 15),
                ElevatedButton(
                  onPressed: () => Navigator.pop(dialogContext),
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.amber),
                  child: const Text('Continue')
                )
              ],
            )
          )
        );
      },
    );
  }

  void _showInsufficientFunds(int requiredGems) {
    ScaffoldMessenger.of(context).hideCurrentSnackBar();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Insufficient gems! You need $requiredGems gem(s) for this summon.'),
        backgroundColor: Colors.red,
        duration: const Duration(seconds: 2),
      ),
    );
  }

  Widget _buildPulledCardItem(BuildContext context, CardModel card){
    Color rarityColor;
    switch (card.rarity.toLowerCase()) {
      case 'common':
        rarityColor = Colors.green;
        break;
      case 'rare':
        rarityColor = Colors.blue;
        break;
      case 'epic':
        rarityColor = Colors.purple;
        break;
      case 'legendary':
        rarityColor = Colors.orange;
        break;
      default:
        rarityColor = Colors.white;
    }

    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: Container(
        padding: const EdgeInsets.all(8.0),
        decoration: BoxDecoration(
          color: Colors.black45,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: rarityColor, width: 1.5),
        ),
        child: Row(
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: Image.network(card.imageUrl, width: 50, height: 50, fit: BoxFit.cover),
            ),
            const SizedBox(width: 10),
            
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(card.name, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                  Text(card.rarity.toUpperCase(), style: TextStyle( color: rarityColor, fontSize: 12, fontWeight: FontWeight.w600)),
                ],
              ),
            ),
            // Short Description/Flavor Text (You can add this if needed)
            // Text(card.description, style: TextStyle(color: Colors.white54)), 
          ],
        ),
      ),
    );
  }
  
  List<CardModel> _lastPulledCards = [];

  Future<void> _handleSummon(int count) async{
    final context = this.context;
    _lastPulledCards.clear();

    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Summong x$count')));

    try{
      final result = await CardAPI.rollCards(token: GlobalData.token, count: count);

      ScaffoldMessenger.of(context).hideCurrentSnackBar();

      if(result != null){
        final fetchFutures = result.collections.map((cardId) {return CardAPI.getCardDetails(token: GlobalData.token, cardID: cardId);}).toList();
        final fetchedCards = await Future.wait(fetchFutures);
        _lastPulledCards = fetchedCards.whereType<CardModel>().toList();

        final int currencyChange = result.dupCredits - count;
        GlobalData.currency.value += currencyChange;
        _showSummonResult(context, _lastPulledCards, result.dupCredits, count);
      }
    } catch(e){
      ScaffoldMessenger.of(context).hideCurrentSnackBar();
      final message = e.toString().contains("Insufficient gems") ? "Not enough gems for this pull!" : "Summon failed: ${e.toString().split(':').last.trim()}";
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message), backgroundColor: Colors.red,));
    }
  }
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
            Icon(Icons.diamond, color: gemColor, size: 16),
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
                      child: Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: Text(
                          "From the high thrones of myth and the far reaches of legend, these ancient powers stir once more. Their footsteps echo across the ages… and now, they answer your call.",
                          style: const TextStyle(color: Colors.white, height: 1.3, fontSize: 18),
                          textAlign: TextAlign.center,
                        ),
                      ),
                    ),
                  ),
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

        // 2. The x1 and x10 buttons positioned at the top right of the card
        Positioned(
          right: 20,
          top: -22, 
          child: Row(
            children: [
              _buildSummonButton(
                text: "x1",
                gemColor: Colors.purple.shade300,
                onTap: () {
                  if(GlobalData.currency.value < 1){
                    _showInsufficientFunds(1);
                  } else{
                    _handleSummon(1);
                  }
                },
              ),
              const SizedBox(width: 8),
              _buildSummonButton(
                text: "x10",
                gemColor: Colors.orange.shade300,
                onTap: () {
                  if(GlobalData.currency.value < 10){
                    _showInsufficientFunds(10);
                  } else{
                    _handleSummon(10);
                  }
                }
              ),
            ],
          ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Scaffold(
          backgroundColor: Colors.amber,
          body: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 10.0),
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
                    
                const SizedBox(height: 10),
                    
                /// ------------ HERO IMAGE PLACEHOLDER -------------
                Expanded(
                  child: Center(
                    child: Padding(
                      padding: const EdgeInsets.only(bottom: 30),
                      child: Container(
                        width: 260,
                        height: 400,
                        //decoration: BoxDecoration(color: Colors.white),
                      ),
                    ),
                  ),
                ),
                    
                /// ---------------- CARD + DROP RATES BUTTON + x1/x10 BUTTONS ----------------
                _buildInfoCard(context),
                    
                const SizedBox(height: 10),
              ],
            ),
          ),
        ),
      ]
    );
  }
}