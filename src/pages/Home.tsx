import { APITester } from "../APITester";
import logo from "../logo.svg";
import reactLogo from "../react.svg";

export const meta = {
  title: "Dashboard Admin",
};

export const layout = false;

export default function Home() {
  return (
    <div className="home-page">
      <div className="logo-container">
        <img src={logo} alt="Bun Logo" className="logo bun-logo" />
        <img src={reactLogo} alt="React Logo" className="logo react-logo" />
      </div>

      <h1>Bun + React</h1>
      <p>
        Welcome to your Bun-powered React application with file-based routing style!
      </p>
      <APITester />
    </div>
  );
}
