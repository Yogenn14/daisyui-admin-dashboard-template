import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import StaticDataForm from "../../features/documentForms/StaticDataForm";
import DynamicDataForm from "../../features/documentForms/DynamicDataForm";
import ValidationModal from "../../features/documentForms/ValidationModal";
import { jwtDecode } from "jwt-decode";

function InternalPage() {
  const dispatch = useDispatch();
  const [userEmail,setUserEmail] = useState("")
  const [staticData, setStaticData] = useState({
    shipToAddressLine1: "",
    shipToAddressLine2: "",
    shipToAddressLine3: "",
    tel: "",
    email: "",
    attn: "",
    buyer: "",
    buyerEmail: "",
    buyerTel: "",
    requester: "",
    requesterEmail: "",
    requesterTel: "",
    supervisor: "",
    supervisorEmail: "",
    supervisorTel: "",
    notes: "",
  });
  const [dynamicData, setDynamicData] = useState({
    poNumber: "",
    date: "",
    quotationNumber: "",
    vendorAddressLine1: "",
    vendorAddressLine2: "",
    vendorAddressLine3: "",
    vendorAddressLine4: "",
    items: [],
    additionalData: [],
  });
  const [activeTab, setActiveTab] = useState("PO");
  const [isValidationModalOpen, setValidationModalOpen] = useState(false);
  const [combinedData, setCombinedData] = useState([]);

  useEffect(() => {
    dispatch(setPageTitle({ title: "Document Form" }));
    fetchPOData();
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const email = decodedToken.email;
        setUserEmail(email);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, [dispatch]);

  const handleGeneratePO = () => {
    const combinedDataArray = [
      ...Object.entries(staticData).map(([key, value]) => ({
        key,
        value,
      })),
      ...Object.entries(dynamicData).map(([key, value]) => {
        if (key === "items") {
          return { key, value: value.map((item) => JSON.stringify(item)) }; // Convert items to JSON strings
        }
        return { key, value };
      }),
    ];
    setCombinedData(combinedDataArray);
    setValidationModalOpen(true);
  };

  const fetchPOData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_NODE_API_SERVER}po/getPO`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const poData = await response.json();
      setStaticData({
        shipToAddressLine1: poData.shipToAddressLine1,
        shipToAddressLine2: poData.shipToAddressLine2,
        shipToAddressLine3: poData.shipToAddressLine3,
        tel: poData.tel,
        email: poData.email,
        attn: poData.attn,
        buyer: poData.buyer,
        buyerEmail: poData.buyerEmail,
        buyerTel: poData.buyerTel,
        requester: poData.requester,
        requesterEmail: poData.requesterEmail,
        requesterTel: poData.requesterTel,
        supervisor: poData.supervisor,
        supervisorEmail: poData.supervisorEmail,
        supervisorTel: poData.supervisorTel,
        notes: poData.notes,
        condition1: poData.condition1,
        condition2: poData.condition2,
        condition3: poData.condition3,
      });
    } catch (error) {
      console.error("Error fetching PO data:", error);
    }
  };

  const isItemsArrayEmpty = () => {
    return !dynamicData.items || dynamicData.items.length === 0;
  };

  return (
    <div className="p-4">
      <div role="tablist" className="tabs tabs-lifted">
        <button
          className={`tab tab-bordered ${
            activeTab === "PO" ? "tab-active" : ""
          }`}
          onClick={() => setActiveTab("PO")}
        >
          PO
        </button>
        <button
          className={`tab tab-bordered ${
            activeTab === "Quotation" ? "tab-active" : ""
          }`}
          onClick={() => setActiveTab("Quotation")}
        >
          Quotation
        </button>
        <button
          className={`tab tab-bordered ${
            activeTab === "Invoice" ? "tab-active" : ""
          }`}
          onClick={() => setActiveTab("Invoice")}
        >
          Invoice
        </button>
      </div>
      {activeTab === "PO" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <div>
            <StaticDataForm
              staticData={staticData}
              setStaticData={setStaticData}
              userEmail = {userEmail}
            />
          </div>
          <div>
            <DynamicDataForm
              dynamicData={dynamicData}
              setDynamicData={setDynamicData}
              userEmail = {userEmail}
            />
          </div>
          <div className="text-center mt-4 lg:col-span-2">
            <button
              onClick={handleGeneratePO}
              className={`btn btn-md w-full ${
                isItemsArrayEmpty() ? "btn-disabled" : ""
              }`}
            >
              Generate PO
            </button>
          </div>
        </div>
      )}
      {activeTab === "Quotation" && (
        <div className="text-center mt-4">
          <p>Quotation Form is under development.</p>
        </div>
      )}
      {activeTab === "Invoice" && (
        <div className="text-center mt-4">
          <p>Invoice Form is under development.</p>
        </div>
      )}

      <ValidationModal
        isOpen={isValidationModalOpen}
        onRequestClose={() => setValidationModalOpen(false)}
        combinedData={combinedData}
        userEmail = {userEmail}
      />
    </div>
  );
}

export default InternalPage;
