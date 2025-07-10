"use client";

import React, { useState, useEffect } from "react";

const Form = ({ setOpenModel, campaign, donateFunction, getDonations }) => {
  const [amount, setAmount] = useState("");
  const [donationList, setDonationList] = useState([]);

  const fetchDonations = async () => {
    try {
      const data = await getDonations(campaign.pId);
      setDonationList(data || []);
    } catch (err) {
      console.error("❌ Error fetching donations:", err);
    }
  };

  const createDonation = async () => {
    try {
      const tx = await donateFunction(campaign.pId, amount);
      console.log("✅ Donation successful:", tx);
      alert("🎉 Donation successful!");
      setAmount(""); // Reset input
      await fetchDonations(); // Refresh donation list
    } catch (error) {
      console.error("❌ Donation failed:", error);
      alert("❌ Donation failed. Please try again.");
    }
  };

  useEffect(() => {
    if (campaign?.pId) {
      fetchDonations();
    }
  }, [campaign]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-xl w-[500px] p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{campaign?.name}</h2>
          <button onClick={() => setOpenModel(false)} className="text-2xl">
            &times;
          </button>
        </div>
        <p className="text-gray-600 mb-2">{campaign?.description}</p>
        <p className="text-sm text-gray-500 mb-1">
          Goal: <strong>{campaign?.goal} ETH</strong>
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Duration: {campaign?.durationInDays} days
        </p>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount in ETH"
          className="w-full mb-4 border border-gray-300 rounded-lg px-4 py-2"
        />
        {donationList.length > 0 && (
          <div className="mb-4">
            <h3 className="text-md font-medium mb-2">Previous Donations:</h3>
            {donationList.map((item, i) => (
              <p key={i} className="text-sm text-gray-600">
                {i + 1}. {item.donation} ETH by{" "}
                {item.donator.slice(0, 6)}...{item.donator.slice(-4)}
              </p>
            ))}
          </div>
        )}
        <div className="flex justify-end">
          <button
            onClick={() => setOpenModel(false)}
            className="text-gray-500 mr-4"
          >
            Cancel
          </button>
          <button
            onClick={createDonation}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Donate
          </button>
        </div>
      </div>
    </div>
  );
};

export default Form;
