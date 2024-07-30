import React, { useState, useEffect } from "react";

function StaticDataForm({ staticData, setStaticData }) {
  const [formData, setFormData] = useState(staticData);

  // Update formData when staticData changes
  useEffect(() => {
    setFormData(staticData);
  }, [staticData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setStaticData(formData);
  };

  return (
    <div className="form-container bg-white p-4 rounded-md">
      <h2 className="text-xl mb-4">General PO Data</h2>
      <form>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">
            Ship to Address Line 1:
          </label>
          <input
            name="shipToAddressLine1"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.shipToAddressLine1}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">
            Ship to Address Line 2:
          </label>
          <input
            name="shipToAddressLine1"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.shipToAddressLine2}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">
            Ship to Address Line 3:
          </label>
          <input
            name="shipToAddressLine1"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.shipToAddressLine3}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">Tel:</label>
          <input
            name="shipToAddressLine1"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.tel}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">Email:</label>
          <input
            name="shipToAddressLine1"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">Attn:</label>
          <input
            name="shipToAddressLine1"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.attn}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">Buyer</label>
          <input
            name="shipToAddressLine1"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.buyer}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">
            Buyer Email
          </label>
          <input
            name="shipToAddressLine1"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.buyerEmail}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">Buyer Tel</label>
          <input
            name="shipToAddressLine1"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.buyerTel}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">Requester</label>
          <input
            name="shipToAddressLine1"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.requester}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">
            Requester Email
          </label>
          <input
            name="shipToAddressLine1"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.requesterEmail}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">
            Requester Tel
          </label>
          <input
            name="shipToAddressLine1"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.requesterTel}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">Supervisor</label>
          <input
            name="shipToAddressLine1"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.supervisor}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">
            Supervisor Email
          </label>
          <input
            name="shipToAddressLine1"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.supervisorEmail}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">
            Supervisor Tel
          </label>
          <input
            name="shipToAddressLine1"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.supervisorTel}
            onChange={handleChange}
          />
        </div>
      
        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">
            Condition 1
          </label>
          <input
            name="shipToAddressLine1"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.condition1}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">
            Condition 2
          </label>
          <input
            name="shipToAddressLine1"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.condition2}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">
            Condition 3
          </label>
          <input
            name="shipToAddressLine1"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.condition3}
            onChange={handleChange}
          />
        </div>
        <div className="text-center">
          <button
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default StaticDataForm;
