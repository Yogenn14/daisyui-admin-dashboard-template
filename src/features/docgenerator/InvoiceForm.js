import React from "react";

const InvoiceForm = () => {
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Invoice Form</h3>
      {/* Add your form inputs and logic here */}
      <form>
        <label htmlFor="vendor">Vendor:</label>
        <input type="text" id="vendor" name="vendor" />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
        >
          Generate PO
        </button>
      </form>
    </div>
  );
};

export default InvoiceForm;
