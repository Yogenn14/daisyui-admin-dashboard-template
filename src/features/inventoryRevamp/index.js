import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import Table from "./components/Table";
import ActionButton from "./components/ActionButton";
import Alert from "./components/Alert";
import {jwtDecode} from "jwt-decode"; 

function InternalPage() {
  const dispatch = useDispatch();
  const [searchBy, setSearchBy] = useState("partNum");
  const [result, setResult] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [updateCounter, setUpdateCounter] = useState(0);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [myrToUsdRate, setMyrToUsdRate] = useState(null);

  useEffect(() => {
    dispatch(setPageTitle({ title: "Inventory" }));

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

    const fetchExchangeRate = async () => {
      try {
        const response = await fetch(
          "https://v6.exchangerate-api.com/v6/5cfc49340ef0b1550952197e/latest/USD"
        );
        const data = await response.json();
        if (data.result === "success") {
          setMyrToUsdRate(data.conversion_rates.MYR);
        } else {
          console.error("Failed to fetch exchange rate:", data);
        }
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
      }
    };

    fetchExchangeRate();
  }, [dispatch]);

  // Example conversion function
  const convertMyrToUsd = (amountInMyr) => {
    if (myrToUsdRate) {
      return amountInMyr / myrToUsdRate;
    }
    return null;
  };

  return (
    <div className="h-4/5 bg-base-200">
      <Alert />
      <ActionButton
        result={result}
        setResult={setResult}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchBy={searchBy}
        setSearchBy={setSearchBy}
        userEmail={userEmail}
        updateCounter={updateCounter}
        setUpdateCounter={setUpdateCounter}
        showUpdateModal={showUpdateModal}
        setShowUpdateModal={setShowUpdateModal}
        conversionRate = {myrToUsdRate}
      />
      <Table
        result={result}
        setResult={setResult}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchBy={searchBy}
        userEmail={userEmail}
        updateCounter={updateCounter}
        setUpdateCounter={setUpdateCounter}
        showUpdateModal={showUpdateModal}
        setShowUpdateModal={setShowUpdateModal}
        conversionRate = {myrToUsdRate}
      />
     
    </div>
  );
}

export default InternalPage;
