import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { showNotification } from "../../common/headerSlice";

const UnserializedForm = ({
  closeModal,
  inventoryId,
  partDescription,
  partNumber,
  userEmail,
  updateCounter,
  setUpdateCounter,
  closeUnserializedModal,
  conversionRate,
}) => {
  const [formData, setFormData] = useState({
    quantityChange: 0,
    manufactureroem: "",
    condition: "NEW",
    status: "GMT STOCK",
    date: "",
    userEmail: userEmail,
    supplier: "",
    currency: "USD",
    unitPrice: 0,
  });
  const [errors, setErrors] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [convertedUnitPrice, setConvertedUnitPrice] = useState(0);
  const [convertedTotalPrice, setConvertedTotalPrice] = useState(0);
  const [convertedcustomsPrice, setConvertedCustomsPrice] = useState(0);
  const [convertedshippingPrice, setConvertedShippingPrice] = useState(0);

  const dispatch = useDispatch();

  useEffect(() => {
    const price = formData.unitPrice * formData.quantityChange;
    setTotalPrice(price);

    if (formData.currency === "MYR") {
      setConvertedUnitPrice(formData.unitPrice / conversionRate);
      setConvertedTotalPrice(price / conversionRate);
      setConvertedCustomsPrice(formData.customsPerBatch / conversionRate);
      setConvertedShippingPrice(formData.shippingPriceBatch / conversionRate);
    } else {
      setConvertedUnitPrice(0);
      setConvertedTotalPrice(0);
    }
  }, [
    formData.unitPrice,
    formData.quantityChange,
    formData.currency,
    conversionRate,
    formData.customsPerBatch,
    formData.shippingPriceBatch,
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "quantityChange" ? Number(value) : value,
    }));
  };

  const validate = () => {
    let tempErrors = {};
    if (formData.quantityChange <= 0)
      tempErrors.quantityChange = "Quantity Change must be greater than zero";
    if (!formData.date) tempErrors.date = "Date is required";
    if (!formData.supplier) tempErrors.supplier = "Supplier is required";
    if (!formData.manufactureroem)
      tempErrors.manufactureroem = "Manufacturer OEM is required";
    if (!formData.condition) tempErrors.condition = "Condition is required";
    if (!formData.status) tempErrors.status = "Status is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Ensure form submission is prevented

    if (validate()) {
      try {
        const formDataToSubmit = new FormData();

        // Append form fields to FormData
        formDataToSubmit.append("quantityChange", formData.quantityChange);
        formDataToSubmit.append("manufactureroem", formData.manufactureroem);
        formDataToSubmit.append("condition", formData.condition);
        formDataToSubmit.append("status", formData.status);
        formDataToSubmit.append("date", formData.date);
        formDataToSubmit.append("userEmail", formData.userEmail);
        formDataToSubmit.append("supplier", formData.supplier);
        formDataToSubmit.append("currency", formData.currency);
        formDataToSubmit.append(
          "unitPrice",
          formData.currency === "MYR" ? convertedUnitPrice : formData.unitPrice
        );
        formDataToSubmit.append(
          "totalPrice",
          formData.currency === "MYR" ? convertedTotalPrice : totalPrice
        );
        formDataToSubmit.append(
          "conversionRate",
          formData.currency === "MYR" ? conversionRate[0] : 0
        );
        formDataToSubmit.append(
          "shippingPriceBatch",
          formData.currency === "MYR"
            ? convertedshippingPrice
            : formData.shippingPriceBatch
        );
        formDataToSubmit.append(
          "customsPerBatch",
          formData.currency === "MYR"
            ? convertedcustomsPrice
            : formData.customsPerBatch
        );

        // Append the image file if selected
        if (image) {
          formDataToSubmit.append("image", image);
        }
        if (formData.warrantyEndDate) {
          formDataToSubmit.append("warrantyEndDate", formData.warrantyEndDate);
        }

        const response = await fetch(
          `${process.env.REACT_APP_NODE_API_SERVER}inventory/addUnserializedItem/${inventoryId}`,
          {
            method: "POST",
            body: formDataToSubmit,
          }
        );
        const data = await response.json();
        if (response.ok) {
          closeModal();
          dispatch(
            showNotification({
              message: "Inventory updated successfully",
              status: 1,
            })
          );
          setUpdateCounter(updateCounter + 1);
        } else {
          dispatch(
            showNotification({
              message: "Error updating inventory",
              status: 0,
            })
          );
          console.log(response, "error");
        }
      } catch (error) {
        dispatch(
          showNotification({
            message: `Error updating inventory`,
            status: 0,
          })
        );
        console.log(error, "error");
      } finally {
        // Optionally close modal if needed
        // closeUnserializedModal();
      }
    }
  };

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);

      // Create a preview URL for the selected image
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75 overflow-y-auto">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg max-h-screen p-4 overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Item in (Unserialized)
        </h3>
        <p>Part Num : {partNumber}</p>
        <p>Part Desc : {partDescription}</p>
        <p>Inventory ID : {inventoryId}</p>

        <form onSubmit={handleSubmit}>
          {" "}
          {/* Ensure onSubmit handler is attached */}
          <div className="mb-4 mt-2">
            <label className="block text-gray-700 text-sm">
              Total Purchased Quantity
            </label>
            <input
              type="number"
              name="quantityChange"
              value={formData.quantityChange}
              onChange={handleChange}
              className="input input-bordered w-full input-xs"
              required
            />
            {errors.quantityChange && (
              <p className="text-red-500 text-sm">{errors.quantityChange}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="input input-bordered w-full input-xs"
              required
            />
            {errors.date && (
              <p className="text-red-500 text-sm">{errors.date}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm">
              Warranty End Date
            </label>
            <input
              type="date"
              name="warrantyEndDate"
              value={formData.warrantyEndDate}
              onChange={handleChange}
              className="input input-bordered w-full input-xs"
            />
            {errors.date && (
              <p className="text-red-500 text-sm">{errors.date}</p>
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
            {errors.supplier && (
              <p className="text-red-500 text-sm">{errors.supplier}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm">Upload Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input input-bordered w-full input-xs"
            />
          </div>
          {imagePreview && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm">
                Image Preview
              </label>
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-auto border border-gray-300 rounded"
              />
            </div>
          )}
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
              <p className="text-red-500 text-sm">{errors.manufactureroem}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm">Condition</label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="select select-bordered w-full select-xs"
              required
            >
              <option value="NEW">NEW</option>
              <option value="USED">USED</option>
              <option value="REFURBISHED">REFURBISHED</option>
            </select>
            {errors.condition && (
              <p className="text-red-500 text-sm">{errors.condition}</p>
            )}
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
            <label className="block text-gray-700 text-sm">
              Shipping Price Per Batch
            </label>
            <input
              type="number"
              name="shippingPriceBatch"
              step="0.01"
              value={formData.shippingPriceBatch}
              onChange={handleChange}
              className="input input-bordered w-full input-xs"
              required
            />
            {errors.shippingPriceBatch && (
              <p className="text-red-500 text-sm">
                {errors.shippingPriceBatch}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm">
              Customs Price Per Batch
            </label>
            <input
              type="number"
              name="customsPerBatch"
              step="0.01"
              value={formData.customsPerBatch}
              onChange={handleChange}
              className="input input-bordered w-full input-xs"
              required
            />
            {errors.customsPerBatch && (
              <p className="text-red-500 text-sm">{errors.customsPerBatch}</p>
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
                <label className="block text-gray-700 text-sm">
                  Conversion Rate
                </label>
                <input
                  type="number"
                  value={conversionRate}
                  className="input input-bordered w-full input-xs"
                  disabled
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm">
                  Converted Unit Price
                </label>
                <input
                  type="number"
                  value={convertedUnitPrice}
                  className="input input-bordered w-full input-xs"
                  disabled
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm">
                  Converted Total Price
                </label>
                <input
                  type="number"
                  value={convertedTotalPrice}
                  className="input input-bordered w-full input-xs"
                  disabled
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm">
                  Converted Shipping Price Per Batch
                </label>
                <input
                  type="number"
                  value={convertedshippingPrice}
                  className="input input-bordered w-full input-xs"
                  disabled
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm">
                  Converted Customs Price Per Batch
                </label>
                <input
                  type="number"
                  value={convertedcustomsPrice}
                  className="input input-bordered w-full input-xs"
                  disabled
                />
              </div>
            </>
          )}
          <div className="flex justify-end">
            <button
              type="button"
              className="btn btn-ghost mr-2 btn-sm"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm text-white">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UnserializedForm;
