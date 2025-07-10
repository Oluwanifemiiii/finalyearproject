import "@/styles/globals.css";
import { NavBar, Footer } from "@/Components";
import {CrowdFundingProvider} from "@/Context/CrowdFunding";
import React from "react";
import CheckContractBalance from "@/Components/CheckContractBalance";
export default function RootLayout({ children }) {
  return (
<html>
  <body>
    <CheckContractBalance />
    <CrowdFundingProvider>
    <NavBar />
    <main>{children}</main>
    <Footer />
    </CrowdFundingProvider>
  </body>
</html>

  );
}
