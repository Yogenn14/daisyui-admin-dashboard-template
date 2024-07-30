import React, { useState } from "react";

const ConfirmationModal = ({ poData, bulkItem, userEmail, closeModal }) => {
  const [bulkAddResponse, setBulkAddResponse] = useState(null);
  const [generatePoResponse, setGeneratePoResponse] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inventorySuccess, setInventorySuccess] = useState(false);
  const [inventoryFailed, setInventoryFailed] = useState(false);
  const [poSuccess, setPoSuccess] = useState(false);
  const [poFailed, setPoFailed] = useState(false);

  const parseBulkItem = (item) => ({
    ...item,
    inventoryId: Number(item.inventoryId),
    outDate: item.outDate === "" ? null : item.outDate
  });

  const parsedBulkItem = {
    ...bulkItem,
    items: bulkItem.items.map(parseBulkItem)
  };

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    setInventorySuccess(false);
    setInventoryFailed(false);
    setPoSuccess(false);
    setPoFailed(false);
    try {
      const bulkAddResponse = await fetch(`${process.env.REACT_APP_NODE_API_SERVER}inventory/bulkAddInv`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedBulkItem),
      });
      const bulkAddResult = await bulkAddResponse.json();
      if (bulkAddResponse.ok) {
        setInventorySuccess(true);
      } else {
        setInventoryFailed(true);
        setError(bulkAddResult.message || "Error adding inventory items.");
      }
      setBulkAddResponse(bulkAddResult);

      const generatePoResponse = await fetch(`${process.env.REACT_APP_NODE_API_SERVER}po/generate-po`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(poData),
      });
      if (generatePoResponse.ok) {
        const blob = await generatePoResponse.blob();
        const pdfUrl = URL.createObjectURL(blob);
        setPdfUrl(pdfUrl);
        setPoSuccess(true);
      } else {
        const errorResult = await generatePoResponse.json();
        setPoFailed(true);
        setError(errorResult.message || "Error generating PO.");
      }
    } catch (error) {
      setError("Error making API requests");
      console.error("Error making API requests:", error);
    } finally {
      setLoading(false);
    }
  };

  // Assuming bulkItem is an object with an "items" property that is an array of objects
  const bulkItems = parsedBulkItem.items;
  const bulkHeaders = Object.keys(bulkItems[0]);

  // Extract poData keys for display in list view
  const poDataKeys = Object.keys(poData).filter((key) => key !== "items");

  // Extract poData items for display in a table
  const poItems = poData.items;
  const poHeaders = Object.keys(poItems[0]);

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
                  <div className="badge badge-outline">STEP 3 </div>  Final Confirmation
                  </h3>
                  <div className="mt-2">
                    <h4 className="text-md font-semibold text-gray-700">PO Data:</h4>
                    <ul className="text-sm text-gray-500">
                      {poDataKeys.map((key, index) => (
                        <li key={index}>
                          <strong>{key}:</strong> {poData[key]}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-md font-semibold text-gray-700">PO Items:</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            {poHeaders.map((header, index) => (
                              <th key={index} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {poItems.map((item, rowIndex) => (
                            <tr key={rowIndex}>
                              {poHeaders.map((header, colIndex) => (
                                <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {item[header]}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-md font-semibold text-gray-700">Bulk Inventory Items:</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            {bulkHeaders.map((header, index) => (
                              <th key={index} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {bulkItems.map((item, rowIndex) => (
                            <tr key={rowIndex}>
                              {bulkHeaders.map((header, colIndex) => (
                                <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {item[header]}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="mt-2">
                    <h4 className="text-md font-semibold text-gray-700">User Email:</h4>
                    <p className="text-sm text-gray-500">{userEmail}</p>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-md font-semibold text-gray-700">Results:</h4>
                    {loading ? (
                      <p className="text-sm text-gray-500">Loading...</p>
                    ) : (
                      <div>
                        {inventorySuccess && (
                          <div className="flex items-center p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50" role="alert">
                            <svg className="flex-shrink-0 inline w-4 h-4 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                            </svg>
                            <span className="sr-only">Info</span>
                            <div>
                              <span className="font-medium">Successfully added item to inventory!</span>
                            </div>
                          </div>
                        )}
                        {inventoryFailed && (
                          <div className="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
                            <svg className="flex-shrink-0 inline w-4 h-4 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                            </svg>
                            <span className="sr-only">Info</span>
                            <div>
                              <span className="font-medium">Error adding inventory item:</span> {error}. None of the item(s) has been added to inventory database
                            </div>
                          </div>
                        )}
                        {poSuccess && (
                          <div className="flex items-center p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50" role="alert">
                            <svg className="flex-shrink-0 inline w-4 h-4 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                            </svg>
                            <span className="sr-only">Info</span>
                            <div>
                              <span className="font-medium">Successfully created PO!</span>
                              {pdfUrl && (
                                <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 underline ml-2">
                                  View Generated PO PDF
                                </a>
                              )}
                            </div>
                          </div>
                        )}
                        {poFailed && (
                          <div className="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
                            <svg className="flex-shrink-0 inline w-4 h-4 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                            </svg>
                            <span className="sr-only">Info</span>
                            <div>
                              <span className="font-medium">Error generating PO:</span> {error} . 
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-x-4">
              <button
                type="button"
                onClick={handleConfirm}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Confirm
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

export default ConfirmationModal;
