import React, { useState } from "react";
import ConfirmationModal from "./ConfirmationModal";

const InventoryModal = ({ closeModal, poData, userEmail }) => {
  const initializeFormData = () => {
    return poData.items.map((item) => ({
      ...item,
      serialNumbers: item.serialNumbers || Array(item.quantity).fill(""),
      conditions: item.serialNumbers ? Array(item.serialNumbers.length).fill(item.condition) : [],
      statuses: item.serialNumbers ? Array(item.serialNumbers.length).fill(item.status) : [],
      manufactureroems: item.serialNumbers ? Array(item.serialNumbers.length).fill(item.manufactureroem) : [],
      inDates: item.serialNumbers ? Array(item.serialNumbers.length).fill(item.inDate) : [],
      warrantyEndDates: item.serialNumbers ? Array(item.serialNumbers.length).fill(item.warrantyEndDate) : [],
      suppliers: item.serialNumbers ? Array(item.serialNumbers.length).fill(item.supplier) : [],

    }));
  };

  const [formData, setFormData] = useState(initializeFormData);
  const [errors, setErrors] = useState([]);
  const [validated,setValidated] = useState(false);
  const [confirmationModal,setConfirmationModal] = useState(false);
  const [bulkItem,setBulkItem] = useState([])

  const handleChange = (index, field, value, serialIndex = null) => {
    setValidated(false)
    const newFormData = [...formData];
    if (serialIndex !== null) {
      if (field === "serialNumber") {
        newFormData[index].serialNumbers[serialIndex] = value;
      } else if (field === "condition") {
        newFormData[index].conditions[serialIndex] = value;
      } else if (field === "status") {
        newFormData[index].statuses[serialIndex] = value;
      }else if (field === "manufactureroem") {
        newFormData[index].manufactureroems[serialIndex] = value;
      } else if (field === "inDate") {
        newFormData[index].inDates[serialIndex] = value;
      } else if (field === "supplier") {
        newFormData[index].suppliers[serialIndex] = value;
  
      } else if (field === "warrantyEndDate") {
        newFormData[index].warrantyEndDates[serialIndex] = value;
      }
    

    } else {
      newFormData[index][field] = value;
    }
    setFormData(newFormData);
  };

  const handleSubmit = async () => {
    const requestBody = {
      items: formData.flatMap((item) => {
        if (item.type === "serialized") {
          return item.serialNumbers.map((serialNumber, index) => ({
            inventoryId: item.id,
            type: item.type,
            serialNumber,
            quantityChange: 1,
            condition: item.conditions[index],
            status: item.statuses[index],
            manufactureroem: item.manufactureroems[index],
            inDate: item.inDates[index],
            outDate: "",
            userEmail,
            supplier: item.suppliers[index],
            customer: "",
            warrantyEndDate: item.warrantyEndDates[index],
          }));
        } else {
          return {
            inventoryId: item.id,
            type: item.type,
            quantityChange: item.quantity,
            date: item.date,
            supplier: item.supplier,
            manufactureroem: item.manufactureroem,
            condition: item.condition,
            status: item.status,
            userEmail,
          };
        }
      }),
    };
  
    try {
      const response = await fetch(`${process.env.REACT_APP_NODE_API_SERVER}inventory/validate-items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
       console.log(JSON.stringify(requestBody))
       console.log(poData)

      if (!response.ok) {
        const data = await response.json();
        const errorMessage = data.error;
        const updatedErrorMessage = errorMessage.replace(/items\[(\d+)\]/, (_, index) => `Form ${Number(index) + 1}`);
        setErrors([{ message: updatedErrorMessage }]);
        setValidated(false)

        throw new Error(updatedErrorMessage);
      }

      setErrors([]);

      if(response.ok) {
        setValidated(true)  
        setBulkItem(requestBody)
      } 


    } catch (error) {
      console.error("Error validating items:", error.message);
      setValidated(false)
    }
  };


  const handleNext = () =>{
    setConfirmationModal(true);
  }

  return (
    <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full md:w-3/4">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    <div className="badge badge-ghost mr-2">STEP 2</div>
                    Inventory Items <div className="badge badge-outline">Assigned by: {userEmail}</div>
                  </h3>
                
                  <div className="mt-2">
                    {formData.map((item, index) => (
                      <div key={index} className="mb-4 p-4 border rounded-lg">
                        <h4 className="text-md font-medium text-gray-800">Item {index + 1}</h4>
                        <p>Part Number: {item.partNo}</p>
                        <p>Part Description: {item.description}</p>
                        <p>Quantity: {item.quantity}</p>
                        <p>Inventory ID: {item.id}</p>

                        {item.type === "serialized" ? (
                          Array.from({ length: item.quantity }).map((_, serialIndex) => (
                            <div key={serialIndex} className="mb-4 p-4 border rounded-lg mt-4">
                              <label className="label">Serial Number:</label>
                              <input
                                type="text"
                                value={item.serialNumbers[serialIndex] || ""}
                                onChange={(e) =>
                                  handleChange(index, "serialNumber", e.target.value, serialIndex)
                                }
                                className="input input-bordered w-full max-w-xs"
                              />
                              <label className="label">Condition:</label>
                              <input
                                type="text"
                                value={item.conditions[serialIndex] || ""}
                                onChange={(e) =>
                                  handleChange(index, "condition", e.target.value, serialIndex)
                                }
                                className="input input-bordered w-full max-w-xs"
                              />
                              <label className="label">Status:</label>
                              <input
                                type="text"
                                value={item.statuses[serialIndex] || ""}
                                onChange={(e) =>
                                  handleChange(index, "status", e.target.value, serialIndex)
                                }
                                className="input input-bordered w-full max-w-xs"
                              />
                              <label className="label">Manufacturer/OEM:</label>
                              <input
                                type="text"
                                value={item.manufactureroems[serialIndex] || ""}
                                onChange={(e) => handleChange(index, "manufactureroem", e.target.value, serialIndex)}
                                className="input input-bordered w-full max-w-xs"
                              />
                              <label className="label">In Date:</label>
                              <input
                                type="date"
                                value={item.inDates[serialIndex] || ""}
                                onChange={(e) => handleChange(index, "inDate", e.target.value, serialIndex)}
                                className="input input-bordered w-full max-w-xs"
                              />
                              <label className="label">Supplier:</label>
                              <input
                                type="text"
                                value={item.suppliers[serialIndex] || ""}
                                onChange={(e) => handleChange(index, "supplier", e.target.value, serialIndex)}
                                className="input input-bordered w-full max-w-xs"
                              />
                              <label className="label">Warranty End Date:</label>
                              <input
                                type="date"
                                value={item.warrantyEndDates[serialIndex] || ""}
                                onChange={(e) => handleChange(index, "warrantyEndDate", e.target.value,serialIndex)}
                                className="input input-bordered w-full max-w-xs"
                              />
                            </div>
                          ))
                        ) : (
                          <>
                            <label className="label">Quantity Change:</label>
                            <input
                              type="number" 
                              value={item.quantity}
                              className="input input-bordered w-full max-w-xs"
                              disabled
                            />
                            <label className="label">In Date:</label>
                            <input
                              type="date"
                              value={item.date}
                              onChange={(e) => handleChange(index, "date", e.target.value)}
                              className="input input-bordered w-full max-w-xs"
                            />
                            <label className="label">Supplier:</label>
                            <input
                              type="text"
                              value={item.supplier}
                              onChange={(e) => handleChange(index, "supplier", e.target.value)}
                              className="input input-bordered w-full max-w-xs"
                            />
                            <label className="label">Manufacturer/OEM:</label>
                            <input
                              type="text"
                              value={item.manufactureroem}
                              onChange={(e) => handleChange(index, "manufactureroem", e.target.value)}
                              className="input input-bordered w-full max-w-xs"
                            />
                            <label className="label">Condition:</label>
                            <input
                              type="text"
                              value={item.condition}
                              onChange={(e) => handleChange(index, "condition", e.target.value)}
                              className="input input-bordered w-full max-w-xs"
                            />
                            <label className="label">Status:</label>
                            <input
                              type="text"
                              value={item.status}
                              onChange={(e) => handleChange(index, "status", e.target.value)}
                              className="input input-bordered w-full max-w-xs"
                              />
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {errors.length > 0 && (
                   <>
                   <div class="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 mt-4" role="alert">
                  <svg class="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                  </svg>
                  <span class="sr-only">Info</span>

                     
                      <ul>
                      <div>
                        <p>Validation Error</p>
                        {errors.map((error, idx) => (
                          <li key={idx} className="text-red-600">
                            Item {error.index + 1} ({error.field}): {error.message}
                          </li>
                        ))}
                         </div>
                      </ul>
                      </div>
                     
                    </>
                  )}
                  {validated &&  <div class="flex items-center p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
  <svg class="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
  </svg>
  <span class="sr-only">Info</span>
  <div>
    <span class="font-medium">Validation Successful! Please click next button to continue</span>
  </div>
</div>}
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-x-2">
                {validated  ? 
                <button
                  type="button"
                  onClick={handleNext}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 sm:mt-0 sm:w-auto"
                >
                  Next
                </button>

                :
                <button
                type="button"
                onClick={handleSubmit}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 sm:mt-0 sm:w-auto"
              >
                Confirm
              </button>
                
                }
                <button
                  type="button"
                  onClick={closeModal}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
          {confirmationModal && <ConfirmationModal poData = {poData} bulkItem = {bulkItem} closeModal={()=>setConfirmationModal(false)}/>}
        </div>
      </div>
    );
  };
  
  export default InventoryModal;
  