
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { JWTManager, JWTError } from './JTWManager';

describe('Test JWT Key', ()=> {
  // Retain ENV Variable State
  const OLD_ENV = process.env;
  beforeEach(() => {
    process.env = { ...OLD_ENV };
  });
  afterAll(() => {
    process.env = OLD_ENV;
  });

  test("No Key Expect Error", ()=> {
    expect(()=> new JWTManager()).toThrow(new JWTError("Missing JTW signing key ENVIRONMENT 'JWT_KEY' or construction param."));
  });

  test("Expect ENV Key", ()=> {
    process.env["JWT_KEY"] = "THIS_IS_A_THROWAWAY_KEY";
    expect(new JWTManager().signKey).toBe("THIS_IS_A_THROWAWAY_KEY");
  });

  test("Expect ENV key to override param Key", ()=> {
    process.env["JWT_KEY"] = "THIS_IS_A_THROWAWAY_KEY_GOOD";
    expect(new JWTManager("THIS_IS_A_THROWAWAY_KEY_BAD").signKey).toBe("THIS_IS_A_THROWAWAY_KEY_GOOD");
  });
});

describe("Data Signing/Verifying", ()=> {
  test("User Data Matching", ()=> {
    const encoder = new JWTManager("SHARED_KEY");
    const decoder = new JWTManager("SHARED_KEY");
    const originalData = {
      id: "DEADBEEFCAFE",
      email: "root@example.com"
    };

    const JWTKey = encoder.signUserKey(originalData);
    expect(decoder.verifyUserKey(JWTKey)).toMatchObject(originalData);
    expect(decoder.decodeUserKey(JWTKey)).toMatchObject(originalData);

  });

  test("Mismatched Signing Key", ()=> {
    const encoder = new JWTManager("ENCODE_KEY");
    const decoder = new JWTManager("DECODE_KEY");
    const originalData = {
      id: "DEADBEEFCAFE",
      email: "root@example.com"
    };

    const JWTKey = encoder.signUserKey(originalData);
    expect(()=> decoder.verifyUserKey(JWTKey)).toThrow("invalid signature");
    expect(decoder.decodeUserKey(JWTKey)).toMatchObject(originalData);
  });
});