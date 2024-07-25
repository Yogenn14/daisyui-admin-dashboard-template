import React, { useState } from "react";

const ShipOutUnsModal = ({
  open,
  setshipOutUnsModal,
  selectedUnsInvId,
  outunsID,
}) => {
  const handleClose = () => {
    setshipOutUnsModal(false);
  };

  const [shipments, setShipments] = useState([{ customer: "", quantity: 0 }]);
  const [date, setDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const list = [...shipments];
    list[index][name] = value;
    setShipments(list);
  };

  const handleAddCustomer = () => {
    setShipments([...shipments, { customer: "", quantity: 0 }]);
  };

  const handleRemoveCustomer = (index) => {
    const list = [...shipments];
    list.splice(index, 1);
    setShipments(list);
  };

  const handleSubmit = async () => {
    const payload = {
      shipments: shipments.map((shipment) => ({
        unserializedInId: outunsID,
        quantity: parseInt(shipment.quantity),
        customer: shipment.customer,
        date: date,
      })),
    };
    console.log("Payload to be sent:", JSON.stringify(payload));
    console.log("Inv ID", selectedUnsInvId);

    try {
      const response = await fetch(
        `http://localhost:8083/api/inventory/shipOutUnserialized/${selectedUnsInvId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      const data = await response.json();
      console.log("Successfully shipped out:", data);
      setshipOutUnsModal(false);
    } catch (error) {
      console.error("Error shipping out:", error);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className={`relative z-50 ${open ? "block" : "hidden"}`}>
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
      ></div>
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
                    Ship out items for ID: {outunsID}
                  </h3>
                  <div className="mt-4">
                    {errorMessage && (
                      <div
                        className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                        role="alert"
                      >
                        <span className="font-medium">Error:</span>{" "}
                        {errorMessage}
                      </div>
                    )}
                    <label className="block text-sm font-medium text-gray-700">
                      Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-indigo-500 mb-4"
                    />
                    {shipments.map((shipment, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 mb-2"
                      >
                        <input
                          type="text"
                          name="customer"
                          placeholder="Customer name"
                          value={shipment.customer}
                          onChange={(e) => handleInputChange(index, e)}
                          className="border border-gray-300 rounded-md px-3 py-2 w-1/2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        <input
                          type="number"
                          name="quantity"
                          placeholder="Quantity"
                          value={shipment.quantity}
                          onChange={(e) => handleInputChange(index, e)}
                          className="border border-gray-300 rounded-md px-3 py-2 w-1/4 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveCustomer(index)}
                          className="text-red-600 hover:text-red-700 focus:outline-none"
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddCustomer}
                      className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Add Customer
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex justify-center w-full rounded-md bg-indigo-600 text-white px-4 py-2 text-sm font-semibold shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
              >
                Ship Out
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="mt-3 inline-flex justify-center w-full rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
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

export default ShipOutUnsModal;
