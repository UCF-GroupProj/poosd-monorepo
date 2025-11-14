

export default function MyApp() {
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
      <h1>About Us</h1>
      <p>Our team created Olympull as part of a project assignment in university. The project was made over the course of two months, with members developing skills and learning frameworks and roles they've never touched prior. We learned a lot from this experience, and we're happy to share it with you!</p>
      </div>
    </div>
    );
}