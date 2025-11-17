import React, { useState } from 'react';
import Link from 'next/link';

export default function PasswordResetRequestPage() {
  const [outputContent, setOutputText] = useState(<span></span>);

  const requestReset = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const formData = new FormData(event.currentTarget);
      const email = formData.get('Email') as string;

      const response = await fetch('https://api.poosd.zhiyan114.com/pwdreset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const text = await response.text(); // backend returns plain text

      setOutputText(
        <h3>
          {text ||
            "Verification email has been sent, if there's an account associated with this email."}
        </h3>
      );
    } catch (error) {
      console.log(error);
      let bodyText = 'Unknown Error Occurred';

      if (error instanceof Error) {
        if (error.message === 'Response status: 400') {
          bodyText = 'Missing email field.';
        } else if (error.message === 'Response status: 503') {
          bodyText = 'Email service unavailable, please try again later.';
        } else if (error.message === 'Response status: 500') {
          bodyText = 'A server error occurred, please try again later.';
        }
      }

      setOutputText(<h3>{bodyText}</h3>);
    }
  };

  return (
    <div>
      <div className="topBar">
        <ul className="navBar">
          <li id="navTitle">
            <h1>OLYMPULL</h1>
          </li>
          <li><Link href="/dashboard">Account</Link></li>
          <li><Link href="/about">About</Link></li>
        </ul>
      </div>

      <div className="mainBox">
        <h1>Password Reset</h1>
        <br />

        <form onSubmit={requestReset}>
          <h2>Email</h2>
          <input
            type="email"
            className="input"
            name="Email"
            placeholder="Type your email"
            required
          />
          <br />
          <br />
          <button className="buttons" type="submit">
            Send Reset Email
          </button>
          <br />
          <br />
          <p>
            Remembered your password?{' '}
            <Link href="/" id="ulText">
              Back to Login
            </Link>
          </p>
        </form>

        <div>{outputContent}</div>
      </div>
    </div>
  );
}