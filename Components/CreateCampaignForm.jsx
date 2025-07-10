"use client";

import React, { useState, useEffect } from "react";

const CreateCampaignForm = ({ titleData = "Create Campaign", createCampaign }) => {
  const [campaign, setCampaign] = useState({
    name: "",
    description: "",
    goal: "",
    durationInDays: "",
  });

  const [currentAccount, setCurrentAccount] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get connected wallet on load + listen for account changes
  useEffect(() => {
    const getConnectedAccount = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" });
          if (accounts.length > 0) {
            setCurrentAccount(accounts[0]);
            setIsConnected(true);
          }
        } catch (error) {
          console.error("Error getting accounts:", error);
        }
      }
    };

    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
        setCurrentAccount(accounts[0]);
        setIsConnected(true);
      } else {
        setCurrentAccount("");
        setIsConnected(false);
      }
    };

    getConnectedAccount();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      }
    };
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Please install MetaMask or another Ethereum wallet");

    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setCurrentAccount(accounts[0]);
      setIsConnected(true);
    } catch (error) {
      console.error("Wallet connection failed:", error);
      alert("Failed to connect wallet");
    }
  };

  const createNewCampaign = async (e) => {
    e.preventDefault();

    if (!isConnected || !currentAccount) {
      alert("Please connect your wallet first");
      return;
    }

    try {
      setLoading(true);

      const campaignData = {
        ...campaign,
        owner: currentAccount,
      };

      await createCampaign(campaignData);

      alert("✅ Campaign created successfully!");
      setCampaign({ name: "", description: "", goal: "", durationInDays: "" });
    } catch (error) {
      console.error("Error creating campaign:", error);
      alert(`❌ Failed to create campaign: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <div style={{ padding: "0" }}>
        <h3 style={{
          marginBottom: "24px",
          fontSize: "1.5rem",
          fontWeight: "600",
          textAlign: "center",
          color: "#1f2937"
        }}>
          {titleData}
        </h3>

        {/* Wallet status */}
        <div style={{
          marginBottom: "16px",
          padding: "12px",
          borderRadius: "8px",
          backgroundColor: "#f9fafb",
          border: "1px solid #e5e7eb"
        }}>
          {isConnected ? (
            <div style={{ fontSize: "0.875rem" }}>
              <p style={{ color: "#059669", fontWeight: "500", marginBottom: "4px" }}>
                ✓ Wallet Connected
              </p>
              <p style={{ color: "#6b7280", wordBreak: "break-all", margin: "0" }}>
                {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)}
              </p>
            </div>
          ) : (
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "#ea580c", marginBottom: "8px", margin: "0 0 8px 0" }}>
                Wallet not connected
              </p>
              <button
                onClick={connectWallet}
                type="button"
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  fontWeight: "500"
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = "#2563eb"}
                onMouseLeave={(e) => e.target.style.backgroundColor = "#3b82f6"}
              >
                Connect Wallet
              </button>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={createNewCampaign}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "500",
              color: "#374151",
              fontSize: "0.875rem"
            }}>
              Title
            </label>
            <input
              onChange={(e) => setCampaign({ ...campaign, name: e.target.value })}
              value={campaign.name}
              placeholder="Enter campaign title"
              required
              type="text"
              style={{
                width: "100%",
                height: "48px",
                padding: "0 16px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "1rem",
                outline: "none",
                boxSizing: "border-box"
              }}
              onFocus={(e) => e.target.style.borderColor = "#8b5cf6"}
              onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "500",
              color: "#374151",
              fontSize: "0.875rem"
            }}>
              Description
            </label>
            <input
              onChange={(e) => setCampaign({ ...campaign, description: e.target.value })}
              value={campaign.description}
              placeholder="Describe your campaign"
              required
              style={{
                width: "100%",
                height: "48px",
                padding: "0 16px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "1rem",
                outline: "none",
                boxSizing: "border-box"
              }}
              onFocus={(e) => e.target.style.borderColor = "#8b5cf6"}
              onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "500",
              color: "#374151",
              fontSize: "0.875rem"
            }}>
              Target Amount (ETH)
            </label>
            <input
              onChange={(e) => setCampaign({ ...campaign, goal: e.target.value })}
              value={campaign.goal}
              type="number"
              placeholder="e.g., 5"
              required
              min="0"
              step="any"
              style={{
                width: "100%",
                height: "48px",
                padding: "0 16px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "1rem",
                outline: "none",
                boxSizing: "border-box"
              }}
              onFocus={(e) => e.target.style.borderColor = "#8b5cf6"}
              onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "500",
              color: "#374151",
              fontSize: "0.875rem"
            }}>
              Campaign End Date
            </label>
            <input
              onChange={(e) => {
                const selectedDate = new Date(e.target.value);
                const now = new Date();
                const diffInDays = Math.ceil((selectedDate - now) / (1000 * 60 * 60 * 24));
                setCampaign({ ...campaign, durationInDays: diffInDays });
              }}
              type="date"
              required
              min={new Date().toISOString().split("T")[0]}
              style={{
                width: "100%",
                height: "48px",
                padding: "0 16px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "1rem",
                outline: "none",
                boxSizing: "border-box"
              }}
              onFocus={(e) => e.target.style.borderColor = "#8b5cf6"}
              onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
            />
            {campaign.durationInDays && (
              <p style={{
                fontSize: "0.875rem",
                color: "#6b7280",
                marginTop: "4px",
                margin: "4px 0 0 0"
              }}>
                Duration: <strong>{campaign.durationInDays}</strong> day(s)
              </p>
            )}
          </div>

          <div style={{ marginTop: "24px" }}>
            <button
              type="submit"
              disabled={!isConnected || loading}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "48px",
                padding: "0 24px",
                fontWeight: "500",
                color: "white",
                backgroundColor: isConnected ? "#8b5cf6" : "#9ca3af",
                border: "none",
                borderRadius: "6px",
                cursor: isConnected ? "pointer" : "not-allowed",
                fontSize: "1rem",
                transition: "background-color 0.2s"
              }}
              onMouseEnter={(e) => {
                if (isConnected) e.target.style.backgroundColor = "#7c3aed";
              }}
              onMouseLeave={(e) => {
                if (isConnected) e.target.style.backgroundColor = "#8b5cf6";
              }}
            >
              {loading ? "Creating Campaign..." : "Create Campaign"}
            </button>
          </div>

          <p style={{
            fontSize: "0.75rem",
            color: "#6b7280",
            marginTop: "8px",
            textAlign: "center",
            margin: "8px 0 0 0"
          }}>
            By creating a campaign, you agree to our terms and conditions.
          </p>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaignForm;