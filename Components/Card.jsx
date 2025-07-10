"use client";

import React, { useContext } from "react";
import { CrowdFundingContext } from "@/Context/CrowdFunding";
import { Plus } from "lucide-react";

const Card = ({
  title,
  allCampaigns = [],
  setOpenModel,
  setDonateCampaign,
  refreshCampaigns,
}) => {
  const { currentAccount, withdrawFunds, triggerRefresh } =
    useContext(CrowdFundingContext);

  const handleWithdraw = async (pId) => {
    try {
      await withdrawFunds(pId);
      if (refreshCampaigns) {
        await refreshCampaigns(); // Use prop-based refresh if passed
      } else {
        triggerRefresh(); // fallback to context-based refresh
      }
    } catch (err) {
      console.error("Withdraw failed:", err);
    }
  };

  if (!Array.isArray(allCampaigns) || allCampaigns.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-gray-500">No campaigns available.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allCampaigns.map((campaign, index) => {
          const raised = parseFloat(campaign.amountCollected);
          const goal = parseFloat(campaign.goal);
          const progress = Math.min((raised / goal) * 100, 100);
          const isOwner =
            campaign.owner.toLowerCase() === currentAccount.toLowerCase();
          const isCompleted = campaign.completed;

          return (
            <div
              key={index}
              className="bg-white border border-black rounded-2xl p-4 flex flex-col justify-between shadow-md"
            >
              {/* Title */}
              <div className="mb-3">
                <h3 className="text-2xl font-bold mb-1">{campaign.name}</h3>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 bg-gray-300 rounded-full mb-3">
                <div
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Raised / Goal / Duration */}
              <div className="flex justify-between items-center mb-3">
                <div className="flex flex-col gap-1 w-2/3">
                  <div className="text-black px-2 py-1 rounded">
                    Raised: {raised} / {goal} ETH
                  </div>
                  <div className="text-black px-2 py-1 rounded">
                    Duration: {campaign.durationInDays} days
                  </div>
                </div>

                {/* Donation Button */}
                <div className="flex flex-col items-end">
                  <button
                    onClick={() => {
                      if (!isCompleted) {
                        setOpenModel(true);
                        setDonateCampaign(campaign);
                      }
                    }}
                    className={`flex items-center gap-1 text-lg font-semibold ${
                      isCompleted
                        ? "text-blue-300 cursor-not-allowed"
                        : "text-purple-900 hover:underline"
                    }`}
                    disabled={isCompleted}
                  >
                    <Plus size={20} />
                    Add Donation
                  </button>

                  {/* Withdraw Button */}
                  {raised >= goal && !isCompleted && isOwner && (
                    <button
                      onClick={() => handleWithdraw(campaign.pId)}
                      className="mt-3 px-3 py-1 bg-green-600 text-white rounded-xl hover:bg-green-700"
                    >
                      Withdraw Funds
                    </button>
                  )}
                </div>
              </div>

              {/* Completed label */}
              {isCompleted && (
                <p className="text-sm text-green-700 font-medium">
                  Campaign Completed ✅
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Card;
