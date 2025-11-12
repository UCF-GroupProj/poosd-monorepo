'use client'

import { useRouter } from 'next/router';
import React, { useEffect } from 'react';


async function tryVerify() {

}

async function resendCode(email: any){
  if (email === null){
    console.log("Cannot send to null email");
    return;
  }
  try {
  const response = await fetch("http://localhost:8080/verifyemail",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  } catch (error){
    console.log(error);
  }
  
}



export default function MyApp() {
  const router = useRouter();
  var token: string | null;
  useEffect(() => {
      token = localStorage.getItem("verifyToken");
    if (token === null || !token){
      router.push('/register');
    }
    }, []);

    const pushToResend = async() => {
      resendCode(token);
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
        <h2>Please wait...</h2>
        <form onSubmit={tryVerify}>
          <p>Didn't receive a code? <span id="ulText" onClick={pushToResend}>Click here to send another email</span></p>
        </form>
        </div>
    </div>
  );
}
