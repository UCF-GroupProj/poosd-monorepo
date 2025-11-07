'use client'

import Link from 'next/link';
import { useRouter } from 'next/router';



export default function MyApp() {
  const router = useRouter();

  const tryLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  try {
    const formData = new FormData(event.currentTarget);
    const response = await fetch("http://localhost:8080/login",{
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
    router.push('/dashboard');

  } catch (error) {
    console.log(error);
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
      <p>Or <Link href="/register" id="signUp">Sign Up!</Link></p>
      </form>
      </div>
    </div>
  );
}
