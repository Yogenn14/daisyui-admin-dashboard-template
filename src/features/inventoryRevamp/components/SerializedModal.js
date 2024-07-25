import React, { useState } from "react";
import SerializedForm from "./SerializedForm";

const SerializedModal = ({
  closeModal,
  userEmail,
  openSerializedForm,
  updateCounter,
  setUpdateCounter,
}) => {
  const [partNumber, setPartNumber] = useState("");
  const [partDescription, setPartDescription] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [type, setType] = useState("serialized");
  const [manufactureroem, setManufactureroem] = useState("");
  const [condition, setCondition] = useState("");
  const [image, setImage] = useState("");
  const [status, setStatus] = useState("");
  const [inDate, setInDate] = useState(null);
  const [outDate, setOutDate] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSerializedFormOpen, setIsSerializedFormOpen] = useState(false);
  const [sPD, setsPD] = useState("");
  const [sPN, setsPN] = useState("");
  const [sinvID, setsInv] = useState();
  const [successMessage, setSuccessMessage] = useState("");

  const handleAddItem = async () => {
    const newItem = {
      partNumber,
      partDescription,
      quantity,
      status,
      type,
      manufactureroem,
      condition,
      image,
      inDate,
      outDate,
      userEmail,
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_NODE_API_SERVER}inventory/addInventoryItem`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newItem),
        }
      );

      console.log(JSON.stringify(newItem));
      setUpdateCounter(updateCounter + 1);
      if (response.ok) {
        setIsSerializedFormOpen(true);
        setSuccessMessage(
          `A new part number ${partNumber}_part description ${partDescription} combination has been added successfulyy, add serialized item for it below`
        );
      }
      if (!response.ok) {
        const errorData = await response.json();
        if (
          errorData.error &&
          errorData.partNumber &&
          errorData.partDescription &&
          errorData.inventoryId
        ) {
          setErrorMessage(
            `An item with the same Part Number (${errorData.partNumber}) and Part Description (${errorData.partDescription}) combination already exists in the database.Add serialized unit for it below`
          );
          setIsSerializedFormOpen(true);
          setsPD(errorData.partDescription);
          setsInv(errorData.inventoryId);
          setsPN(errorData.partNumber);
        } else {
          setErrorMessage("An error occurred. Please try again.");
        }
        console.error("Error:", errorData);
        return;
      }

      const result = await response.json();
      setsInv(result.inventory.id);
      //closeModal();
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div
      className="relative z-50 w-full"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity w-full"></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3
                    className="text-base font-semibold leading-6 text-gray-900"
                    id="modal-title"
                  >
                    Add New Part [Serialized]
                  </h3>
                  <div className="mt-2">
                    <form>
                      <div className="mb-4">
                        <label
                          className={`input input-bordered flex items-center gap-2 ${
                            isSerializedFormOpen ? "input-disabled" : ""
                          }`}
                        >
                          <input
                            type="text"
                            className={`grow ${
                              isSerializedFormOpen ? "input-disabled" : ""
                            }`}
                            placeholder="Part Number"
                            value={partNumber}
                            onChange={(e) => setPartNumber(e.target.value)}
                            disabled={isSerializedFormOpen}
                          />
                        </label>
                      </div>
                      <div className="mb-4">
                        <label
                          className={`input input-bordered flex items-center gap-2 ${
                            isSerializedFormOpen ? "input-disabled" : ""
                          }`}
                        >
                          {" "}
                          <input
                            type="text"
                            className={`grow ${
                              isSerializedFormOpen ? "input-disabled" : ""
                            }`}
                            placeholder="Part Description"
                            value={partDescription}
                            onChange={(e) => setPartDescription(e.target.value)}
                            disabled={isSerializedFormOpen}
                          />
                        </label>
                      </div>
                    </form>
                    {errorMessage && (
                      <div role="alert" className="alert">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          className="stroke-info shrink-0 w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                        <span className="text-xs">{errorMessage}</span>
                      </div>
                    )}
                    {successMessage && (
                      <div
                        className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
                        role="alert"
                      >
                        <span className="font-medium">Success!</span>
                        {successMessage}
                      </div>
                    )}
                    {isSerializedFormOpen && (
                      <SerializedForm
                        inventoryId={sinvID}
                        partNumber={sPN}
                        partDescription={sPD}
                        userEmail={userEmail}
                        closeModal={closeModal}
                        updateCounter={updateCounter}
                        setUpdateCounter={setUpdateCounter}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                className={`inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto ${
                  isSerializedFormOpen ? "hidden" : ""
                }`}
                onClick={handleAddItem}
              >
                Add
              </button>
              <button
                type="button"
                className={`mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto ${
                  isSerializedFormOpen ? "hidden" : ""
                }`}
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SerializedModal;
