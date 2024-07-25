import React, { useState } from "react";
import PropTypes from "prop-types";
import { showNotification } from "../../common/headerSlice";
import { useDispatch, useSelector } from "react-redux";

const ShipOutModal = ({
  open,
  onClose,
  serialNumbers,
  userEmail,
  updateCounter,
  setUpdateCounter,
}) => {
  const [customer, setCustomer] = useState("");
  const [outDate, setOutDate] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const handleShipOut = async () => {
    const requestBody = {
      serialNumbers,
      outDate,
      customer,
      userEmail,
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_NODE_API_SERVER}inventory/updateSerializedItemOut`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );
      // console.log(JSON.stringify(requestBody), "body");

      if (response.ok) {
        setUpdateCounter(updateCounter + 1);
        dispatch(
          showNotification({
            message: "Items shipped out successfully",
            status: 1,
          })
        );

        onClose();
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to ship out items");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An unexpected error occurred");
    }
  };

  return (
    <>
      {open && (
        <div
          className="relative z-40"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

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
                        Ship Out Items
                      </h3>
                    </div>
                  </div>
                </div>

                <label className="input input-bordered flex items-center gap-2 ml-6 w-3/4">
                  Customer
                  <input
                    type="text"
                    className="grow"
                    placeholder="Customer Name"
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                  />
                </label>
                <div className="mt-4 ml-6 gap-2 w-3/4">
                  <p className="ml-4 mb-2">Out Date</p>
                  <input
                    type="date"
                    className="grow input"
                    value={outDate}
                    onChange={(e) => setOutDate(e.target.value)}
                    required
                  />
                </div>
                <div className="ml-6 mt-4">
                  <p className="font-semibold">Selected Serial Numbers:</p>
                  <ul className="list-disc ml-6">
                    {serialNumbers.map((sn, index) => (
                      <li key={index}>{sn}</li>
                    ))}
                  </ul>
                </div>

                {error && (
                  <div
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative w-1/2 ml-6 mb-4 mt-4"
                    role="alert"
                  >
                    <span className="block sm:inline">{error}</span>
                  </div>
                )}

                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                    onClick={handleShipOut}
                  >
                    Ship Out
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

ShipOutModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  serialNumbers: PropTypes.arrayOf(PropTypes.string).isRequired,
  userEmail: PropTypes.string.isRequired,
};

export default ShipOutModal;
