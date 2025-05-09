import React, { useState } from "react";
import axios from "axios";
import { showNotification } from "../../common/headerSlice";
import { useDispatch, useSelector } from "react-redux";

const ImageModal = ({
  updateCounter,
  setUpdateCounter,
  imagePath,
  onClose,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const dispatch = useDispatch();

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleReplaceImage = async () => {
    if (!selectedFile) {
      alert("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_SERVER_BASE_URL}/api/inventory/unserializedin/${imagePath.unsID}/image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
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
      console.error("Error replacing image:", error);
      dispatch(
        showNotification({
          message: "Error replacing",
          status: 0,
        })
      );
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
                    {imagePath.imagePath}
                  </h3>
                  <div className="mt-2">
                    <img
                      src={`${process.env.REACT_APP_SERVER_BASE_URL}/inventory/${imagePath.imagePath}`}
                      alt="No image uploaded"
                    />
                  </div>
                  <div className="badge badge-neutral">
                    Quantity: {imagePath.quantity}
                  </div>
                  <div className="divider"></div>
                  <div className="mt-4">
                    <input
                      type="file"
                      accept="image/*"
                      className="file-input file-input-sm"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-3">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 sm:w-auto"
                onClick={handleReplaceImage}
              >
                Replace/Add Image
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
  );
};

export default ImageModal;
