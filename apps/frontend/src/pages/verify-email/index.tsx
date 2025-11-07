'use client'

import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';


function checkCookie() {

}


export default function MyApp() {
  const router = useRouter();
  
  useEffect(() => {
    checkCookie();
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
      <div className="mainBox">
        
        </div>
    </div>
  );
}
