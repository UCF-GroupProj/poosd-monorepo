import { useRouter } from 'next/router';
import React, { useEffect } from 'react';


async function checkCookie() {
  if (false){
    return false;
  }
  return true;
}

export default function MyApp() {
  const router = useRouter();
  
  useEffect(() => {
    if (!checkCookie()){
      router.push('/login');
    }
  }, []);
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
      <div className="mainBox" id="dashboardCont">
        <div className="side">
        <ul className='dash'>
        <li><button className="activeDB" id="button1">Profile</button></li>
        <li><button>Collection</button></li>
        <li><button>Payment Methods</button></li>
        <li><button>Transaction History</button></li>
      </ul>
        </div>
      <div>
        <p>Nothing here yet. Check again soon!</p>
      </div>
      </div>
    </div>
  );
}
