import React from "react";
import SerializedForm from "./SerializedForm";

const AddSerializedItem = ({open,closeModal,inventoryId,partNumber,partDescription,userEmail,updateCounter,setUpdateCounter}) => {

    const button = "false";

  return (
    <div
      class="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
      ></div>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
        <SerializedForm
        inventoryId={inventoryId}
        partNumber={partNumber}
        partDescription={partDescription}
        button = {button}
        closeModal={closeModal}
        userEmail={userEmail}
        updateCounter={updateCounter}
        setUpdateCounter={setUpdateCounter}
        />
            </div>
       
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSerializedItem;
