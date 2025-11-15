import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';




export default function MyApp() {
  const router = useRouter();
  const [content, setConent] = useState(<p>Loading...</p>);
  const [isActive1, setIsActive1] = useState(false);
  const [isActive2, setIsActive2] = useState(false);
  const [isActive3, setIsActive3] = useState(false);
  const [isActive4, setIsActive4] = useState(false);
  var token: string | null;

  useEffect(() => { 
    token = localStorage.getItem("loginToken"); // Gets the login token (this variable is ONLY good for checking the token's existence)
    console.log(token);
     if (!token){
       router.push('/login'); // If no token, push to the login page.
     } else {
      updateCont1();  // just load the first tab
     }

  }, []);



  // Everything within these updateCont functions follows a similar pattern. You can write whatever HTML you'd like in these functions within the <> </>.
  const updateCont1 = async () => {
    console.log(token);
    try {
    const response = await fetch(`http://localhost:8080/profile`,{ 
        method:"GET",
        headers:{'Authorization':`Bearer ${localStorage.getItem("loginToken")}`,
      "Content-Type":"application/json"}
      });

      if (!response.ok){
        throw new Error(`Response status: ${response.status}`)
      }

      const data = await response.json();

      const email = localStorage.getItem("localMail");
      if (!email){
        throw new Error(`Failed to get email`);
      }
      const level = data.level;
      const gems = data.currency.gems;

      console.log(response);

      setConent(
    <>
    {/* outer wrapper for the whole profile tab */}
    <div className="profile-container">
      {/* avatar */}
      <section className="profile-header">
        {/* placeholder circle for profile picture */}
        <div className="profile-avatar">
          { /*later will become an /img based on chosen card */}
        </div>
      </section>
      <section className="profile-fields">
        {/* email row */}
        <div className="profile-field-row">
          <label className="profile-label">Email:</label>
          <input type="email" className="profile-input" value={email} readOnly></input>
        </div>
        
        {/* password row */}
        <div className="profile-field-row">
          <label className="profile-label">Password:</label>
          <div className="profile-password-wrapper">
            <input
              type="password"
              className="profile-input"
              value="********"
              readOnly
            />

            {/* eye icon placeholder */}
            <span className="profile-eye">👁️</span>
          </div>
        </div>
        <div>
            <span>Gems: {gems}</span><br></br>
            <span>Level: {level}</span><br></br>
          </div>
      </section>
    </div>


    </>
  );
    } catch (error) {
      console.log(error);
      setConent(
        <h2>A critical error occurred</h2>
      );
    }
    
    
    setIsActive1(true);
    setIsActive2(false);
    setIsActive3(false);
    setIsActive4(false);
  }

  const updateCont2 = () => {
    setConent(
    <>
    <p>This is a Test 2</p>
    </>
  );
    setIsActive1(false);
    setIsActive2(true);
    setIsActive3(false);
    setIsActive4(false);
  }

  const updateCont3 = () => {
    setConent(
    <>
    <p>This is a Test 3</p>
    </>
  );
    setIsActive1(false);
    setIsActive2(false);
    setIsActive3(true);
    setIsActive4(false);
  }

  const updateCont4 = () => {
    setConent(
      <>
      <p>
        This is a Test 4
      </p>
      </>
    );
    setIsActive1(false);
    setIsActive2(false);
    setIsActive3(false);
    setIsActive4(true);
  }

  const logout = () => {
    localStorage.removeItem("loginToken");
    router.push("/login");
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
      <div className="mainBox" id="dashboardCont">
        <div className="side">
          <ul className='dash'>
            <li><button className={`base-class ${isActive1 ? "activeDB" : ""}`} id="button1" onClick={updateCont1}>Profile</button></li>
            <li><button className={`base-class ${isActive2 ? "activeDB" : ""}`} id="button2" onClick={updateCont2}>Collection</button></li>
            <li><button className={`base-class ${isActive3 ? "activeDB" : ""}`} id="button3" onClick={updateCont3}>Account Settings</button></li>
            <li><button className={`base-class ${isActive4 ? "activeDB" : ""}`} id="button4" onClick={updateCont4}>Transaction History</button></li>
            <li><button onClick={logout}>Log Out</button></li>
          </ul>
        </div>
        <div className='dashboard-content'>
          {content}
        </div>
      </div>
    </div>
  );
}
