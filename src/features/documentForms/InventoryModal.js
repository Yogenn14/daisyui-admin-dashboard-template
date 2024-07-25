import React from "react";

const InventoryModal = ({ closeModal, poData }) => {
  const handleSubmit = async () => {
    const requests = poData.items.map(async (item) => {
      const serializedItem = {
        serialNumber: item.serialNumber || "N/A",
        quantity: item.quantity,
        condition: item.condition,
        status: item.status,
        manufactureroem: item.manufactureroem,
        inDate: new Date().toISOString().split("T")[0], // or use item.date if available
        outDate: null,
        userEmail: item.userEmail,
        supplier: item.supplier,
        customer: item.customer || "",
        warrantyEndDate: item.warrantyEndDate || "",
      };

      try {
        const response = await fetch("/api/inventory", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(serializedItem),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
      } catch (error) {
        console.error("Failed to add item to inventory:", error);
      }
    });

    await Promise.all(requests);
    closeModal();
  };

  return (
    <div
      className="relative z-50"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
      ></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                  <h3
                    className="text-lg leading-6 font-medium text-gray-900"
                    id="modal-title"
                  >
                    Add Items to Inventory
                  </h3>
                  <div className="mt-2">
                    {poData.items.map((item, index) => (
                      <div key={index} className="mb-4">
                        <h4 className="text-md font-medium text-gray-800">
                          Item {index + 1}
                        </h4>
                        <p>Serial Number: {item.serialNumber}</p>
                        <p>Quantity: {item.quantity}</p>
                        <p>Condition: {item.condition}</p>
                        <p>Status: {item.status}</p>
                        <p>Manufacturer/OEM: {item.manufactureroem}</p>
                        <p>Supplier: {item.supplier}</p>
                        <p>User Email: {item.userEmail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={handleSubmit}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 sm:mt-0 sm:w-auto"
              >
                Add to Inventory
              </button>
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
      </div>
    </div>
  );
};

export default InventoryModal;
