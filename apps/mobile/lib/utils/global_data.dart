class GlobalData{ //TODO 
  static int userId = -1;
  static String token = '';
  static int currency = 0;

  // Used by Collections

    // Card Data
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
    
    // Images Data
      static List<String> cardImages = List.generate(20, (index) => 'images/taco.png');
      static List<bool> isOwned = List.generate(20, (index) => false);
      static List<String> favoritesList = List.generate(3, (index) => 'images/taco.png');
}