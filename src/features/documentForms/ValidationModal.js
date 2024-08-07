import React, { useState, useEffect } from "react";
import InventoryModal from "./InventoryModal";

const ValidationModal = ({ isOpen, onRequestClose, combinedData, userEmail, conversionRate }) => {
  const [validationFailed, setValidationFailed] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const [poData, setPOdata] = useState([]);
  const [inventoryModal, setInventoryModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const errors = [];
      combinedData.forEach((item) => {
        if (item.key === "notes" || item.key === "vendorAddressLine3" || item.key === "vendorAddressLine4") {
          return;
        }
        if (item.key === "items" && (!item.value || item.value.length === 0)) {
          errors.push("Please add items.");
        } else if (!item.value || item.value === "") {
          errors.push(`Please fill ${item.key}.`);
        }
      });
      if (errors.length > 0) {
        setValidationFailed(true);
        setErrorMessages(errors);
      } else {
        setValidationFailed(false);
        setErrorMessages([]);
      }
    }
  }, [isOpen, combinedData]);

  const formatDataForAPI = () => {
    const formattedData = {
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
      condition1: "",
      condition2: "",
      condition3: "",
      items: [],
      additionalItems: [],
      poNumber: "",
      poDate: "",
      vendorAddressLine1: "",
      vendorAddressLine2: "",
      vendorAddressLine3: "",
      vendorAddressLine4: "",
      vendorTel: "",
      vendorEmail: "",
      vendorAttn: "",
      moc: "", 
    };
  
    combinedData.forEach((item) => {
      switch (item.key) {
        case "shipToAddressLine1":
        case "shipToAddressLine2":
        case "shipToAddressLine3":
        case "tel":
        case "email":
        case "attn":
        case "buyer":
        case "buyerEmail":
        case "buyerTel":
        case "requester":
        case "requesterEmail":
        case "requesterTel":
        case "supervisor":
        case "supervisorEmail":
        case "supervisorTel":
        case "notes":
        case "condition1":
        case "condition2":
        case "condition3":
        case "poNumber":
        case "poDate":
        case "quotationNumber":
        case "quotationDate":
        case "vendorAddressLine1":
        case "vendorAddressLine2":
        case "vendorAddressLine3":
        case "vendorAddressLine4":
        case "vendorTel":
        case "vendorEmail":
        case "vendorAttn":
        case "moc":
          formattedData[item.key] = item.value;
          break;
        case "items":
          formattedData.items = item.value.map((jsonString) =>
            JSON.parse(jsonString)
          );
          break;
        case "additionalItems":
          formattedData.additionalItems = item.value.map((jsonString) =>
            JSON.parse(jsonString)
          );
          break;
        default:
          break;
      }
    });
  
    return formattedData;
  };

  const handleConfirm = async () => {
    if (!validationFailed) {
      const formattedData = formatDataForAPI();
      setPOdata(formattedData);
      setInventoryModal(true);
    }
  };

  if (!isOpen) return null;

  const nonItemFields = combinedData.filter((item) => item.key !== "items");
  const itemFields = combinedData.find((item) => item.key === "items");

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full md:w-3/4">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900"
                  id="modal-title"
                >
                  <div className="badge badge-ghost mr-2">STEP 1</div>
                  Validate PO Data
                </h3>
                <div className="divider"></div>
                {validationFailed && (
                  <div className="mt-4 p-2 bg-red-100 border border-red-400 rounded text-red-700">
                    {errorMessages.map((error, index) => (
                      <div key={index} className="mb-1">
                        {error}
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-2">
                  <ul className="text-sm text-gray-500">
                    {nonItemFields.map((item, index) => (
                      <li key={index} className="mb-2">
                        <strong>{item.key}:</strong> {item.value}
                      </li>
                    ))}
                  </ul>
                  {itemFields && (
                    <div className="overflow-auto mt-4">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            {Object.keys(JSON.parse(itemFields.value[0])).map(
                              (subKey, subIndex) => (
                                <th
                                  key={subIndex}
                                  className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  {subKey}
                                </th>
                              )
                            )}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {itemFields.value.map((subItem, subIndex) => (
                            <tr key={subIndex}>
                              {Object.values(JSON.parse(subItem)).map(
                                (subValue, subIndex) => (
                                  <td
                                    key={subIndex}
                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                  >
                                    {subValue}
                                  </td>
                                )
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-2">
            <button
              type="button"
              className={`btn btn-sm ${
                validationFailed ? "btn-disabled" : "btn-primary"
              }`}
              onClick={handleConfirm}
            >
              Confirm
            </button>
            <button
              type="button"
              className="btn btn-sm"
              onClick={onRequestClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      {inventoryModal && (
        <InventoryModal
          poData={poData}
          closeModal={() => setInventoryModal(false)}
          userEmail={userEmail}
          moc = {poData.moc}
          conversionRate = {conversionRate}
        />
      )}
    </div>
  );
};

export default ValidationModal;
