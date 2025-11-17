class GlobalData{ //TODO 
// User Info
  static String userId = '';
  static int currency = 0;
  static int gems = 0;
  static String email = '';
  static int exp = 0;
  static DateTime lastPullTime = DateTime.now();
  static int level = 0;
  static String password = '';
  static int pullsSinceEpic = 0;
  static bool verified = false;
  static String token = '';   // Left from before
  
// User Card Info
  static int numCommon = 8;
  static int numRare = 6;
  static int numEpic = 4;
  static int numLegendary = 2;
  static int ownedCommon = 1;
  static int ownedRare = 0;
  static int ownedEpic = 0;
  static int ownedLegendary = 0;
  static int totalCardsOwned = ownedCommon + ownedRare + ownedEpic + ownedLegendary;
  static int totalCards = numCommon + numRare + numEpic + numLegendary;

// Card Data
  static List<CardData> cardsList = [];
    // Images Data
  static List<String> cardImages = [];
//      static List<String> cardImages = List.generate(20, (index) => 'images/taco.png');
      static List<bool> isOwned = List.generate(20, (index) => false);
      static List<String> favoritesList = List.generate(3, (index) => 'images/taco.png');
}

class CardData{
  String name = '';
  String rarity = '';
  String description = '';
  String imageURL = '';
  String cardID = '';

  CardData(this.name, this.rarity, this.description, this.imageURL, this.cardID);
}