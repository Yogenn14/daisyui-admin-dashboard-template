import React, { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { showNotification } from "../../common/headerSlice";

const ConstraintModal = ({
  updateCounter,
  setUpdateCounter,
  onClose,
  userEmail,
}) => {
  const [partNumber, setPartNumber] = useState("");
  const [partDescription, setPartDescription] = useState("");
  const [type, setType] = useState("serialized");
  const [consumables, setConsumables] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the default form submission

    const requestBody = {
      partNumber,
      partDescription,
      type,
      consumables,
      userEmail,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_NODE_API_SERVER}inventory/addConstraint`,
        requestBody
      );

      if (response.status === 201) {
        dispatch(
          showNotification({
            message: "Constraint Added Successfully",
            status: 1,
          })
        );
        setUpdateCounter(updateCounter + 1);
        if (onClose) onClose();
      } else {
        const errorMessage = response.data?.error || "Failed to add constraint";
        dispatch(
          showNotification({
            message: errorMessage,
            status: 0,
          })
        );
      }
    } catch (error) {
      console.error("Error adding constraint:", error);
      const errorMessage = error.response?.data?.error || "An error occurred";
      dispatch(showNotification({ message: errorMessage, status: 0 }));
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
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3
                    className="text-base font-semibold leading-6 text-gray-900"
                    id="modal-title"
                  >
                    Add Inventory Constraint
                  </h3>
                  <div className="mt-2">
                    <div role="alert" className="alert mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="stroke-info h-6 w-6 shrink-0"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      <span className="text-xs">
                        Constraints added are uneditable, please verify before
                        submission
                      </span>
                    </div>
                    <div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Part Number
                        </label>
                        <input
                          type="text"
                          value={partNumber}
                          onChange={(e) => setPartNumber(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm input input-bordered"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Part Description
                        </label>
                        <input
                          type="text"
                          value={partDescription}
                          onChange={(e) => setPartDescription(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm input input-bordered"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Type
                        </label>
                        <select
                          value={type}
                          onChange={(e) => setType(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm  sm:text-sm input input-bordered"
                          required
                        >
                          <option value="serialized">Serialized</option>
                          <option value="non-serialized">Non-serialized</option>
                        </select>
                      </div>

                      <div className="form-control mt-2 mb-4">
                        <label className="label cursor-pointer">
                          <span className="label-text">Consumables Item</span>
                          <input
                            type="checkbox"
                            checked={consumables}
                            onChange={(e) => setConsumables(e.target.checked)}
                            className="checkbox"
                          />
                        </label>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          type="submit"
                          onClick={handleSubmit}
                          className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm  sm:ml-3 sm:w-auto"
                        >
                          Submit
                        </button>
                        <button
                          type="button"
                          onClick={onClose}
                          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
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

export default ConstraintModal;
