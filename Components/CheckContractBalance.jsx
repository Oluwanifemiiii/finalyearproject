"use client";

import { useEffect } from "react";
import { ethers } from "ethers";
import { CrowdFundingAddress } from "@/Context/constants";

const CheckContractBalance = () => {
  useEffect(() => {
    const checkBalance = async () => {
      try {
        const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
        const balance = await provider.getBalance(CrowdFundingAddress);
        console.log(
          "💰 Smart contract balance:",
          ethers.formatEther(balance),
          "ETH"
        );
      } catch (err) {
        console.error("❌ Failed to get contract balance:", err);
      }
    };

    checkBalance();
  }, []);

  return null;
};

export default CheckContractBalance;
