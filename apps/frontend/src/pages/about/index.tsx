import Link from 'next/link';


export default function MyApp() {
  return (
    <div>
      <div className="topBar">
        <ul className="navBar">
          <li id="navTitle"><h1>OLYMPULL</h1></li>
          <li><Link href="/dashboard">Account</Link></li>
          <li><Link href="/about">About</Link></li>
        </ul>
      </div>
      <div className="mainBox">
        <h1>About Us</h1>
        <p>Our team created Olympull as part of a project assignment in university. The project was made over the course of two months, with members developing skills and learning frameworks and roles they&apos;ve never touched prior. We learned a lot from this experience, and we&apos;re happy to share it with you!</p>
      </div>
    </div>
  );
}