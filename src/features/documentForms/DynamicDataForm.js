import React, { useState } from "react";
import EmptyModalTemplate from "./EmptyModalTemplate";

const DynamicDataForm = ({ dynamicData, setDynamicData }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [additionalModal, setaddtionalModal] = useState(false);
  const [message, setMessage] = useState("");
  const [validated, setValidated] = useState(false);
  const [inventoryId, setInventoryId] = useState();
  const [newPNPD, setNewPNPD] = useState(false);
  const [item, setItem] = useState({
    partNo: "",
    description: "",
    quantity: null,
    uom: "",
    unitPrice: "",
    amount: "",
    type: "Non-Serialized",
  });

  const [additionalData, setadditionalData] = useState({
    partNumber: "",
    partDescription: "",
    quantity: "",
    uom: "",
    unitPrice: "",
    amount: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDynamicData({ ...dynamicData, [name]: value });
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setItem({ ...item, [name]: value });
  };

  const handleAdditionalItemChange = (e) => {
    const { name, value } = e.target;
    setadditionalData({ ...item, [name]: value });
  };

  const handlePOGenerate = (e) => {
    console.log("Dynamic Data", dynamicData);
  };

  const calculateAmount = () => {
    const quantity = parseFloat(item.quantity);
    const unitPrice = parseFloat(item.unitPrice);
    const amount =
      isNaN(quantity) || isNaN(unitPrice) ? 0 : quantity * unitPrice;
    setItem({ ...item, amount });
  };

  const handleAddItem = () => {
    calculateAmount();
    setDynamicData({ ...dynamicData, items: [...dynamicData.items, item] });
    setItem({
      partNo: "",
      description: "",
      quantity: "",
      uom: "",
      unitPrice: "",
      amount: "",
      type: "Non-Serialized",
    });
    setValidated(false);
    closeModal();
  };

  const validateItem = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_NODE_API_SERVER}inventory/validatePNPD`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            partNumber: item.partNo,
            partDescription: item.description,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        if (result.error === "Constraint Exist") {
          setValidated(true);
          setInventoryId(result.id);
          setItem({
            ...item,
            type: result.type || "Non-Serialized",
          });
          setMessage(
            "A unit with this part number and part description already exists in the database."
          );
        } else if (
          result.error === "Part number and part description does not exist"
        ) {
          setMessage(
            "This Part Number and Part Description constraint does not exist. Do you wish to add it into database"
          );
        }
      } else {
        setMessage(result.message || "Validation failed");
      }
    } catch (error) {
      console.error("Error validating item:", error);
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const openAdditionalModal = () => {
    setaddtionalModal(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setaddtionalModal(false);
    setValidated(false);
    setMessage("");
    setItem({
      partNo: "",
      description: "",
      quantity: "",
      uom: "",
      unitPrice: "",
      amount: "",
      type: "Non-Serialized",
    });
  };

  return (
    <div className="form-container bg-white p-4 rounded-md">
      <h2 className="text-xl mb-4">Dynamic Data</h2>
      <form>
        {/* Overview Section */}
        <div className="mb-4">
          <h3 className="text-lg font-bold mb-2">Overview</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                PO Number:
              </label>
              <input
                name="poNumber"
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={dynamicData.poNumber}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Date:
              </label>
              <input
                name="date"
                type="date"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={dynamicData.date}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Quotation Number:
              </label>
              <input
                name="quotationNumber"
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={dynamicData.quotationNumber}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Vendor Address Line 1
              </label>
              <input
                name="vendorAddressLine1"
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={dynamicData.vendorAddressLine1}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Vendor Address Line 2
              </label>
              <input
                name="vendorAddressLine2"
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={dynamicData.vendorAddressLine2}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Vendor Address Line 3
              </label>
              <input
                name="vendorAddressLine3"
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={dynamicData.vendorAddressLine3}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Vendor Address Line 4
              </label>
              <input
                name="vendorAddressLine4"
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={dynamicData.vendorAddressLine4}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Vendor Tel
              </label>
              <input
                name="vendorTel"
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={dynamicData.vendorTel}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Vendor Email
              </label>
              <input
                name="vendorEmail"
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={dynamicData.vendorEmail}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Vendor Attn
              </label>
              <input
                name="vendorAttn"
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={dynamicData.vendorAttn}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-bold mb-2">Inventory Items</h3>
        </div>

        <button type="button" onClick={openModal} className="btn btn-sm">
          Add Parts/Item
        </button>
        <button
          type="button"
          onClick={openAdditionalModal}
          className="btn btn-sm"
        >
          Add Additional Record
        </button>
      </form>

      <div className="mt-4">
        <h3 className="text-2xl mb-2 font-bold">Items List</h3>
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Part Number
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  UOM
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Quantity
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Unit Price
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dynamicData.items
                .filter((item) => item.quantity !== 0)
                .map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.partNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.uom}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.unitPrice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.amount}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalIsOpen && (
        <EmptyModalTemplate closeModal={closeModal}>
          <div className="modal-content">
            <h2 className="text-xl mb-4">Add Item</h2>
            {!validated ? (
              <>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Part Number:
                  </label>
                  <input
                    name="partNo"
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={item.partNo}
                    onChange={handleItemChange}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Description:
                  </label>
                  <input
                    name="description"
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={item.description}
                    onChange={handleItemChange}
                  />
                </div>
                <button
                  type="button"
                  onClick={validateItem}
                  className="btn btn-sm mt-4"
                >
                  Validate
                </button>

                {message && <div className="mt-2 text-red-600">{message}</div>}
              </>
            ) : (
              <>
                {message && (
                  <div className="mt-2 text-green-600">{message}</div>
                )}

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Type:
                  </label>
                  <select
                    name="type"
                    value={item.type}
                    onChange={handleItemChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="Serialized">Serialized</option>
                    <option value="Non-Serialized">Non-Serialized</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    UOM:
                  </label>
                  <input
                    name="uom"
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={item.uom}
                    onChange={handleItemChange}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Quantity:
                  </label>
                  <input
                    name="quantity"
                    type="number"
                    min="1"
                    step="1"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={item.quantity}
                    onChange={handleItemChange}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Unit Price:
                  </label>
                  <input
                    name="unitPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={item.unitPrice}
                    onChange={handleItemChange}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="btn btn-sm mt-4"
                >
                  Add Item
                </button>
              </>
            )}
          </div>
        </EmptyModalTemplate>
      )}

      {additionalModal && (
        <EmptyModalTemplate closeModal={closeModal}>
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Add Additional Data
          </h3>
          <div role="alert" className="alert shadow-md mb-4 w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-info h-6 w-6 shrink-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <div>
              <div className="text-xs">
                These data would not be included in inventory database, you can
                add data such as shipping fee, etc here.
              </div>
            </div>
          </div>
          <form>
            <div className="mb-4">
              <label
                htmlFor="partNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Part Number
              </label>
              <input
                type="text"
                name="partNumberAdditional"
                id="partNumberAdditional"
                value={additionalData.partNumberAdditional}
                onChange={handleAdditionalItemChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="partDescription"
                className="block text-sm font-medium text-gray-700"
              >
                Part Description
              </label>
              <input
                type="text"
                name="partDescriptionAdditional"
                id="partDescriptionAdditional"
                value={additionalData.partDescriptionAdditional}
                onChange={handleAdditionalItemChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="partDescription"
                className="block text-sm font-medium text-gray-700"
              >
                Quantity
              </label>
              <input
                type="text"
                name="quantityAdditional"
                id="quantityAdditional"
                value={additionalData.quantityAdditional}
                onChange={handleAdditionalItemChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="uom"
                className="block text-sm font-medium text-gray-700"
              >
                UOM
              </label>
              <input
                type="text"
                name="uomAdditional"
                id="uomAdditional"
                value={additionalData.uomAdditional}
                onChange={handleAdditionalItemChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="unitPrice"
                className="block text-sm font-medium text-gray-700"
              >
                Unit Price
              </label>
              <input
                type="number"
                name="unitPriceAdditional"
                id="unitPriceAdditional"
                value={additionalData.unitPriceAdditional}
                onChange={handleAdditionalItemChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700"
              >
                Amount
              </label>
              <input
                type="number"
                name="amountAdditional"
                id="amountAdditional"
                value={additionalData.amountAdditional}
                onChange={handleAdditionalItemChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div className="flex justify-end">
              <button type="submit" className="btn btn-sm btn-primary">
                Add Part
              </button>
            </div>
          </form>
        </EmptyModalTemplate>
      )}
      <div className="btn btn-sm mt-6" onClick={handlePOGenerate}>
        Log Data
      </div>
    </div>
  );
};

export default DynamicDataForm;
