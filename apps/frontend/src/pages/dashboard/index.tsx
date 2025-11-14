import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';




export default function MyApp() {
  const router = useRouter();
  const [content, setConent] = useState(<p>Loading...</p>);
  const [isActive1, setIsActive1] = useState(false);
  const [isActive2, setIsActive2] = useState(false);
  const [isActive3, setIsActive3] = useState(false);
  const [isActive4, setIsActive4] = useState(false);
  

  useEffect(() => { 
    // DEV BYPASS: ignore loginToken for now
    // const token = localStorage.getItem("loginToken"); // Gets the login token
    // if (!token){
    //   router.push('/login'); // If no token, push to the login page.
    // }

    updateCont1();  // just load the first tab
  }, []);



  // Everything within these updateCont functions follows a similar pattern. You can write whatever HTML you'd like in these functions within the <> </>.
  const updateCont1 = () => {
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
          <input
            type="email"
            className="profile-input"
            value="loading@email.com" //placeholder
            readOnly
          />
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
      </section>
    </div>


    </>
  );
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
            <li><button onClick={logout}></button></li>
          </ul>
        </div>
        <div className='dashboard-content'>
          {content}
        </div>
      </div>
    </div>
  );
}
