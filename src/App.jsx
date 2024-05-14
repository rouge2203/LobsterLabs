import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { AuroraBackground } from "./components/aurora-background";
import { Boxes } from "./components/background-boxes";
import Logo from "./assets/img/logo.png";
import Catalyst from "./assets/img/catalyst.png";
import Navbar from "./components/Navbar";
import { ThreeDCardDemo } from "./components/3d-card2";
import { CardBody, CardContainer, CardItem } from "./components/3d-card";
import {
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  GiftIcon,
  CircleStackIcon,
  DocumentChartBarIcon,
  BookOpenIcon,
  CreditCardIcon,
} from "@heroicons/react/24/solid";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="dark flex flex-col min-h-screen bg-zinc-900">
      <main className="flex-grow relative">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
