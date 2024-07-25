import React from "react";

const POForm = ({ poNum, setPoNum }) => {
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Purchase Order Form</h3>
      {/* Add your form inputs and logic here */}
      <form>
        <label htmlFor="vendor" className="text-xs">
          PO Num:
        </label>
        <input
          className="input input-xs"
          type="text"
          id="vendor"
          name="vendor"
          value={poNum}
          onChange={(e) => setPoNum(e.target.value)}
        />

        {/* Add more form fields as needed */}

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

export default POForm;
