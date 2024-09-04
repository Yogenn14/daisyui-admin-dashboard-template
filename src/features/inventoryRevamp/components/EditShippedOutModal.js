import React, { useState } from "react";
import { showNotification } from "../../common/headerSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

const EditShippedOutModal = ({
  updateCounter,
  setUpdateCounter,
  editShippedOut,
  onClose,
  onSave,
}) => {
  const entry = editShippedOut?.unserializedOut[0];
  const unserializedOutId = entry?.id;
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    customer: entry?.customer || "",
    outDate: entry?.outDate || "",
    paymentDate: entry?.paymentDate || "",
  });

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_NODE_API_SERVER}inventory/editShippedOut/${unserializedOutId}`,
        formData
      );
      if (response.status === 200) {
        //onSave(formData);
        dispatch(
          showNotification({
            message: "Updated Successfully",
            status: 1,
          })
        );
        setUpdateCounter(updateCounter + 1);
        onClose();
      }
    } catch (error) {
      dispatch(
        showNotification({
          message: "Error Updating",
          status: 0,
        })
      );
      console.error("Error updating shipment details:", error);
    }
  };

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
            <form onSubmit={handleSubmit}>
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3
                      className="text-base font-semibold leading-6 text-gray-900"
                      id="modal-title"
                    >
                      Edit Shipment Details
                    </h3>
                    <div className="mt-2">
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="customer"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Customer
                          </label>
                          <input
                            type="text"
                            name="customer"
                            id="customer"
                            value={formData.customer}
                            onChange={handleInputChange}
                            className="input input-sm"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="outDate"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Out Date
                          </label>
                          <input
                            type="date"
                            name="outDate"
                            id="outDate"
                            value={formData.outDate}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="paymentDate"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Payment Date
                          </label>
                          <input
                            type="date"
                            name="paymentDate"
                            id="paymentDate"
                            value={formData.paymentDate}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="submit"
                  className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
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

export default EditShippedOutModal;
