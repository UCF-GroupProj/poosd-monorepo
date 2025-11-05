import { H2Icon } from '@heroicons/react/24/outline';
import Link from 'next/link';

function MyButton({ title }: { title: string }) {
  return (
    <button>{title}</button>
  );
}

async function tryReg(){
  if (JSON.stringify("Pass") != JSON.stringify("Pass2")){
    console.log('Passwords do not match.');
    return;
  }
  try {
    const response = await fetch("http://localhost:8080/login",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        "email": "Email",
        "password": "Pass"
      })
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);

  } catch (error) {
    console.log(error);
  }
}

export default function MyApp() {
  return (
    <div>
      <div className="topBar">
        <div>
         <h1>OLYMPULL</h1>
        </div>
        <div>
          <button>About</button>
          <span className="spacer"></span>
          <button>Support</button>
          <span className="spacer"></span>
          <button>Account</button>
        </div>
      </div>
      <div className="mainBox">
        <h1>Sign Up!</h1>
        <br></br>
        <h2>
          Email
        </h2>
        <input type="text" className="input" id="email" placeholder="Type your email" />
        <h2>
          Username
        </h2>
        <input type="text" className="input" id="UName" placeholder="Type your username" />
        <h2>
          Password
        </h2>
        <input type="password" className="input" id="Pass" placeholder="Type your password" />
        <h2>
          Password
        </h2>
        <input type="password" className="input" id="Pass2" placeholder="Confirm your password" />
        <br></br><br></br>
        <button className="buttons">Register</button>
        <br></br>
        <p>Or <Link href="/login" id="signUp">Login</Link></p>
        </div>
      
    </div>
  );
}
