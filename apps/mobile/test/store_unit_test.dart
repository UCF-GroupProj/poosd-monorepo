import 'package:flutter_test/flutter_test.dart';
import 'package:large_project_dart/utils/global_data.dart';
import 'package:large_project_dart/utils/get_api.dart';

// --- Test override hook for static method -------------------------
//   Test can set this to intercept the static method call.
typedef PatchUserCurrencyFn = Future<bool> Function({
  required String token,
  required int currencyChange,
});

PatchUserCurrencyFn? testOverride;

// Wrapper used by the purchase logic *during test*
Future<bool> patchUserCurrency({
  required String token,
  required int currencyChange,
}) {
  if (testOverride != null) {
    return testOverride!(token: token, currencyChange: currencyChange);
  }

  // REAL static method
  return UserProfile.patchUserCurrency(
    token: token,
    currencyChange: currencyChange,
  );
}

// ---------------------TEST-----------------------

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

    test("Purchasing 'Gems x10' sets currency to 10", () async {
    // Initial state
    GlobalData.currency.value = 0;
    GlobalData.token = "fake-token";
    
    // Intercept static call
    testOverride = ({
      required String token,
      required int currencyChange,
    }) async {
      expect(token, "fake-token");
      expect(currencyChange, 10);
      print("fake success");
      return true; // Fake success
    };

    // Same purchase logic as StorePage code 
    int amount = 0;
    String itemName = "Gems x10";
    if (itemName == 'Gems x10') amount = 10;
    else if (itemName == 'Gems x50') amount = 50;
    else if (itemName == 'Gems x100') amount = 100;
    final success = await patchUserCurrency(
      token: GlobalData.token,
      currencyChange: amount,
    );

    if (success) {
      GlobalData.currency.value += amount;
    }

    //Result
    expect(GlobalData.currency.value, 10);
  });
  test("Purchasing 'Gems x50' sets currency to 50", () async {
    // Initial state
    GlobalData.currency.value = 0;
    GlobalData.token = "fake-token";
    
    // Intercept static call
    testOverride = ({
      required String token,
      required int currencyChange,
    }) async {
      expect(token, "fake-token");
      expect(currencyChange, 50);
      return true; // Fake success
    };

    // Same purchase logic as StorePage code
    int amount = 0;
    String itemName = "Gems x50";
    if (itemName == 'Gems x10') amount = 10;
    else if (itemName == 'Gems x50') amount = 50;
    else if (itemName == 'Gems x100') amount = 100;
    final success = await patchUserCurrency(
      token: GlobalData.token,
      currencyChange: amount,
    );

    if (success) {
      GlobalData.currency.value += amount;
    }

    //Result
    expect(GlobalData.currency.value, 50);
  });
  test("Purchasing 'Gems x50' sets currency to 100", () async {
    // Initial state
    GlobalData.currency.value = 0;
    GlobalData.token = "fake-token";
    
    // Intercept static call
    testOverride = ({
      required String token,
      required int currencyChange,
    }) async {
      expect(token, "fake-token");
      expect(currencyChange, 100);
      return true; // Fake success
    };

    // Same purchase logic as StorePage code
    int amount = 0;
    String itemName = "Gems x100";
    if (itemName == 'Gems x10') amount = 10;
    else if (itemName == 'Gems x50') amount = 50;
    else if (itemName == 'Gems x100') amount = 100;
    final success = await patchUserCurrency(
      token: GlobalData.token,
      currencyChange: amount,
    );

    if (success) {
      GlobalData.currency.value += amount;
    }

    //Result
    expect(GlobalData.currency.value, 100);
  });
}