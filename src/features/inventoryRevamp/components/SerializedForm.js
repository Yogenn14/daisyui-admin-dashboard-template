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
  conversionRate,
}) => {
  const [serialNumber, setSerialNumber] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [condition, setCondition] = useState("new");
  const [status, setStatus] = useState("");
  const [manufactureroem, setManufactureroem] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [inDate, setInDate] = useState("");
  const [outDate, setOutDate] = useState(null);
  const [supplier, setSupplier] = useState("");
  const [customer, setCustomer] = useState("");
  const [warrantyEndDate, setWarrantyEndDate] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [shippingPricePerUnit, setShippingPricePerUnit] = useState("");
  const [customsPerUnit,setCustomsPerUnit] = useState("");
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
      unitPrice: currency === "MYR" ? unitPrice/conversionRate : unitPrice,
      shippingPricePerUnit: currency === "MYR" ? shippingPricePerUnit/conversionRate : shippingPricePerUnit,
      customsPerUnit: currency === "MYR" ? customsPerUnit/conversionRate : customsPerUnit,
      inDate,
      outDate,
      currency,
      conversionRate: currency === "MYR" ? conversionRate : 0,
      userEmail,
      supplier,
      customer,
      warrantyEndDate,
    };
    console.log(newItem);
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
      <div>Rate: {conversionRate}</div>

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
                <label className="input input-bordered flex items-center gap-2 input-sm">
                  <input
                    type="text"
                    className="grow input-xs input-xs"
                    placeholder="Serial Number"
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                  />
                </label>
              </div>

              <div className="mb-4">
                <label className="flex items-center gap-2 input-sm">
                  <select
                    className="grow select-sm select select-bordered"
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
                <label className="flex items-center gap-2 input-sm">
                  Currency
                  <select
                    className="grow select-sm select select-bordered"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    required
                  >
                    <option value="USD">USD</option>
                    <option value="MYR">MYR</option>
                  </select>
                </label>
              </div>

             

              <div className="mb-4">
                <label className="input input-bordered flex items-center gap-2 input-sm">
                  <input
                    type="text"
                    className="grow input-xs"
                    placeholder="Status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    required
                  />
                </label>
              </div>
              <div className="mb-4">
                <label className="input input-bordered flex items-center gap-2 input-sm">
                  <input
                    type="text"
                    className="grow input-xs"
                    placeholder="Manufacturer OEM"
                    value={manufactureroem}
                    onChange={(e) => setManufactureroem(e.target.value)}
                    required
                  />
                </label>
              </div>
              <div className="mb-4">
                <label className="input input-bordered flex items-center gap-2 input-sm">
                  <input
                    type="number"
                    step="0.01"
                    className="grow input-xs"
                    placeholder="Unit Price"
                    value={unitPrice}
                    onChange={(e) => {
                      const value = e.target.value;
                      setUnitPrice(value === "" ? "" : parseFloat(value));
                    }}
                    required
                  />
                </label>
              </div>
              <div className="mb-4">
                <label className="input input-bordered flex items-center gap-2 input-sm">
                  <input
                    type="number"
                    step="0.01"
                    className="grow input-xs"
                    placeholder="Shipping Price Per Unit"
                    value={shippingPricePerUnit}
                    onChange={(e) => {
                      const value = e.target.value;
                      setShippingPricePerUnit(value === "" ? "" : parseFloat(value));
                    }}
                    required
                  />
                </label>
              </div>
              <div className="mb-4">
                <label className="input input-bordered flex items-center gap-2 input-sm">
                  <input
                    type="number"
                    step="0.01"
                    className="grow input-xs"
                    placeholder="Customs Per Unit"
                    value={customsPerUnit}
                    onChange={(e) => {
                      const value = e.target.value;
                      setCustomsPerUnit(value === "" ? "" : parseFloat(value));
                    }}
                    required
                  />
                </label>
              </div>
              
              {currency === "MYR" && (
                <>
                  <div className="mb-4">
                    <label className="input input-bordered flex items-center gap-2 input-sm text-xs">
                      Converted Unit Price
                      <input
                        type="text"
                        className="grow input-xs"
                        value={(unitPrice / conversionRate).toFixed(2)}
                        disabled
                      />
                    </label>
                  </div>
                  <div className="mb-4">
                    <label className="input input-bordered flex items-center gap-2 input-sm text-xs">
                      Converted Shipping Price Per Unit
                      <input
                        type="text"
                        className="grow input-xs"
                        value={(shippingPricePerUnit / conversionRate).toFixed(2)}
                        disabled
                      />
                    </label>
                  </div>
                  <div className="mb-4">
                    <label className="input input-bordered flex items-center gap-2 input-sm text-xs">
                      Converted Customs Price Per Unit
                      <input
                        type="text"
                        className="grow input-xs"
                        value={(customsPerUnit / conversionRate).toFixed(2)}
                        disabled
                      />
                    </label>
                  </div>
                </>
              )}
              <div className="mb-4">
                <label className="input input-bordered flex items-center gap-2 input-sm">
                  In Date
                  <input
                    type="date"
                    className="grow input-xs"
                    value={inDate}
                    onChange={(e) => setInDate(e.target.value)}
                    required
                  />
                </label>
              </div>

              <div className="mb-4">
                <label className="input input-bordered flex items-center gap-2 input-sm">
                  Warranty End Date
                  <input
                    type="date"
                    className="grow input-xs"
                    value={warrantyEndDate}
                    onChange={(e) => setWarrantyEndDate(e.target.value)}
                    required
                  />
                </label>
              </div>

              <div className="mb-4">
                <label className="input input-bordered flex items-center gap-2 input-sm">
                  <input
                    type="text"
                    className="grow input-xs"
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
