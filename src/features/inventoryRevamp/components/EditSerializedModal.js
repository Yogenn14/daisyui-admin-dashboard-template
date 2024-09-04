import React, { useState, useEffect } from "react";
import axios from "axios";
import { showNotification } from "../../common/headerSlice";
import { useDispatch, useSelector } from "react-redux";

const EditSerializedModal = ({
  open,
  closeModal,
  selectedEditSerialized,
  handleSubmit,
  userEmail,
  conversionRate: initialConversionRate,
  updateCounter,
  setUpdateCounter,
}) => {
  const [formData, setFormData] = useState({
    serialNumber: selectedEditSerialized.serialNumber || "",
    quantity: selectedEditSerialized.quantity || 1,
    condition: selectedEditSerialized.condition || "",
    status: selectedEditSerialized.status || "",
    unitPrice: selectedEditSerialized.unitPrice || "",
    shippingPricePerUnit: selectedEditSerialized.shippingPricePerUnit || "",
    customsPerUnit: selectedEditSerialized.customsPerUnit || "",
    manufacturer: selectedEditSerialized.manufacturer || "",
    inDate: selectedEditSerialized.inDate || "",
    outDate: selectedEditSerialized.outDate || null,
    paymentDate: selectedEditSerialized.paymentDate || null,
    userEmail: userEmail,
    supplier: selectedEditSerialized.supplier || "",
    customer: selectedEditSerialized.customer || null,
    warrantyEndDate: selectedEditSerialized.warrantyEndDate || "",
    currency: selectedEditSerialized.currency || "MYR", // Default to MYR
    conversionRate: initialConversionRate || 0,
    sellingPrice: selectedEditSerialized.sellingPrice || null,
  });

  useEffect(() => {
    if (formData.currency === "USD") {
      setFormData((prevState) => ({
        ...prevState,
        conversionRate: 0,
      }));
    } else if (formData.currency === "MYR") {
      setFormData((prevState) => ({
        ...prevState,
        conversionRate: initialConversionRate || 0,
      }));
    }
  }, [formData.currency, initialConversionRate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const dispatch = useDispatch();

  const onSubmit = async () => {
    //console.log("body", formData);

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_NODE_API_SERVER}inventory/editSerialized/${selectedEditSerialized.inventoryId}/${selectedEditSerialized.id}`,
        formData
      );

      dispatch(
        showNotification({
          message: "Updated Successfully",
          status: 1,
        })
      );
      setUpdateCounter(updateCounter + 1);
      closeModal();
      // Optionally, update the modal with the response data if needed
    } catch (error) {
      // Determine the error message to display
      const errorMessage = error.response?.data?.error || "Error Updating";

      dispatch(
        showNotification({
          message: errorMessage,
          status: 0,
        })
      );
      closeModal();
      setUpdateCounter(updateCounter + 1);
      console.error("Error updating serialized item:", error);
    }
  };

  return (
    <div
      className={`relative z-50 ${open ? "block" : "hidden"}`}
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
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3
                    className="text-base font-semibold leading-6 text-gray-900"
                    id="modal-title"
                  >
                    Edit Serialized Item{" "}
                    <p>
                      {formData.serialId} {formData.inventoryId}
                    </p>
                  </h3>
                  <div className="mt-2">
                    <form>
                      <label>Serial Number</label>
                      <input
                        type="text"
                        name="serialNumber"
                        value={formData.serialNumber}
                        onChange={handleInputChange}
                        className="border w-full p-2 mb-2"
                      />
                      <label>Condition</label>
                      <select
                        name="condition"
                        value={formData.condition}
                        onChange={handleInputChange}
                        className="border w-full p-2 mb-2"
                      >
                        <option value="New">New</option>
                        <option value="Used">Used</option>
                        <option value="Refurb">Refurb</option>
                      </select>
                      <label>Status</label>
                      <input
                        type="text"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="border w-full p-2 mb-2"
                      />
                      <label>Manufacturer OEM</label>
                      <input
                        type="text"
                        name="manufactureroem"
                        value={formData.manufacturer}
                        onChange={handleInputChange}
                        className="border w-full p-2 mb-2"
                      />
                      <label>Supplier</label>
                      <input
                        type="text"
                        name="supplier"
                        value={formData.supplier}
                        onChange={handleInputChange}
                        className="border w-full p-2 mb-2"
                      />
                      <label>In Date</label>
                      <input
                        type="date"
                        name="inDate"
                        value={formData.inDate}
                        onChange={handleInputChange}
                        className="border w-full p-2 mb-2"
                      />
                      <label>Warranty End Date</label>
                      <input
                        type="date"
                        name="warrantyEndDate"
                        value={formData.warrantyEndDate}
                        onChange={handleInputChange}
                        className="border w-full p-2 mb-2"
                      />
                      <label>Currency</label>
                      <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleInputChange}
                        className="border w-full p-2 mb-2"
                      >
                        <option value="MYR">MYR</option>
                        <option value="USD">USD</option>
                      </select>
                      <label>Unit Price (USD)</label>
                      <input
                        type="number"
                        name="unitPrice"
                        value={formData.unitPrice}
                        onChange={handleInputChange}
                        className="border w-full p-2 mb-2"
                      />
                      <label>Shipping Price Per Unit (USD)</label>
                      <input
                        type="number"
                        name="shippingPricePerUnit"
                        value={formData.shippingPricePerUnit}
                        onChange={handleInputChange}
                        className="border w-full p-2 mb-2"
                      />
                      <label>Customs Per Unit (USD)</label>
                      <input
                        type="number"
                        name="customsPerUnit"
                        value={formData.customsPerUnit}
                        onChange={handleInputChange}
                        className="border w-full p-2 mb-2"
                      />
                      {formData.outDate && (
                        <>
                          <label>Customer</label>
                          <input
                            type="text"
                            name="customer"
                            value={formData.customer}
                            onChange={handleInputChange}
                            className="border w-full p-2 mb-2"
                          />
                          <label>Payment Date</label>
                          <input
                            type="date"
                            name="paymentDate"
                            value={formData.paymentDate}
                            onChange={handleInputChange}
                            className="border w-full p-2 mb-2"
                          />
                          <label>Selling Price (USD)</label>
                          <input
                            type="number"
                            name="sellingPrice"
                            value={formData.sellingPrice || ""}
                            onChange={handleInputChange}
                            className="border w-full p-2 mb-2"
                          />
                        </>
                      )}
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                onClick={onSubmit}
              >
                Save
              </button>
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
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

export default EditSerializedModal;
