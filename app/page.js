"use client";

import React, { useEffect, useContext, useState } from "react";
import { CrowdFundingContext } from "@/Context/CrowdFunding";
import { Hero, Card, Form } from "@/Components";

const Index = () => {
  const {
    titleData,
    getCampaigns,
    createCampaign,
    donate,
    getUserCampaigns,
    getDonations,
    isWalletConnected,
    connectWallet,
    currentAccount,
    withdrawFunds,
  } = useContext(CrowdFundingContext);

  const [allCampaigns, setAllCampaigns] = useState([]);
  const [userCampaigns, setUserCampaigns] = useState([]);
  const [openModel, setOpenModel] = useState(false);
  const [donateCampaign, setDonateCampaign] = useState();

    const fetchCampaigns = async () => {
    try {
      const data = await getCampaigns();
      setCampaigns(data);
    } catch (err) {
      console.error("Failed to fetch campaigns:", err);
    }
  };

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        // Ensure wallet is connected
        if (!isWalletConnected) {
          const connected = await connectWallet();
          if (!connected) {
            console.warn("⚠️ Wallet not connected, skipping campaign load.");
            return;
          }
        }

        const allData = await getCampaigns();
        const userData = await getUserCampaigns();

        setAllCampaigns(allData || []);
        setUserCampaigns(userData || []);
      } catch (error) {
        console.error("❌ Error loading campaigns:", error.message);
      }
    };

    fetchCampaignData();
  }, [isWalletConnected]);

  return (
    <>
      <Hero titleData={titleData} createCampaign={createCampaign} />
      <div id="campaigns">
      <Card
        title="All Campaigns"
        allCampaigns={allCampaigns}
        userCampaigns={userCampaigns}
        setOpenModel={setOpenModel}
        setDonateCampaign={setDonateCampaign}
        refreshCampaigns={fetchCampaigns}
      />
      </div>
      <Card
        title="Your Campaigns"
        allCampaigns={userCampaigns}
        setOpenModel={setOpenModel}
        setDonateCampaign={setDonateCampaign}
        currentAccount={currentAccount}
        withdrawFunds={withdrawFunds}
        refreshCampaigns={fetchCampaigns}
      />
      {openModel && donateCampaign && (
        <Form
          setOpenModel={setOpenModel}
          campaign={donateCampaign}
          donateFunction={donate}
          getDonations={getDonations}
        />
      )}
    </>
  );
};

export default Index;
