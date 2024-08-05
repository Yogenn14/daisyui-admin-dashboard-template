import React, { useState } from "react";
import axios from "axios";
import { showNotification } from "../../common/headerSlice";
import { useDispatch, useSelector } from "react-redux";

const SerializedForm = ({
  inventoryId,
  partNumber,
  partDescription,
  userEmail,
  closeModal,
  updateCounter,
  setUpdateCounter,
}) => {
  const [serialNumber, setSerialNumber] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [condition, setCondition] = useState("new");
  const [status, setStatus] = useState("");
  const [manufactureroem, setManufactureroem] = useState("");
  const [unitPrice,setUnitPrice] = useState()
  const [inDate, setInDate] = useState("");
  const [outDate, setOutDate] = useState(null);
  const [supplier, setSupplier] = useState("");
  const [customer, setCustomer] = useState("");
  const [warrantyEndDate,setwarrantyEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    const id = inventoryId;
    const newItem = {
      serialNumber,
      quantity,
      condition,
      status,
      manufactureroem,
      unitPrice,
      inDate,
      outDate,
      userEmail,
      supplier,
      customer,   
      warrantyEndDate,
    };
    console.log(newItem)
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_NODE_API_SERVER}inventory/addSerializedItem/${id}`,
        newItem,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      dispatch(
        showNotification({
          message: "Items added successfully",
          status: 1,
        })
      );
      setUpdateCounter(updateCounter + 1);
      closeModal();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
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
              <div className="mb-4">
                <label className="input input-bordered flex items-center gap-2">
                  <input
                    type="text"
                    className="grow"
                    placeholder="Serial Number"
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                  />
                </label>
              </div>

              <div className="mb-4">
                <label className="flex items-center gap-2">
                  <select
                    className="grow select select-bordered"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    required
                  >
                    <option value="new">New</option>
                    <option value="used">Used</option>
                    <option value="refurbished">Refurbished</option>
                  </select>
                </label>
              </div>
              <div className="mb-4">
                <label className="input input-bordered flex items-center gap-2">
                  <input
                    type="text"
                    className="grow"
                    placeholder="Status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    required
                  />
                </label>
              </div>
              <div className="mb-4">
                <label className="input input-bordered flex items-center gap-2">
                  <input
                    type="text"
                    className="grow"
                    placeholder="Manufacturer OEM"
                    value={manufactureroem}
                    onChange={(e) => setManufactureroem(e.target.value)}
                    required
                  />
                </label>
              </div>
              <div className="mb-4">
                <label className="input input-bordered flex items-center gap-2">
                <input
                  type="number"
                   step="0.01"
                  className="grow"
                  placeholder="Unit Price"
                  value={unitPrice}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Convert to float and handle NaN
                    setUnitPrice(value === "" ? "" : parseFloat(value));
                  }}
                  required
                />

                </label>
              </div>
              <div className="mb-4">
                <label className="input input-bordered flex items-center gap-2">
                  In Date
                  <input
                    type="date"
                    className="grow"
                    value={inDate}
                    onChange={(e) => setInDate(e.target.value)}
                    required
                  />
                </label>
              </div>

              <div className="mb-4">
                <label className="input input-bordered flex items-center gap-2">
                  Warranty End Date
                  <input
                    type="date"
                    className="grow"
                    value={warrantyEndDate}
                    onChange={(e) => setwarrantyEndDate(e.target.value)}
                    required
                  />
                </label>
              </div>

              <div className="mb-4">
                <label className="input input-bordered flex items-center gap-2">
                  <input
                    type="text"
                    className="grow"
                    placeholder="Supplier"
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                    required
                  />
                </label>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="submit"
                  className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                >
                  Add
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

export default SerializedForm;
