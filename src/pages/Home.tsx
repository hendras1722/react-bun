import { APITester } from "../APITester";
import logo from "../logo.svg";
import reactLogo from "../react.svg";

export const meta = {
  title: "Dashboard Admin",
};

export const layout = 'main';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-8">

      {/* Logo */}
      <div className="flex items-center gap-6">
        <img
          src={logo}
          alt="Bun Logo"
          className="w-20 h-20 object-contain drop-shadow-lg hover:scale-110 transition duration-300"
        />
        <img
          src={reactLogo}
          alt="React Logo"
          className="w-20 h-20 object-contain drop-shadow-lg hover:scale-110 transition duration-300 animate-spin-slow"
        />
      </div>

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
        Bun + React
      </h1>

      {/* Description */}
      <p className="max-w-xl text-slate-400 text-base md:text-lg">
        Welcome to your Bun-powered React application with file-based routing style!
      </p>

      {/* API Tester Card */}
      <div className="w-full max-w-xl bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl hover:shadow-2xl transition">
        <APITester />
      </div>

    </div>
  );
}
