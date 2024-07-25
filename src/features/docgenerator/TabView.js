import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";

import POForm from "./SidebarForm";
import QuotationForm from "./QuotationForm";
import InvoiceForm from "./InvoiceForm";

import POComponent from "./POComponent";

const TabView = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("PO");
  const [poNum, setPoNum] = useState("");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    let pageTitle = "";
    switch (tab) {
      case "PO":
        pageTitle = "Purchase Order";
        break;
      case "Quotation":
        pageTitle = "Quotation";
        break;
      case "Invoice":
        pageTitle = "Invoice";
        break;
      default:
        pageTitle = "Doc Generator";
        break;
    }
    dispatch(setPageTitle({ title: pageTitle }));
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-200">
        {/* Sidebar content based on active tab */}
        {activeTab === "PO" && <POForm poNum={poNum} setPoNum={setPoNum} />}
        {activeTab === "Quotation" && <QuotationForm />}
        {activeTab === "Invoice" && <InvoiceForm />}
      </div>

      {/* Main Content */}
      <div className="w-3/4 bg-white p-4">
        {/* Tabs */}
        <div className="flex">
          <TabButton
            tabName="PO"
            activeTab={activeTab}
            onClick={handleTabChange}
          />
          <TabButton
            tabName="Quotation"
            activeTab={activeTab}
            onClick={handleTabChange}
          />
          <TabButton
            tabName="Invoice"
            activeTab={activeTab}
            onClick={handleTabChange}
          />
        </div>

        {/* Main Content based on active tab */}
        {activeTab === "PO" && (
          <div>
            <POComponent poNum={poNum} setPoNum={setPoNum} />
          </div>
        )}
        {activeTab === "Quotation" && <div>Content for Quotation</div>}
        {activeTab === "Invoice" && <div>Content for Invoice</div>}
      </div>
    </div>
  );
};

const TabButton = ({ tabName, activeTab, onClick }) => (
  <button
    className={`px-4 py-2 mx-1 border border-gray-300 rounded ${
      activeTab === tabName
        ? "bg-blue-500 text-white"
        : "bg-white text-gray-700"
    }`}
    onClick={() => onClick(tabName)}
  >
    {tabName}
  </button>
);

export default TabView;
