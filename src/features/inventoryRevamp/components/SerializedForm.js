import React, { useState } from "react";
import axios from "axios";
import { showNotification } from "../../common/headerSlice";
import { useDispatch } from "react-redux";

const SerializedForm = ({
  inventoryId,
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
  const [customsPerUnit, setCustomsPerUnit] = useState("");
  const [image, setImage] = useState(null); // State for the image
  const [imagePreview, setImagePreview] = useState(null); // State for the image preview
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    // Generate a preview URL for the image
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null); // Reset preview if no file is selected
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const id = inventoryId;

    // Create a new FormData object
    const formData = new FormData();
    formData.append("serialNumber", serialNumber);
    formData.append("quantity", quantity);
    formData.append("condition", condition);
    formData.append("status", status);
    formData.append("manufactureroem", manufactureroem);
    formData.append(
      "unitPrice",
      currency === "MYR" ? unitPrice / conversionRate : unitPrice
    );
    formData.append(
      "shippingPricePerUnit",
      currency === "MYR"
        ? shippingPricePerUnit / conversionRate
        : shippingPricePerUnit
    );
    formData.append(
      "customsPerUnit",
      currency === "MYR" ? customsPerUnit / conversionRate : customsPerUnit
    );
    formData.append("inDate", inDate);
    formData.append("currency", currency);
    formData.append("conversionRate", currency === "MYR" ? conversionRate : 0);
    formData.append("userEmail", userEmail);
    formData.append("supplier", supplier);
    formData.append("customer", customer);
    formData.append("warrantyEndDate", warrantyEndDate);
    if (image) {
      formData.append("image", image);
    }
    try {
      console.log("FormData contents:");
      formData.forEach((value, key) => {
        console.log(key, value);
      });
      const response = await axios.post(
        `${process.env.REACT_APP_NODE_API_SERVER}inventory/addSerializedItem/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
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
                    className="grow  input-xs"
                    placeholder="Serial Number"
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    required
                  />
                </label>
              </div>
              <div className="mb-4">
                <label className="input input-bordered flex items-center gap-2 input-sm">
                  In Date
                  <input
                    type="date"
                    className="grow  input-xs"
                    placeholder="In Date"
                    value={inDate}
                    onChange={(e) => setInDate(e.target.value)}
                  />
                </label>
              </div>
              <div className="mb-4">
                <label className="input input-bordered flex items-center gap-2 input-sm">
                  Warranty End Date
                  <input
                    type="date"
                    className="grow  input-xs"
                    placeholder="Warranty End Date"
                    value={warrantyEndDate}
                    onChange={(e) => setWarrantyEndDate(e.target.value)}
                  />
                </label>
              </div>

              <div className="mb-4">
                <label className="input input-bordered flex items-center gap-2 input-sm">
                  <input
                    type="text"
                    className="grow  input-xs"
                    placeholder="Supplier"
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
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
                      setShippingPricePerUnit(
                        value === "" ? "" : parseFloat(value)
                      );
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
                        value={(shippingPricePerUnit / conversionRate).toFixed(
                          2
                        )}
                        disabled
                      />
                    </label>
                  </div>
                  <div className="mb-4">
                    <label className="input input-bordered flex items-center gap-2 input-sm text-xs">
                      Converted Customs Per Unit
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

              {/* New image input */}
              <div className="mb-4">
                <label className=" flex items-center gap-2 input-sm">
                  <input
                    type="file"
                    className="file-input input-bordered file-input-sm"
                    onChange={handleImageChange}
                    accept="image/*" // Optional: restrict to image files
                  />
                </label>
              </div>

              {/* Image preview */}
              {imagePreview && (
                <div className="mb-4">
                  <img
                    src={imagePreview}
                    alt="Image Preview"
                    className="rounded-md border-2 border-gray-300 max-h-48"
                  />
                </div>
              )}

              <button
                type="submit"
                className={`${
                  isLoading ? "loading" : ""
                } btn btn-sm btn-primary`}
              >
                Add Serialized Unit
              </button>

              <button className="btn btn-sm ml-2" onClick={closeModal}>
                Close
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SerializedForm;
