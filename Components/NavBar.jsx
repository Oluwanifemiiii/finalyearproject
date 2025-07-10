"use client";

import React, { useContext } from "react";
import { CrowdFundingContext } from "@/Context/CrowdFunding";

const Navbar = () => {
  const { connectWallet, isWalletConnected } = useContext(CrowdFundingContext);

  return (
    <nav className="bg-[#2f1b4c] text-white px-8 py-4 flex items-center justify-between shadow-md">
      {/* Logo */}
      <div className="text-2xl font-extrabold tracking-wide">MERAKI3F</div>

      {/* Nav Links */}
      <div className="flex gap-8 text-sm font-medium">
        <a href="#whitepaper" className="hover:text-gray-300 transition">White paper</a>
        <a href="#campaigns" className="hover:text-gray-300 transition">Campaigns</a>
      </div>

      {/* Wallet Button */}
      <button
        onClick={connectWallet}
        className="px-4 py-1.5 border border-white rounded-lg hover:bg-white hover:text-[#2f1b4c] transition"
      >
        {isWalletConnected ? "Wallet Connected" : "Connect Wallet"}
      </button>
    </nav>
  );
};

export default Navbar;
