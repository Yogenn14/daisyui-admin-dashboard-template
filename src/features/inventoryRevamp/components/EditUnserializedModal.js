import React, { useState, useEffect } from "react";
import axios from "axios";
import { showNotification } from "../../common/headerSlice";
import { useDispatch, useSelector } from "react-redux";

const EditUnserializedModal = ({
  updateCounter,
  setUpdateCounter,
  selectedEditUnserialziedModal,
  onClose,
  onSave,
  conversionRate: initialConversionRate,
}) => {
  const [formData, setFormData] = useState({
    date: selectedEditUnserialziedModal?.date || "",
    totalPurchased: selectedEditUnserialziedModal?.totalPurchased || 0,
    supplier: selectedEditUnserialziedModal?.supplier || "",
    manufactureroem: selectedEditUnserialziedModal?.manufacturer || "",
    condition: selectedEditUnserialziedModal?.condition || "",
    status: selectedEditUnserialziedModal?.status || "",
    userEmail: selectedEditUnserialziedModal?.userEmail || "",
    currency: selectedEditUnserialziedModal?.currency || "USD",
    conversionRate: initialConversionRate || 1.0,
    unitPrice: selectedEditUnserialziedModal?.unitPrice || 0.0,
    shippingPriceBatch: selectedEditUnserialziedModal?.shippingPerBatch || 0.0,
    customsPerBatch: selectedEditUnserialziedModal?.customsPerBatch || 0.0,
    totalPrice: selectedEditUnserialziedModal?.totalPrice || 0,
  });
  const dispatch = useDispatch();

  useEffect(() => {
    const updatedTotalPrice =
      parseFloat(formData.totalPurchased) * parseFloat(formData.unitPrice);

    if (formData.currency === "MYR") {
      setFormData((prevData) => ({
        ...prevData,
        conversionRate: initialConversionRate,
        totalPrice: updatedTotalPrice,
      }));
    } else if (formData.currency === "USD") {
      setFormData((prevData) => ({
        ...prevData,
        conversionRate: 0,
        totalPrice: updatedTotalPrice,
      }));
    }
  }, [formData.currency, formData.totalPurchased, formData.unitPrice]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    console.log("form", formData);

    // Check if the selected currency is MYR
    if (formData.currency === "MYR") {
      // Calculate the converted total price
      const convertedTotalPrice = formData.totalPrice / formData.conversionRate;
      const convertedShippingPrice =
        formData.shippingPriceBatch / formData.conversionRate;
      const convertedCustomPrice =
        formData.customsPerBatch / formData.conversionRate;
      const convertedUnitPrice = formData.unitPrice / formData.conversionRate;
      formData.totalPrice = convertedTotalPrice;
      formData.shippingPriceBatch = convertedShippingPrice;
      formData.customsPerBatch = convertedCustomPrice;
      formData.unitPrice = convertedUnitPrice;
    }

    try {
      await axios.put(
        `${process.env.REACT_APP_NODE_API_SERVER}inventory/editUnserialized/${selectedEditUnserialziedModal.inventoryId}/${selectedEditUnserialziedModal.unsID}`,
        formData
      );
      dispatch(
        showNotification({
          message: "Updated Successfully",
          status: 1,
        })
      );
      setUpdateCounter(updateCounter + 1);
      onClose();
    } catch (error) {
      console.error("Error updating unserialized item:", error);
      dispatch(
        showNotification({
          message: "Error updating unserialized item",
          status: 0,
        })
      );
    }
  };

  const convertedUnitPrice =
    formData.currency === "MYR" && formData.conversionRate > 0
      ? formData.unitPrice / formData.conversionRate
      : formData.unitPrice;

  const convertedTotalPrice =
    formData.currency === "MYR" && formData.conversionRate > 0
      ? formData.totalPrice / formData.conversionRate
      : formData.totalPrice;

  const convertedCustomPrice =
    formData.currency === "MYR" && formData.conversionRate > 0
      ? formData.customsPerBatch / formData.conversionRate
      : formData.customsPerBatch;

  const convertedShippingPrice =
    formData.currency === "MYR" && formData.conversionRate > 0
      ? formData.shippingPriceBatch / formData.conversionRate
      : formData.shippingPriceBatch;

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
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3
                    className="text-base font-semibold leading-6 text-gray-900"
                    id="modal-title"
                  >
                    Edit Unserialized Item {formData.id}
                    {formData.unserialId}
                  </h3>
                  <div className="mt-2">
                    <form className="space-y-4">
                      {/* Form fields */}
                      <div>
                        <label
                          htmlFor="quantityChange"
                          className="block text-sm mb-2 text-gray-700"
                        >
                          Total Purchased
                        </label>
                        <input
                          type="number"
                          name="totalPurchased"
                          id="totalPurchased"
                          value={formData.totalPurchased}
                          onChange={handleChange}
                          className="input input-bordered input-sm"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="date"
                          className="block text-sm mb-2 text-gray-700"
                        >
                          Date
                        </label>
                        <input
                          type="date"
                          name="date"
                          id="date"
                          value={formData.date}
                          onChange={handleChange}
                          className="input input-bordered input-sm"
                          required
                        />
                      </div>

                      {/* Supplier */}
                      <div>
                        <label
                          htmlFor="supplier"
                          className="block text-sm mb-2 text-gray-700"
                        >
                          Supplier
                        </label>
                        <input
                          type="text"
                          name="supplier"
                          id="supplier"
                          value={formData.supplier}
                          onChange={handleChange}
                          className="input input-bordered input-sm"
                          required
                        />
                      </div>

                      {/* Manufacturer OEM */}
                      <div>
                        <label
                          htmlFor="manufactureroem"
                          className="block text-sm mb-2 text-gray-700"
                        >
                          Manufacturer OEM
                        </label>
                        <input
                          type="text"
                          name="manufactureroem"
                          id="manufactureroem"
                          value={formData.manufactureroem}
                          onChange={handleChange}
                          className="input input-bordered input-sm"
                          required
                        />
                      </div>

                      {/* Condition */}
                      <div>
                        <label
                          htmlFor="condition"
                          className="block text-sm mb-2 text-gray-700"
                        >
                          Condition
                        </label>
                        <select
                          name="condition"
                          id="condition"
                          value={formData.condition}
                          onChange={handleChange}
                          className="input input-bordered input-sm"
                          required
                        >
                          <option value="New">New</option>
                          <option value="Used">Used</option>
                        </select>
                      </div>

                      {/* Status */}
                      <div>
                        <label
                          htmlFor="status"
                          className="block text-sm mb-2 text-gray-700"
                        >
                          Status
                        </label>
                        <input
                          type="text"
                          name="status"
                          id="status"
                          value={formData.status}
                          onChange={handleChange}
                          className="input input-bordered input-sm"
                          required
                        />
                      </div>

                      {/* Currency */}
                      <div>
                        <label
                          htmlFor="currency"
                          className="block text-sm mb-2 text-gray-700"
                        >
                          Currency
                        </label>
                        <select
                          name="currency"
                          id="currency"
                          value={formData.currency}
                          onChange={handleChange}
                          className="input input-bordered input-sm"
                          required
                        >
                          <option value="USD">USD</option>

                          <option value="MYR">MYR</option>
                          {/* Add more currencies as needed */}
                        </select>
                      </div>

                      {/* Conversion Rate */}
                      <div>
                        <label
                          htmlFor="conversionRate"
                          className="block text-sm mb-2 text-gray-700"
                        >
                          Conversion Rate
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          name="conversionRate"
                          id="conversionRate"
                          value={formData.conversionRate}
                          className="input input-bordered input-sm"
                          disabled
                        />
                      </div>

                      {/* Unit Price */}
                      <div>
                        <label
                          htmlFor="unitPrice"
                          className="block text-sm mb-2 text-gray-700"
                        >
                          Unit Price
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          name="unitPrice"
                          id="unitPrice"
                          value={formData.unitPrice}
                          onChange={handleChange}
                          className="input input-bordered input-sm"
                          required
                        />
                      </div>

                      {/* Converted Unit Price */}
                      {formData.currency === "MYR" && (
                        <div>
                          <label
                            htmlFor="convertedUnitPrice"
                            className="block text-sm mb-2 text-gray-700"
                          >
                            Converted Unit Price
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            name="convertedUnitPrice"
                            id="convertedUnitPrice"
                            value={convertedUnitPrice}
                            className="input input-bordered input-sm"
                            disabled
                          />
                        </div>
                      )}

                      {/* Shipping Price per Batch */}
                      <div>
                        <label
                          htmlFor="shippingPriceBatch"
                          className="block text-sm mb-2 text-gray-700"
                        >
                          Shipping Price per Batch
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          name="shippingPriceBatch"
                          id="shippingPriceBatch"
                          value={formData.shippingPriceBatch}
                          onChange={handleChange}
                          className="input input-bordered input-sm"
                          required
                        />
                      </div>

                      {/* Customs per Batch */}
                      <div>
                        <label
                          htmlFor="customsPerBatch"
                          className="block text-sm mb-2 text-gray-700"
                        >
                          Customs per Batch
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          name="customsPerBatch"
                          id="customsPerBatch"
                          value={formData.customsPerBatch}
                          onChange={handleChange}
                          className="input input-bordered input-sm"
                          required
                        />
                      </div>

                      {/* Total Price */}
                      <div>
                        <label
                          htmlFor="totalPrice"
                          className="block text-sm mb-2 text-gray-700"
                        >
                          Total Price
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          name="totalPrice"
                          id="totalPrice"
                          value={formData.totalPrice}
                          className="input input-bordered input-sm"
                          disabled
                        />
                      </div>

                      {formData.currency === "MYR" && (
                        <>
                          <div>
                            <label
                              htmlFor="convertedTotalPrice"
                              className="block text-sm mb-2 text-gray-700"
                            >
                              Converted Total Price
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              name="convertedTotalPrice"
                              id="convertedTotalPrice"
                              value={convertedTotalPrice}
                              className="input input-bordered input-sm"
                              disabled
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="convertedTotalPrice"
                              className="block text-sm mb-2 text-gray-700"
                            >
                              Converted Shipping Price
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              name="convertedShippingPrice"
                              id="convertedShippingPrice"
                              value={convertedShippingPrice}
                              className="input input-bordered input-sm"
                              disabled
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="convertedTotalPrice"
                              className="block text-sm mb-2 text-gray-700"
                            >
                              Converted Customs Price
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              name="convertedCustomPrice"
                              id="convertedCustomPrice"
                              value={convertedCustomPrice}
                              className="input input-bordered input-sm"
                              disabled
                            />
                          </div>
                        </>
                      )}
                      <div className="sm:flex sm:flex-row-reverse mt-4">
                        <button
                          type="button"
                          onClick={handleSubmit}
                          className="inline-flex w-full justify-center rounded-md bg-blue-600 px-4 py-2 text-base font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={onClose}
                          className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-semibold text-gray-700 shadow-sm hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUnserializedModal;
