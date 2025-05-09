import React, { useState } from "react";
import EmptyModalTemplate from "./EmptyModalTemplate";
import { useDispatch } from "react-redux";
import { showNotification } from "../common/headerSlice";

const DynamicDataForm = ({ dynamicData, setDynamicData, userEmail, myrToUsdRate }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [additionalModal, setaddtionalModal] = useState(false);
  const [message, setMessage] = useState("");
  const [validated, setValidated] = useState(false);
  const [inventoryId, setInventoryId] = useState();
  const [newPNPD, setNewPNPD] = useState(false);
  const [totalAmount,setTotalAmount] = useState(0);
  const [newPN,setNewPN] = useState();
  const [newPD,setNewPD] = useState();
  const [type,setType] = useState("serialized");

  const dispatch = useDispatch();


  const calculateAmount = () => {
    const amount = parseFloat(item.quantity) * parseFloat(item.unitPrice);
    setItem({ ...item, amount: amount.toFixed(2) });
  };
  const [item, setItem] = useState({
    partNo: "",
    description: "",
    quantity: null,
    uom: "",
    unitPrice: "",
    amount: "",
    type: "",
    id : ""
  });



  const handleChange = (e) => {
    const { name, value } = e.target;
    setDynamicData({ ...dynamicData, [name]: value });
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setItem({ ...item, [name]: value });
  };

  const handleAdditionalItem = () => {
    calculateAmount();
    const updatedItems = [...dynamicData.items, item];
    setDynamicData({ ...dynamicData, items: [...dynamicData.items, item] });

    const newTotalAmount = updatedItems.reduce((sum, currentItem) => {
      return sum + parseFloat(currentItem.amount);
    }, 0);

    setTotalAmount(newTotalAmount);

    setItem({
      partNo: "",
      description: "",
      quantity: "",
      uom: "",
      unitPrice: "",
      amount: "",
      type: "Additional",
    });
    setValidated(false);
    closeModal();
  };

  const handlePOGenerate = (e) => {
    console.log("Dynamic Data", dynamicData);
  };

 
  const handleAddItem = () => {
    calculateAmount();
    const updatedItems = [...dynamicData.items, item];
    setDynamicData({ ...dynamicData, items: [...dynamicData.items, item] });

    const newTotalAmount = updatedItems.reduce((sum, currentItem) => {
      return sum + parseFloat(currentItem.amount);
    }, 0);

    setTotalAmount(newTotalAmount);

    setItem({
      partNo: "",
      description: "",
      quantity: "",
      uom: "",
      unitPrice: "",
      amount: "",
      type: "",
    });
    setValidated(false);
    closeModal();
  };

  

  const validateItem = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_NODE_API_SERVER}inventory/validatePNPD`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            partNumber: item.partNo,
            partDescription: item.description,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        if (result.error === "Constraint Exist") {
          setValidated(true);
          setInventoryId(result.id);
          setItem({
            ...item,
            type: result.type || "Non-Serialized",
            id : result.id,
          });
          setMessage(
            "A unit with this part number and part description already exists in the database."
          );
        } else if (
          result.exist === "false"
        ) {
          setMessage(
            "This Part Number and Part Description constraint does not exist. Do you wish to add it into database"
          );
          setNewPNPD(true);
        }
      } else {
        setMessage(result.message || "Validation failed");
      }
    } catch (error) {
      console.error("Error validating item:", error);
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const openAdditionalModal = () => {
    setaddtionalModal(true);
  };

  const handleNewPNPD = async (partNo, description) => {
    const requestBody = {
      partNumber: partNo,
      partDescription: description,
      type: type.toLowerCase(), 
      userEmail: userEmail
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_NODE_API_SERVER}inventory/addConstraint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const responseData = await response.json()
        dispatch(
          showNotification({
            message: "Added Constraint to database.",
            status: 1,
          })
        );
        setInventoryId(responseData.inventory.id)
        setItem({partNo: partNo, description: description, type: type, id: responseData.inventory.id})
        setValidated(true);
        setMessage();
      } else {
        dispatch(
            showNotification({
              message: "Error adding constraint",
              status: 0,
            })
          );
          console.log(response)
      }
    } catch (error) {
      console.error('Error:', error);
      dispatch(
        showNotification({
          message: "Error adding constraint",
          status: 0,
        })
      );
    }
  };


  const closeModal = () => {
    setModalIsOpen(false);
    setaddtionalModal(false);
    setValidated(false);
    setMessage("");
    setItem({
      partNo: "",
      description: "",
      quantity: "",
      uom: "",
      unitPrice: "",
      amount: "",
      type: "",
      id : "",
    });
  };

  const handleTypeChange = (event) => {
    setType(event.target.value); 
  };

  return (
    <div className="form-container bg-white p-4 rounded-md">
      <h2 className="text-xl mb-4">Dynamic Data</h2>
      <form>
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
    <h3 className="font-bold">Fill PO data in this form</h3>
    <div className="text-xs">Note: Input(s) marked as (?) are optional, you can leave those input fields empty.</div>
  </div>
</div>
        <div className="mb-4">
          <h3 className="text-lg  mb-2">Overview</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm  mb-2">
                PO Number:
              </label>
              <input
                name="poNumber"
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={dynamicData.poNumber}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm  mb-2">
                PO Date:
              </label>
              <input
                name="poDate"
                type="date"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={dynamicData.poDate}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm  mb-2">
                Quotation Number:
              </label>
              <input
                name="quotationNumber"
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={dynamicData.quotationNumber}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm  mb-2">
                Quotation Date:
              </label>
              <input
                name="quotationDate"
                type="date"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={dynamicData.quotationDate}
                onChange={handleChange}
              />
            </div>
           
            <div>
              <label className="block text-gray-700 text-sm  mb-2">
                Vendor Address Line 1
              </label>
              <input
                name="vendorAddressLine1"
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={dynamicData.vendorAddressLine1}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm  mb-2">
                Vendor Address Line 2
              </label>
              <input
                name="vendorAddressLine2"
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={dynamicData.vendorAddressLine2}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm  mb-2">
                Vendor Address Line 3 (?)
              </label>
              <input
                name="vendorAddressLine3"
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={dynamicData.vendorAddressLine3}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm  mb-2">
                Vendor Address Line 4 (?)
              </label>
              <input
                name="vendorAddressLine4"
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={dynamicData.vendorAddressLine4}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm  mb-2">
                Vendor Tel
              </label>
              <input
                name="vendorTel"
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={dynamicData.vendorTel}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm  mb-2">
                Vendor Email
              </label>
              <input
                name="vendorEmail"
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={dynamicData.vendorEmail}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm  mb-2">
                Vendor Attn
              </label>
              <input
                name="vendorAttn"
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={dynamicData.vendorAttn}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm  mb-2">
                Mode of currency
              </label>
              <select className="select select-bordered w-full max-w-xs" onChange={handleChange} value={dynamicData.moc} name="moc">
                <option value={'USD'}>USD</option>
                <option value={'MYR'}>MYR</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-lg  mb-2">Inventory Items</h3>
        </div>

       <div className="space-x-4">
        <button type="button" onClick={openModal} className="btn btn-sm">
          Add Parts/Item
        </button>
        <button
          type="button"
          onClick={openAdditionalModal}
          className="btn btn-sm"
        >
          Add Additional Record
        </button>
        </div>
      </form>

      <div className="mt-4">
        <h3 className="text-2xl mb-2 ">PO Items List Preview</h3>
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Part Number
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  UOM
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Quantity
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Unit Price
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ID
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dynamicData.items
                .filter((item) => item.quantity !== 0)
                .map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.partNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.uom}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.unitPrice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.id}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalIsOpen && (
        <EmptyModalTemplate closeModal={closeModal}>
          <div className="modal-content">
            <h2 className="text-xl mb-4">Add Item</h2>
            {!validated ? (
              <>
                <div>
                  <label className="block text-gray-700 text-sm  mb-2">
                    Part Number:
                  </label>
                  <input
                    name="partNo"
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={item.partNo}
                    onChange={handleItemChange}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm  mb-2">
                    Description:
                  </label>
                  <input
                    name="description"
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={item.description}
                    onChange={handleItemChange}
                  />
                </div>
                <button
                  type="button"
                  onClick={validateItem}
                  className="btn btn-sm mt-4"
                >
                  Validate
                </button>

                {message &&  
                <div className="space-y-2">
                <div role="alert" className="alert mt-4">
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
                    <span>{message}</span>
                    </div>
                    <label className="input input-bordered flex items-center gap-2">
                      Part Num
                      <input type="text" className="grow" value={item.partNo} disabled/>
                    </label>
                    <label className="input input-bordered flex items-center gap-2">
                      Part Desc
                      <input type="text" className="grow" value={item.description} disabled />
                    </label>
                    <select className="select select-bordered w-full max-w-xs" value={type} onChange={handleTypeChange}>
                      <option value="serialized">Serialized</option>
                      <option value="non-serialized">Non-Serialized</option>
                    </select>
                    <div className="btn btn-sm w-full" onClick={()=>handleNewPNPD(item.partNo, item.description)}>Add</div>
                    </div>
                     }
              </>
            ) : (
              <>
                {message && (
                  <div role="alert" className="alert">
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
                    <span>{message}</span>
                  </div>                )}

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm  mb-2">
                    Type:
                  </label>
                  <select
                    name="type"
                    value={item.type}
                    onChange={handleItemChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="Serialized">{item.type}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm  mb-2">
                    UOM:
                  </label>
                  <input
                    name="uom"
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={item.uom}
                    onChange={handleItemChange}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm  mb-2">
                    Quantity:
                  </label>
                  <input
                    name="quantity"
                    type="number"
                    min="1"
                    step="1"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={item.quantity}
                    onChange={handleItemChange}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm  mb-2">
                    Unit Price:
                  </label>
                  <input
                    name="unitPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={item.unitPrice}
                    onChange={handleItemChange}
                  />
                </div>
               
                  {dynamicData.moc === 'MYR' &&    <div>
                  <label className="block text-gray-700 text-sm  mb-2">
                   Current Conversion Rate:
                  </label>
                  <input
                    name="unitPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline input input-disabled"
                    value={myrToUsdRate}
                    disabled
                  />
                  <label className="block text-gray-700 text-sm  mb-2">
                   Converted Unit Price:
                  </label>
                  <input
                    name="unitPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline input input-disabled"
                    value={item.unitPrice / myrToUsdRate}
                    onChange={handleItemChange}
                    disabled
                  />
                </div> }
              
                <div>
                  <label className="block text-gray-700 text-sm  mb-2">
                    Amount
                  </label>
                  <input
                    name="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={item.amount= item.quantity * item.unitPrice}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="btn btn-sm mt-4"
                >
                  Add Item
                </button>
              </>
            )}
          </div>
        </EmptyModalTemplate>
      )}

      {additionalModal && (
        <EmptyModalTemplate closeModal={closeModal}>
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Add Additional Data
          </h3>
          <div role="alert" className="alert shadow-md mb-4 w-full">
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
            <div>
              <div className="text-xs">
                These data would not be included in inventory database, you can
                add data such as shipping fee, etc here.
              </div>
            </div>
          </div>
          <div>
                  <label className="block text-gray-700 text-sm  mb-2">
                    Part Number:
                  </label>
                  <input
                    name="partNo"
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={item.partNo}
                    onChange={handleItemChange}
                  />
                </div>  <div>
                  <label className="block text-gray-700 text-sm  mb-2">
                    Part Desc:
                  </label>
                  <input
                    name="description"
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={item.description}
                    onChange={handleItemChange}
                  />
                </div>  <div>
                  <label className="block text-gray-700 text-sm  mb-2">
                    UOM:
                  </label>
                  <input
                    name="uom"
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={item.uom}
                    onChange={handleItemChange}
                  />
                </div>
           
           
                <div>
                  <label className="block text-gray-700 text-sm  mb-2">
                    Quantity:
                  </label>
                  <input
                    name="quantity"
                    type="number"
                    min="1"
                    step="1"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={item.quantity}
                    onChange={handleItemChange}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm  mb-2">
                    Unit Price:
                  </label>
                  <input
                    name="unitPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={item.unitPrice}
                    onChange={handleItemChange}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm  mb-2">
                    Amount
                  </label>
                  <input
                    name="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={item.amount}
                    onChange={handleItemChange}

                  />
                </div>
            <div className="flex justify-end">
            <button
                  type="button"
                  onClick={handleAdditionalItem}
                  className="btn btn-sm mt-4"
                >
                  Add Item
                </button>
            </div>
          
        </EmptyModalTemplate>
      )}
    
    <div className="mt-2 ml-4">Total Price: {totalAmount}</div>
    </div>
  );
};

export default DynamicDataForm;
