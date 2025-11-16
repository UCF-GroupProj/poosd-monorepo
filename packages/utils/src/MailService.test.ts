/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { MailService, MailServiceExcept } from "./MailService";

describe('Test Constructor', ()=> {
  test("Default BaseURL", ()=> {
    const main = new MailService("SAMPLE_KEY");
    expect(main.apiKey).toBe("SAMPLE_KEY");
    expect(main.baseUrl).toBe("https://api.mail.zhiyan114.com");
  });

  test("Different BASE_URL format", ()=> {
    expect(new MailService("SAMPLE_KEY", "https://api.example.com").baseUrl).toBe("https://api.example.com");
    expect(new MailService("SAMPLE_KEY", "https://api.example.com/").baseUrl).toBe("https://api.example.com");
  });
});


describe("SendMail Behavior", ()=> {
  test("Validate Email Regex", ()=> {
    const main = new MailService("SAMPLE_KEY");
    expect(main.validateEmail("the.real@example.com")).toBe(true);
    expect(main.validateEmail("thereal@example-boo.com")).toBe(true);
    expect(main.validateEmail("the.real@example.boo.com")).toBe(true);
    expect(main.validateEmail("the-real@example-boo.com")).toBe(true);
    expect(main.validateEmail("the.real-main@example-boo.hosted.com")).toBe(true);
    expect(main.validateEmail("Bad$&Email@example.com")).toBe(false);
    expect(main.validateEmail("example.com")).toBe(false);
    expect(main.validateEmail("@example.com")).toBe(false);
    expect(main.validateEmail("good@bad!!Example.com")).toBe(false);
    expect(main.validateEmail("ThisTechnically@isAllowedButNotInRealWorld")).toBe(false);
  });

  test("Bad sendMail Options", ()=> {
    const main = new MailService("SAMPLE_KEY");
    jest.spyOn(main, "transport").mockImplementation(async ()=>({ status: 400, text: async()=>"Mocked Response" }));

    expect(async ()=> await main.sendMail({ from: "root@example.com", to: "root@example.com", subject: "MOCK" }))
      .rejects.toThrow(new MailServiceExcept("sendMail missing both text and html"));
    expect(async ()=> await main.sendMail({ from: "root@example.com", to: "root@example.com", subject: "MOCK", html: "<p>OK</p>", text: "OK" }))
      .rejects.toThrow(new MailServiceExcept("sendMail contains both text and html value, only one of them is allowed!"));

    expect(async ()=> await main.sendMail({ from: "@example.com", to: "root@example.com", subject: "MOCK", text: "OK" }))
      .rejects.toThrow(new MailServiceExcept("'from' field failed validation"));

    expect(async ()=> await main.sendMail({ from: "root@example.com", to: "@example.com", subject: "MOCK", text: "OK" }))
      .rejects.toThrow(new MailServiceExcept("one of the (only) 'to' field failed validation"));
    expect(async ()=> await main.sendMail({ from: "root@example.com", to: ["ValidAddr@example.com", "@example.com"], subject: "MOCK", text: "OK" }))
      .rejects.toThrow(new MailServiceExcept("one of the (only) 'to' field failed validation"));

    expect(async ()=> await main.sendMail({ from: "main@example.com", to: "root@example.com", subject: "MOCK", text: "OK", replyto: "bad@address" }))
      .rejects.toThrow(new MailServiceExcept("one of the (only) 'replyTo' field failed validation"));
    expect(async ()=> await main.sendMail({ from: "main@example.com", to: "root@example.com", subject: "MOCK", text: "OK", replyto: ["bad@address", "good@address.local"] }))
      .rejects.toThrow(new MailServiceExcept("one of the (only) 'replyTo' field failed validation"));
  });

  test("Mail Successfully Sent", async ()=> {
    const main = new MailService("SAMPLE_KEY");
    const jsonMockData = { success: true, reqID: "ID", message: "MOCK MESSAGE" };
    const requestData = {
      from: "root@example.com",
      to: "employee@example.com",
      subject: "COMPANY ALERT",
      text: "Please See HR to process your exit interview"
    };

    const mockText = jest.fn(async()=> "Mock Text");
    const mockJson = jest.fn(async()=> jsonMockData);
    const mockTrans = jest.spyOn(main, "transport").mockImplementation(async ()=>({ status: 200, text: mockText, json: mockJson }));

    expect(await main.sendMail(requestData)).toMatchObject(jsonMockData);
    expect(mockText).toHaveBeenCalledTimes(0);
    expect(mockJson).toHaveBeenCalledTimes(1);
    expect(mockTrans).toHaveBeenCalledTimes(1);
    expect(mockTrans).toHaveBeenCalledWith("/requests", "POST", JSON.stringify(requestData));
  });

  test("Mail with non-200 status response", async()=> {
    const main = new MailService("SAMPLE_KEY");
    const jsonMockData = { success: true, reqID: "ID", message: "MOCK MESSAGE" };
    const requestData = {
      from: "root@example.com",
      to: "employee@example.com",
      subject: "COMPANY ALERT",
      text: "Please See HR to process your exit interview"
    };

    const mockText = jest.fn(async()=> "Mock Text");
    const mockJson = jest.fn(async()=> jsonMockData);
    const mockTrans = jest.spyOn(main, "transport").mockImplementation(async ()=>({ status: 400, text: mockText, json: mockJson }));

    expect(await main.sendMail(requestData)).toBe("Mock Text");
    expect(mockText).toHaveBeenCalledTimes(1);
    expect(mockJson).toHaveBeenCalledTimes(0);
    expect(mockTrans).toHaveBeenCalledTimes(1);
    expect(mockTrans).toHaveBeenCalledWith("/requests", "POST", JSON.stringify(requestData));
  });

});