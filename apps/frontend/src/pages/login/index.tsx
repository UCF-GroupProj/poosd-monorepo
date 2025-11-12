
import Link from 'next/link';
import { useRouter } from 'next/router'; // Used for automatic routing
import React, { useEffect } from 'react'; // Used to call a function immediately, in this case reading login tokens for user convenience.



export default function MyApp() {
  const router = useRouter();

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

    console.log(response);
    localStorage.setItem("loginToken", formData.get('Email') as string); // Sets the login token
    router.push('/dashboard'); // Pushes the user to the dashboard on login

  } catch (error) {
    console.log(error);
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
      </div>
    </div>
  );
}
