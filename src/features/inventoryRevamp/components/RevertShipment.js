import React from "react";
import axios from "axios";
import { showNotification } from "../../common/headerSlice";
import { useDispatch, useSelector } from "react-redux";

const RevertShipment = ({
  updateCounter,
  setUpdateCounter,
  selectedRevert,
  onClose,
}) => {
  const entry = selectedRevert?.unserializedOut[0];
  const dispatch = useDispatch();

  const handleDeleteAndRevert = async () => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_NODE_API_SERVER}inventory/revertShippedOutUnserialized/${entry?.id}`
      );

      if (response.status === 200) {
        setUpdateCounter(updateCounter + 1);
        dispatch(
          showNotification({
            message: "Reverted Successfully",
            status: 1,
          })
        ); // Close the modal
        onClose();
      } else {
        dispatch(
          showNotification({
            message: "Unsuccessful Reversion",
            status: 0,
          })
        );
      }
    } catch (error) {
      console.error("Error deleting and reverting the entry:", error);
      alert("An error occurred while deleting and reverting the entry.");
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

      <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3
                    className="text-base font-semibold leading-6 text-gray-900"
                    id="modal-title"
                  >
                    Confirm Deletion and Reversion
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete and revert the following
                      entry? This action cannot be undone.
                    </p>
                    <div className="mt-4">
                      <ul className="list-disc pl-5 text-sm text-gray-700">
                        <li>
                          <strong>ID:</strong> {entry?.id}
                        </li>
                        <li>
                          <strong>Customer:</strong> {entry?.customer}
                        </li>
                        <li>
                          <strong>Date:</strong>{" "}
                          {new Date(entry?.date).toLocaleDateString()}
                        </li>
                        <li>
                          <strong>Payment Date:</strong>{" "}
                          {new Date(entry?.paymentDate).toLocaleDateString()}
                        </li>
                        <li>
                          <strong>Quantity:</strong> {entry?.quantity}
                        </li>
                        <li>
                          <strong>Selling Price per Unit:</strong> $
                          {entry?.sellingPricePerUnit}
                        </li>
                        <li>
                          <strong>Profit per Unit:</strong> $
                          {entry?.profitPerUnit}
                        </li>
                        <li>
                          <strong>Total Profit:</strong> ${entry?.totalProfit}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                onClick={handleDeleteAndRevert}
              >
                Delete & Revert
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
  );
};

export default RevertShipment;
