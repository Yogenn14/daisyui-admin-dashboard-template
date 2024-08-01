import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { showNotification } from "../common/headerSlice";


function StaticDataForm({ staticData, setStaticData, userEmail }) {
  const [formData, setFormData] = useState({ ...staticData, authorEmail: userEmail });
  const dispatch = useDispatch();
  useEffect(() => {
    setFormData((prevFormData) => ({ ...prevFormData, ...staticData, authorEmail :userEmail }));
  }, [staticData, userEmail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value, authorEmail: userEmail });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setStaticData(formData);
    try {
      const response = await fetch(`${process.env.REACT_APP_NODE_API_SERVER}po/updatePObyID/1`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        dispatch(
          showNotification({
            message: "Successfully updated static PO data",
            status: 1,
          })
        );
      } else {
        dispatch(
          showNotification({
            message: "Error updating static PO data",
            status: 0,
          })
        );
      }
    } catch (error) {
      console.error("Error updating PO:", error);
    }
  };


  const formatToMalaysianTime = (utcTime) => {
    const date = new Date(utcTime);
    const options = {
      timeZone: "Asia/Kuala_Lumpur",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    return date.toLocaleString("en-US", options);
  };

  return (
    <div className="form-container bg-white p-4 rounded-md">
      <h2 className="text-xl mb-4">General PO Data Template</h2>
      <div role="alert" className="alert shadow-lg mb-4">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    className="stroke-info h-6 w-6 shrink-0">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
  <div>
    <h3 className="font-bold">Latest Update By : {formData.authorEmail}</h3>
    <div className="text-xs">Updated at : {formatToMalaysianTime(formData.updatedAt)}</div>
  </div>
</div>
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
            name="shipToAddressLine2"
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
            name="shipToAddressLine3"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.shipToAddressLine3}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">Tel:</label>
          <input
            name="tel"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.tel}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">Email:</label>
          <input
            name="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">Attn:</label>
          <input
            name="attn"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.attn}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">Buyer</label>
          <input
            name="buyer"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.buyer}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">Buyer Email</label>
          <input
            name="buyerEmail"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.buyerEmail}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">Buyer Tel</label>
          <input
            name="buyerTel"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.buyerTel}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">Requester</label>
          <input
            name="requester"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.requester}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">Requester Email</label>
          <input
            name="requesterEmail"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.requesterEmail}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">Requester Tel</label>
          <input
            name="requesterTel"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.requesterTel}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">Supervisor</label>
          <input
            name="supervisor"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.supervisor}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">Supervisor Email</label>
          <input
            name="supervisorEmail"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.supervisorEmail}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">Supervisor Tel</label>
          <input
            name="supervisorTel"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.supervisorTel}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">Notes</label>
          <input
            name="notes"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={`Notes: This offer to purchase is referenced to the price stated in vendor's quotation: quotationNumber date quotationDate and subjected to the following
            condition:-`}
            onChange={handleChange}
            disabled
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">Condition 1</label>
          <input
            name="condition1"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.condition1}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">Condition 2</label>
          <input
            name="condition2"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.condition2}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">Condition 3</label>
          <input
            name="condition3"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.condition3}
            onChange={handleChange}
          />
        </div>
        <div className="text-center">
          <button
            onClick={handleSave}
            className="btn btn-md btn-primary w-full"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default StaticDataForm;
