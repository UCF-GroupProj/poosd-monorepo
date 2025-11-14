'use client'

import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';


export default function MyApp() {
  const router = useRouter();
  var token: string | null;
  var slug: string | string[] | undefined;
  const checked = useRef(false);
  const [outputContent, setOutputText] = useState(<h2>Please wait...</h2>);
  

  useEffect(() => {
      token = localStorage.getItem("verifyToken");
    if (token === null || !token){
      router.push('/register');
    } else {
      if (router.isReady && !checked.current) {
        slug = router.query.slug;
        tryVerify(slug);
        checked.current = true;
      }
    }
    }, [router.isReady]);

    const tryVerify = async (code: string | string[] | undefined) => {
      try {
        const response = await fetch(`http://localhost:8080/verifyemail/${code}`,{ 
        method:"PATCH",
        headers:{"Content-Type":"application/json"}
      });

      if (!response.ok){
        throw new Error(`Response status: ${response.status}`);
      }
      else {
        setOutputText(<><h2>Your email was verified!</h2><p>Redirecting...</p></>);

        const returnedItem = await response.text();
        localStorage.removeItem("verifyToken");
        localStorage.setItem("loginToken", returnedItem);
        router.push("/dashboard");
      }
      } catch (error) {
        console.log(error);
        let bodyText = "Unknown Error Occurred";
    if (error instanceof Error){
      if (error.message == "Response status: 404"){
        bodyText = "Provided verification code was not found or expired.";
      } else if (error.message == "Response status: 500") {
        bodyText = "A server error occurred, please try again later.";
      } else if (error.message == "Response status: 503"){
        bodyText = "The database failed to respond.";
      }
        setOutputText(<><h2>Your email failed to be verified.</h2><p>Reason: {bodyText}</p></>);
      }
    }
  }

    
  return (
    <div>
      <div className="topBar">
        <ul className="navBar">
          <li id="navTitle"><h1>OLYMPULL</h1></li>
          <li><a href="/account">Account</a></li>
          <li><a href="/support">Support</a></li>
          <li><a href="/dashboard">About</a></li>
        </ul>
      </div>
      <div className="mainBox">
        {outputContent}
        </div>
    </div>
  );
}
