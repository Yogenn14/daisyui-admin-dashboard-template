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
  conversionRate
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
  const dispatch = useDispatch();

  useEffect(() => {
    const price = formData.unitPrice * formData.quantityChange;
    setTotalPrice(price);

    if (formData.currency === "MYR") {
      setConvertedUnitPrice(formData.unitPrice / conversionRate);
      setConvertedTotalPrice(price /conversionRate);
    } else {
      setConvertedUnitPrice(0);
      setConvertedTotalPrice(0);
    }
  }, [formData.unitPrice, formData.quantityChange, formData.currency, conversionRate]);

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
    console.log(convertedUnitPrice, convertedTotalPrice,conversionRate)
    if (validate()) {
      try {
        const submissionData = {
          ...formData,
          unitPrice: formData.currency === "MYR" ? convertedUnitPrice : formData.unitPrice,
          totalPrice: formData.currency === "MYR" ? convertedTotalPrice : totalPrice,
          conversionRate: formData.currency === "MYR" ? conversionRate[0] : 0,
        };

        const response = await fetch(
          `${process.env.REACT_APP_NODE_API_SERVER}inventory/addUnserializedItem/${inventoryId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(submissionData),
          }
        );
        const data = await response.json();
        if (response.ok) {
          closeModal();
          setUpdateCounter(updateCounter + 1);
          dispatch(
            showNotification({
              message: "Inventory updated successfully",
              status: 1,
            })
          );
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
      //closeUnserializedModal();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75 overflow-y-auto">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Item in (Unserialized)
        </h3>
        <p>Part Num : {partNumber}</p>
        <p>Part Desc : {partDescription}</p>
        <p>Inventory ID : {inventoryId}</p>

        <form onSubmit={handleSubmit}> {/* Ensure onSubmit handler is attached */}
          <div className="mb-4 mt-2">
            <label className="block text-gray-700 text-sm">Quantity Change</label>
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
            <label className="block text-gray-700 text-sm">Manufacturer OEM</label>
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
          <div className="flex justify-end">
            <button
              type="button"
              className="btn btn-ghost mr-2 btn-sm"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm text-white"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UnserializedForm;
