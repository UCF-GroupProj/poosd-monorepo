'use client'

import Link from 'next/link'; 
import { useRouter } from 'next/router'; // Used for automatic navigation
import React, { useState } from 'react';



export default function MyApp() {
  const router = useRouter();
  const [outputContent, setOutputText] = useState(<span></span>);
  
  
    const tryRegister = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget); // Gets the input data from the user
      if (formData.get('Pass') as string != formData.get('Pass2') as string){ // Checks if the passwords match
        throw new Error('Passwords do not match');
      }

      const response = await fetch("http://localhost:8080/register",{ // Passes the registration information to the API
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          "email": formData.get('Email') as string,
          "password": formData.get('Pass') as string
        })
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      
      console.log(response);
      const bodyText = await response.text();
      setOutputText(
      <><h3>{bodyText}</h3><p>Be sure to check your spam filters.</p></>
    );
      localStorage.setItem("verifyToken", formData.get('Email') as string); // Sets a token tracking the email that needs to be verified. Might be depreciated.
  
    } catch (error) {
      console.log(error);
      let bodyText = "Unknown Error Occurred";
    if (error instanceof Error){
      if (error.message == "Response status: 400"){
        bodyText = "Missing required field(s).";
      } else if (error.message == "Response status: 409"){
        bodyText = "This account already exists.";
      } else if (error.message == "Response status: 500") {
        bodyText = "A server error occurred, please try again later.";
      } else if (error.message == "Passwords do not match"){
        bodyText = "Ensure your password is spelled correctly on both inputs!";
      }
    }
     
    setOutputText(
      <h3>{bodyText}</h3>
    );
    }
  }

  return (
    <div>
      <div className="topBar">
        <ul className="navBar">
          <li id="navTitle"><h1>OLYMPULL</h1></li>
          <li><a href="/dashboard">Account</a></li>
          <li><a href="/support">Support</a></li>
          <li><a href="/about">About</a></li>
        </ul>
      </div>
      <div className="mainBox">
        <h1>Sign Up!</h1>
        <br></br>
        <form onSubmit={tryRegister}>
        <h2>
          Email
        </h2>
        <input type="email" className="input" name="Email" placeholder="Type your email" />
        <h2>
          Password
        </h2>
        <input type="password" className="input" name="Pass" placeholder="Type your password" />
        <h2>
          Password
        </h2>
        <input type="password" className="input" name="Pass2" placeholder="Confirm your password" />
        <br></br><br></br>
        <button type='submit' className="buttons">Register</button>
        <br></br><br></br>
        <p>Or <Link href="/login" id="ulText">Login</Link></p>
        </form>
        <div>
          {outputContent}
        </div>
        </div>
    </div>
  );
}
