import React, { useState, useEffect } from "react";
import { showNotification } from "../../common/headerSlice";
import { useDispatch } from "react-redux";
import UnserializedForm from "./UnserializedForm";

const UnserializedModal = ({
  closeUnserializedModal,
  userEmail,
  updateCounter,
  setUpdateCounter,
  showUpdateModal,
  setShowUpdateModal,
  conversionRate
}) => {
  const [formData, setFormData] = useState({
    partDescription: "",
    partNumber: "",
    quantity: 0,
    unitPrice: 0,
    type: "non-serialized",
    manufactureroem: "",
    condition: "NEW",
    image: "",
    status: "GMT STOCK",
    inDate: "",
    outDate: null,
    userEmail: userEmail,
    supplier: "",
    currency: "USD",
    conversionRate: 0
  });

  const [totalPrice, setTotalPrice] = useState(0);
  const [convertedUnitPrice, setConvertedUnitPrice] = useState(0);
  const [convertedTotalPrice, setConvertedTotalPrice] = useState(0);
  const [errors, setErrors] = useState({});
  const [existMessage, setExistMessage] = useState();
  const [existInvId, setExistInvId] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    setTotalPrice(formData.unitPrice * formData.quantity);
    if (formData.currency === "MYR") {
      setConvertedUnitPrice(formData.unitPrice / conversionRate);
      setConvertedTotalPrice(formData.unitPrice * formData.quantity / conversionRate);
    } else {
      setConvertedUnitPrice(0);
      setConvertedTotalPrice(0);
    }
  }, [formData.unitPrice, formData.quantity, formData.currency, conversionRate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validate = () => {
    console.log("Validating form data:", formData);
    let tempErrors = {};
    if (!formData.partDescription)
      tempErrors.partDescription = "Part Description is required";
    if (!formData.partNumber) tempErrors.partNumber = "Part Number is required";
    if (formData.quantity <= 0)
      tempErrors.quantity = "Quantity must be greater than zero";
    if (!formData.manufactureroem)
      tempErrors.manufactureroem = "Manufacturer OEM is required";
    if (!formData.status) tempErrors.status = "Status is required";
    if (!formData.inDate) tempErrors.inDate = "In Date is required";
    if (!formData.supplier) tempErrors.supplier = "Supplier is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form");
    if (validate()) {
      console.log("Form validated successfully");

      const submissionData = {
        ...formData,
        unitPrice: formData.currency === "MYR" ? convertedUnitPrice : formData.unitPrice,
        totalPrice: formData.currency === "MYR" ? convertedTotalPrice : totalPrice,
        conversionRate : formData.currency === "MYR" ? conversionRate : 0
      };
  
      console.log("Submission Data:", submissionData);
  
      try {
        const response = await fetch(
          `${process.env.REACT_APP_NODE_API_SERVER}inventory/addInventoryItem`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(submissionData),
          }
        );
  
        const data = await response.json();
        console.log("Server Response:", data);
  
        if (response.ok) {
          setUpdateCounter(updateCounter + 1);
          closeUnserializedModal();
          dispatch(
            showNotification({
              message: "Items added successfully",
              status: 1,
            })
          );
        } else {
          if (data.error && data.inventoryId) {
            setExistMessage(
              "The following unserialized item already exists in the database of GMT, please click the button to ship in more items/stock to this particular item."
            );
            setExistInvId(data.inventoryId);
          } else {
            alert(data.error || "An error occurred");
            console.error("Error adding unserialized item:", data.error);
          }
        }
      } catch (error) {
        alert("An error occurred");
        console.error("Error adding unserialized item:", error);
      }
    } else {
      console.log("Form validation failed", errors);
    }
  };
  
  const handleAddMore = () => {
    setShowUpdateModal(true);
  };

  return (
    <>
      {showUpdateModal ? (
        <UnserializedForm
          closeModal={() => setShowUpdateModal(false)}
          inventoryId={existInvId}
          partDescription={formData.partDescription}
          partNumber={formData.partNumber}
          userEmail={userEmail}
          updateCounter={updateCounter}
          setUpdateCounter={setUpdateCounter}
          closeUnserializedModal={closeUnserializedModal}
        />
      ) : (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75 overflow-y-auto">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Add New Part [UNSERIALIZED]
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm">
                  Part Description
                </label>
                <input
                  type="text"
                  name="partDescription"
                  value={formData.partDescription}
                  onChange={handleChange}
                  className="input input-bordered w-full input-xs"
                  required
                />
                {errors.partDescription && (
                  <p className="text-red-500 text-sm">
                    {errors.partDescription}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm">
                  Part Number
                </label>
                <input
                  type="text"
                  name="partNumber"
                  value={formData.partNumber}
                  onChange={handleChange}
                  className="input input-bordered w-full input-xs"
                />
                {errors.partNumber && (
                  <p className="text-red-500 text-sm">{errors.partNumber}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="input input-bordered w-full input-xs"
                  required
                />
                {errors.quantity && (
                  <p className="text-red-500 text-sm">{errors.quantity}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm">
                  Manufacturer OEM
                </label>
                <input
                  type="text"
                  name="manufactureroem"
                  value={formData.manufactureroem}
                  onChange={handleChange}
                  className="input input-bordered w-full input-xs"
                  required
                />
                {errors.manufactureroem && (
                  <p className="text-red-500 text-sm">
                    {errors.manufactureroem}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm">Condition</label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="select select-bordered w-full select-xs"
                >
                  <option value="NEW">NEW</option>
                  <option value="USED">USED</option>
                  <option value="REFURBISHED">REFURBISHED</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm">Status</label>
                <input
                  type="text"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="input input-bordered w-full input-xs"
                  required
                />
                {errors.status && (
                  <p className="text-red-500 text-sm">{errors.status}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm">In Date</label>
                <input
                  type="date"
                  name="inDate"
                  value={formData.inDate}
                  onChange={handleChange}
                  className="input input-bordered w-full input-xs"
                  required
                />
                {errors.inDate && (
                  <p className="text-red-500 text-sm">{errors.inDate}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm">Supplier</label>
                <input
                  type="text"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleChange}
                  className="input input-bordered w-full input-xs"
                  required
                />
                {errors.inDate && (
                  <p className="text-red-500 text-sm">{errors.inDate}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm">Currency</label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="select select-bordered w-full select-xs"
                >
                  <option value="USD">USD</option>
                  <option value="MYR">MYR</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm">Unit Price</label>
                <input
                  type="number"
                  name="unitPrice"
                  step="0.01"
                  value={formData.unitPrice}
                  onChange={handleChange}
                  className="input input-bordered w-full input-xs"
                  required
                />
                {errors.unitPrice && (
                  <p className="text-red-500 text-sm">{errors.unitPrice}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm">Total Price</label>
                <input
                  type="number"
                  value={totalPrice}
                  className="input input-bordered w-full input-xs"
                  disabled
                />
              </div>
              {formData.currency === "MYR" && (
                <>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm">Conversion Rate</label>
                    <input
                      type="number"
                      value={conversionRate}
                      className="input input-bordered w-full input-xs"
                      disabled
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm">Converted Unit Price</label>
                    <input
                      type="number"
                      value={convertedUnitPrice}
                      className="input input-bordered w-full input-xs"
                      disabled
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm">Converted Total Price</label>
                    <input
                      type="number"
                      value={convertedTotalPrice}
                      className="input input-bordered w-full input-xs"
                      disabled
                    />
                  </div>
                </>
              )}
              {existMessage && (
                <div role="alert" className="alert mb-2">
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
                  <span className="text-xs">{existMessage}</span>
                  <button className="btn btn-sm" onClick={handleAddMore}>
                    Add
                  </button>
                </div>
              )}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="btn btn-ghost mr-2 btn-sm"
                  onClick={closeUnserializedModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm text-white"
                  
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UnserializedModal;
