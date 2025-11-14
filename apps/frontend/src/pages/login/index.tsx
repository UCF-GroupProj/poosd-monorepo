
import Link from 'next/link';
import { useRouter } from 'next/router'; // Used for automatic routing
import React, { useEffect, useState } from 'react'; // Used to call a function immediately, in this case reading login tokens for user convenience.



export default function MyApp() {
  const router = useRouter();
  const [outputContent, setOutputText] = useState(<span></span>);

  useEffect(() => { // Reads the login token to see if it exists
    const token = localStorage.getItem("loginToken");
    if (token){
      router.push('/dashboard'); // If it does, push them to the dashboard to save them time
    }
    }, []);

  const tryLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  try {
    const formData = new FormData(event.currentTarget); // Gets the input information
    const response = await fetch("http://localhost:8080/login",{ // Passes login info to the API
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

    const newToken = await response.text();

    console.log(response);
    localStorage.setItem("loginToken", newToken); // Sets the login token
    router.push('/dashboard'); // Pushes the user to the dashboard on login

  } catch (error) {
    console.log(error);
    let bodyText = "Unknown Error Occurred";
    if (error instanceof Error){
      if (error.message == "Response status: 400"){
        bodyText = "Missing required field(s).";
      } else if (error.message == "Response status: 403"){
        bodyText = "This account is not enabled. Please verify your email to unlock this account.";
      } else if (error.message == "Response status: 500") {
        bodyText = "A server error occurred, please try again later.";
      } else if (error.message == "Response status: 401"){
        bodyText = "Invalid email or password."
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
      <h1>Welcome, Traveler!</h1>
      <br></br>
      <form onSubmit={tryLogin}>
      <h2>
        Email
      </h2>
      <input type="email" className="input" name="Email" placeholder="Type your email" />
      <h2>
        Password
      </h2>
      <input type="password" className="input" name="Pass" placeholder="Type your password" />
      <br></br><br></br>
      <button className="buttons" type='submit'>Login</button><br></br><br></br>
      <p>Or <Link href="/register" id="ulText">Sign Up!</Link></p>
      </form>
      <div>
        {outputContent}
      </div>
      </div>
    </div>
  );
}
