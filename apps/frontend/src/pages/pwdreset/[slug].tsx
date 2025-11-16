'use client';

import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';


export default function MyApp() {
  const router = useRouter();
  let slug: string | string[] | undefined;
  const checked = useRef(false);
  const [outputContent, setOutputText] = useState(<h2>Please wait...</h2>);
  

  useEffect(() => {
    
      if (router.isReady && !checked.current) {
        slug = router.query.slug;
        checkReset(slug);
        checked.current = true;
      }
    
    }, [router.isReady]);

    const checkReset = async (code: string | string[] | undefined) => {
      try {
        const response = await fetch(`http://localhost:8080/pwdreset/${code}`,{ 
        method:"GET",
        headers:{"Content-Type":"application/json"}
      });

      if (!response.ok){
        throw new Error(`Response status: ${response.status}`);
      }
      else {
        setOutputText(<>
        <form onSubmit={doReset}>
          <h2>Enter your new password here</h2>
          <input type="password" className="input" name="newPass1" placeholder="Type your password" />
          <input type="password" className="input" name="newPass2" placeholder="Confirm your password" />
          <button type='submit' className="buttons">Complete Password Reset</button>
          </form>
        </>);
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
        setOutputText(<><h2>You cannot reset your password with this code.</h2><p>Reason: {bodyText}</p></>);
      }
    }
  }

  const doReset = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
   
    try {
       if (formData.get('newPass1') as string != formData.get('newPass2') as string){
        throw new Error('Passwords do not match');
      }

      const response = await fetch(`http://localhost:8080/pwdreset/${router.query.slug}`,{ 
        method:"PATCH",
       headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
        "newPassword": formData.get('newPass1') as string
      })
    });

    if (!response.ok){
      throw new Error(`Response status: ${response.status}`);
    }
    setOutputText(<>
        <form onSubmit={doReset}>
          <h2>Your password had been reset. You will be redirected shortly.</h2>
          </form>
        </>);

    } catch (error){
      console.log(error);
        setOutputText(<>
        <form onSubmit={doReset}>
          <h2>Your password failed to be reset. Please try again.</h2>
          </form>
        </>);
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
