// HeroWithCreateModal.jsx
"use client";
import React, { useState } from "react";
import CreateCampaignForm from "./CreateCampaignForm"; // Adjust the path as necessary
const Hero = ({ createCampaign }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* Hero Section */}
      <section
        style={{
          background: "black",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "80px 60px",
          minHeight: "80vh",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ flex: 1, maxWidth: "600px", zIndex: 2 }}>
          <h1
            style={{
              fontSize: "4rem",
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.1,
              marginBottom: "24px",
              letterSpacing: "-0.02em",
            }}
          >
            MERAKI3F
            <br />
            Crowdfunding Project
          </h1>
          <p
            style={{
              fontSize: "1.2rem",
              color: "#b8b8d1",
              lineHeight: 1.6,
              marginBottom: "40px",
              fontWeight: 400,
            }}
          >
            A Platform To Support Innovative Projects And Ideas In The University Through Community Funding
          </p>
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <a
              href="#"
              style={{
                padding: "16px 32px",
                border: "2px solid #4a4a6a",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: 600,
                textDecoration: "none",
                background: "transparent",
                color: "#ffffff",
              }}
            >
              Learn More
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowModal(true);
              }}
              style={{
                padding: "16px 32px",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: 600,
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                color: "white",
                boxShadow: "0 8px 32px rgba(99, 102, 241, 0.3)",
                textDecoration: "none",
              }}
            >
              CREATE CAMPAIGN
            </a>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            minHeight: "400px",
          }}
        >
          <div
            style={{
              width: "400px",
              height: "300px",
              background: "black",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: "1.1rem",
              animation: "float 3s ease-in-out infinite",
            }}
          >
            <img src="/hero2.png" alt="Hero Illustration" style={{ width: "100%", height: "auto", objectFit: "contain" }} />
          </div>
        </div>
      </section>

      {/* Modal - Using inline styles for consistency */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            zIndex: 50,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              width: "100%",
              maxWidth: "600px",
              borderRadius: "12px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              padding: "32px",
              position: "relative",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: "absolute",
                top: "16px",
                right: "20px",
                background: "none",
                border: "none",
                fontSize: "32px",
                color: "#6b7280",
                cursor: "pointer",
                lineHeight: 1,
                padding: "4px",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#ef4444")}
              onMouseLeave={(e) => (e.target.style.color = "#6b7280")}
            >
              ×
            </button>

            <CreateCampaignForm
              titleData="Create Campaign"
              createCampaign={createCampaign}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Hero;