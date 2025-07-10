"use client";

import React, { useState, useEffect, createContext } from "react";
import Web3Modal from "web3modal";
import { ethers, parseUnits, formatUnits } from "ethers";
import { CrowdFundingABI, CrowdFundingAddress } from "@/Context/constants";

const CrowdFundingContext = createContext();

const fetchContract = (signerOrProvider) =>
  new ethers.Contract(CrowdFundingAddress, CrowdFundingABI, signerOrProvider);

export const CrowdFundingProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [donationHistory, setDonationHistory] = useState({});
  const [refreshFlag, setRefreshFlag] = useState(false); // 🚀 Auto-refresh flag

  useEffect(() => {
    const initializeWallet = async () => {
      setIsLoading(true);
      if (localStorage.getItem("isWalletConnected")) {
        await checkIfWalletIsConnected();
      }
      setIsLoading(false);
    };
    initializeWallet();
  }, []);

  const triggerRefresh = () => setRefreshFlag((prev) => !prev); // ✅ Function to force re-render

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Please install MetaMask!");
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      if (accounts.length > 0) {
        setCurrentAccount(accounts[0]);
        setIsWalletConnected(true);
        localStorage.setItem("isWalletConnected", "true");
      }
    } catch (error) {
      console.error("Wallet connection failed:", error);
    }
  };

  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) return false;
    try {
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      if (accounts.length > 0) {
        setCurrentAccount(accounts[0]);
        setIsWalletConnected(true);
        return true;
      } else {
        setIsWalletConnected(false);
        localStorage.removeItem("isWalletConnected");
        return false;
      }
    } catch (error) {
      console.error("Check connection error:", error);
      return false;
    }
  };

  const createCampaign = async ({ name, description, goal, durationInDays }) => {
    if (!window.ethereum) throw new Error("Please install MetaMask!");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = fetchContract(signer);

    if (!name || !description || !goal || !durationInDays)
      throw new Error("All campaign fields are required.");

    const goalInWei = parseUnits(goal.toString(), 18);
    const duration = parseInt(durationInDays);

    const transaction = await contract.createCampaign(
      name,
      description,
      goalInWei,
      duration,
      {
        gasLimit: 3000000,
      }
    );

    const result = await transaction.wait();
    triggerRefresh(); // ✅ Trigger auto-refresh
    return result;
  };

  const getCampaigns = async () => {
    const provider = new ethers.JsonRpcProvider();
    const contract = fetchContract(provider);
    const campaigns = await contract.getCampaigns();

    return campaigns.map((c, i) => ({
      owner: c.owner,
      name: c.name,
      description: c.description,
      goal: formatUnits(c.goal.toString(), 18),
      startTime: new Date(Number(c.startTime) * 1000),
      durationInDays: Number(c.durationInDays),
      pId: i,
      completed: c.completed,
      amountCollected: formatUnits(c.amountCollected.toString(), 18),
    }));
  };

  const getUserCampaigns = async () => {
    if (!currentAccount) throw new Error("Connect wallet first");

    const provider = new ethers.JsonRpcProvider();
    const contract = fetchContract(provider);
    const all = await contract.getCampaigns();

    return all
      .map((c, i) => ({
        owner: c.owner,
        name: c.name,
        description: c.description,
        goal: formatUnits(c.goal.toString(), 18),
        startTime: new Date(Number(c.startTime) * 1000),
        durationInDays: Number(c.durationInDays),
        pId: i,
        completed: c.completed,
        amountCollected: formatUnits(c.amountCollected.toString(), 18),
      }))
      .filter(c => c.owner.toLowerCase() === currentAccount.toLowerCase());
  };

  const donate = async (pId, amount) => {
    if (!window.ethereum) throw new Error("Please install MetaMask!");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = fetchContract(signer);

    const tx = await contract.donateToCampaign(pId, {
      value: parseUnits(amount, 18),
    });
    await tx.wait();
    await refreshDonations(pId);
    triggerRefresh(); // ✅ Refresh after donation
  };

  const getDonations = async (pId) => {
    const provider = new ethers.JsonRpcProvider();
    const contract = fetchContract(provider);
    const [donators, donations] = await contract.getDonations(pId);

    return donators.map((d, i) => ({
      donator: d,
      donation: formatUnits(donations[i].toString(), 18),
    }));
  };

  const refreshDonations = async (pId) => {
    const updated = await getDonations(pId);
    setDonationHistory((prev) => ({ ...prev, [pId]: updated }));
  };

  const testContract = async () => {
    const provider = new ethers.JsonRpcProvider();
    const code = await provider.getCode(CrowdFundingAddress);
    if (code === "0x") throw new Error("Contract not deployed");
    return true;
  };

  const withdrawFunds = async (pId) => {
    try {
      if (!window.ethereum) throw new Error("Please install MetaMask");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = fetchContract(signer);

      const tx = await contract.withdrawFunds(pId);
      await tx.wait();
      alert("🎉 Funds successfully withdrawn!");
      triggerRefresh();
    } catch (error) {
      console.error("❌ Withdrawal failed:", error);
      alert("❌ Withdrawal failed. Check if goal is reached and time hasn't expired.");
    }
  };

  return (
    <CrowdFundingContext.Provider
      value={{
        currentAccount,
        isWalletConnected,
        isLoading,
        connectWallet,
        checkIfWalletIsConnected,
        createCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
        refreshDonations,
        donationHistory,
        testContract,
        withdrawFunds,
        refreshFlag,
        triggerRefresh,
      }}
    >
      {children}
    </CrowdFundingContext.Provider>
  );
};

export { CrowdFundingContext };
