import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { showNotification } from "../common/headerSlice";

const SerialForm = ({
  inventoryId,
  partNumber,
  partDescription,
  userEmail,
  closeModal,
  updateCounter,
  setUpdateCounter,
}) => {
  const [items, setItems] = useState([
    {
      serialNumber: "",
      quantity: 1,
      condition: "new",
      status: "",
      manufactureroem: "",
      inDate: "",
      supplier: "",
      customer: "",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...items];
    newItems[index][name] = value;
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        serialNumber: "",
        quantity: items.length + 1,
        condition: "new",
        status: "",
        manufactureroem: "",
        inDate: "",
        supplier: "",
        customer: "",
      },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Here, instead of posting to the API, you handle the collected data in items
    console.log("Submitted items:", items);

    // Reset the form
    setItems([
      {
        serialNumber: "",
        quantity: 1,
        condition: "new",
        status: "",
        manufactureroem: "",
        inDate: "",
        supplier: "",
        customer: "",
      },
    ]);

    dispatch(
      showNotification({
        message: "Items added successfully",
        status: 1,
      })
    );
    setUpdateCounter(updateCounter + 1);
    closeModal();
  };

  return (
    <div
      className="card"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div>//Inv ID: {inventoryId}</div>
      <div className="sm:flex sm:items-start">
        <div className="mt-3  sm:mt-4 sm:text-left">
          <h3
            className="text-base font-semibold leading-6 text-gray-900 mt-2"
            id="modal-title"
          >
            Add Serialized Unit
          </h3>
          <div className="mt-2">
            <form onSubmit={handleSubmit}>
              {errorMessage && (
                <div
                  className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                  role="alert"
                >
                  <span className="font-medium">{errorMessage}</span>
                </div>
              )}
              {items.map((item, index) => (
                <div key={index} className="mb-4">
                  <label className="input input-bordered flex items-center gap-2">
                    Serial Number
                    <input
                      type="text"
                      className="grow"
                      name="serialNumber"
                      placeholder="Serial Number"
                      value={item.serialNumber}
                      onChange={(e) => handleInputChange(index, e)}
                      required
                    />
                  </label>

                  <label className="flex items-center gap-2 mt-2">
                    Condition
                    <select
                      className="grow select select-bordered"
                      name="condition"
                      value={item.condition}
                      onChange={(e) => handleInputChange(index, e)}
                      required
                    >
                      <option value="new">New</option>
                      <option value="used">Used</option>
                      <option value="refurbished">Refurbished</option>
                    </select>
                  </label>

                  <label className="input input-bordered flex items-center gap-2 mt-2">
                    Status
                    <input
                      type="text"
                      className="grow"
                      name="status"
                      placeholder="Status"
                      value={item.status}
                      onChange={(e) => handleInputChange(index, e)}
                      required
                    />
                  </label>

                  <label className="input input-bordered flex items-center gap-2 mt-2">
                    Manufacturer OEM
                    <input
                      type="text"
                      className="grow"
                      name="manufactureroem"
                      placeholder="Manufacturer OEM"
                      value={item.manufactureroem}
                      onChange={(e) => handleInputChange(index, e)}
                      required
                    />
                  </label>

                  <label className="input input-bordered flex items-center gap-2 mt-2">
                    In Date
                    <input
                      type="date"
                      className="grow"
                      name="inDate"
                      value={item.inDate}
                      onChange={(e) => handleInputChange(index, e)}
                      required
                    />
                  </label>

                  <label className="input input-bordered flex items-center gap-2 mt-2">
                    Supplier
                    <input
                      type="text"
                      className="grow"
                      name="supplier"
                      placeholder="Supplier"
                      value={item.supplier}
                      onChange={(e) => handleInputChange(index, e)}
                      required
                    />
                  </label>

                  <label className="input input-bordered flex items-center gap-2 mt-2">
                    Customer
                    <input
                      type="text"
                      className="grow"
                      name="customer"
                      placeholder="Customer"
                      value={item.customer}
                      onChange={(e) => handleInputChange(index, e)}
                    />
                  </label>
                </div>
              ))}

              <button
                type="button"
                className="mt-2 mb-4 inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:w-auto"
                onClick={handleAddItem}
              >
                Add Another Item
              </button>

              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="submit"
                  className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SerialForm;
