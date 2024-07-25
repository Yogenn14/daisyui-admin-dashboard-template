import React, { useEffect, useState } from "react";
import TitleCard from "../../components/Cards/TitleCard";
import FunnelIcon from "@heroicons/react/24/outline/FunnelIcon";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import SearchBar from "../../components/Input/SearchBar";
import { fetchInventoryData } from "../../services/api";
import axios from "axios";
import Datepicker from "react-tailwindcss-datepicker";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import ModalImage from "react-modal-image";
import { FaShippingFast } from "react-icons/fa";

const TopSideButtons = ({
  removeFilter,
  applyFilter,
  applySearch,
  setFilterType,
}) => {
  const [filterParam, setFilterParam] = useState("");
  const [searchText, setSearchText] = useState("");
  const locationFilters = ["Paris", "London", "Canada", "Peru", "Tokyo"];

  const showFiltersAndApply = (params) => {
    applyFilter(params);
    setFilterParam(params);
  };

  const removeAppliedFilter = () => {
    removeFilter();
    setFilterParam("");
    setSearchText("");
  };

  useEffect(() => {
    applySearch(searchText);
  }, [searchText]);

  return (
    <div className="inline-block float-right">
      <SearchBar
        searchText={searchText}
        styleClass="mr-4"
        setSearchText={setSearchText}
        setFilterType={setFilterType}
      />
      {filterParam !== "" && (
        <button
          onClick={removeAppliedFilter}
          className="btn btn-xs mr-2 btn-active btn-ghost normal-case"
        >
          {filterParam}
          <XMarkIcon className="w-4 ml-2" />
        </button>
      )}
      <button
        className="btn btn-square btn-sm"
        onClick={() => document.getElementById("add_inventory").showModal()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
    </div>
  );
};

function Inventory() {
  const [inventoryData, setInventoryData] = useState([]);
  const [trans, setTrans] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState("partDescription");
  const [serialNumber, setSerialNumber] = useState("");
  const [partNumber, setPartNumber] = useState("");
  const [partDescription, setPartDescription] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [condition, setCondition] = useState("");
  const [status, setStatus] = useState("");
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState(null);
  const [updateCounter, setUpdateCounter] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [inDate, setInDate] = useState();
  const [outDate, setOutDate] = useState();
  const [email, setEmail] = useState("");
  const [selectedField, setSelectedField] = useState("serialNumber");
  const [newValue, setNewValue] = useState("");
  const [remark, setRemark] = useState("");
  const [action, setAction] = useState("");
  const [imageUri, setImageUri] = useState("");
  const [titleNum, setTitleNum] = useState("");
  const [shipmentType, setShipmentType] = useState("shipIn");
  const [shipmentQuantity, setShipmentQuantity] = useState(0);
  const [shipmentSerialNum, setShipmentSerialNum] = useState("");
  const [currentQuantity, setCurrentQuantity] = useState();
  const [shipmentError, setShipmentError] = useState(false);
  const [shipmentErrorMessage, setShipmentErrorMessage] = useState("");

  useEffect(() => {
    const loadInvData = async () => {
      try {
        const result = await fetchInventoryData();
        setInventoryData(result.inventory);
        setTrans(result.inventory);
        console.log("result", result);
      } catch (error) {
        console.error("Inventory data cannot be fetched");
      }
    };
    loadInvData();
  }, [updateCounter]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        //console.log(decodedToken, "decoded tokens");
        setEmail(decodedToken.email);
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, []);

  const applyFilter = (params) => {
    const filteredInventory = inventoryData.filter(
      (item) => item.location === params
    );
    setTrans(filteredInventory);
  };
  const handleUpdateInventory = (item) => {
    setSelectedItem(item);
    setSelectedField("serialNumber");
    setNewValue(item.serialNumber);
    document.getElementById("update_inventory").showModal();
  };

  const handleShipmentSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("quantity", shipmentQuantity);
    formData.append("email", email);

    if (shipmentType === "shipIn") {
      //formData.append("inDate", inDate?.startDate);
      //formData.append("action", "Shipment In");
      if (shipmentQuantity <= currentQuantity) {
        setShipmentError(true);
        setShipmentErrorMessage(
          `Stock validation failed.Please sure quantity is more than current stock item in operation `
        );
        return;
      }
    } else if (shipmentType === "shipOut") {
      //formData.append("outDate", outDate?.startDate);
      //formData.append("action", "Shipment Out");
      if (shipmentQuantity >= currentQuantity) {
        setShipmentError(true);
        setShipmentErrorMessage(
          `Stock validation failed.Please sure quantity is less than current stock for item out operation`
        );
        return;
      }
    }

    try {
      axios({
        method: "put",
        url: `${process.env.REACT_APP_NODE_API_SERVER}inventory/shipment/${selectedItem.id}`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then(function (response) {
          console.log(response);
          document.getElementById("inv_shipment").close();
          setUpdateCounter(updateCounter + 1);
        })
        .catch(function (response) {
          console.log(response);
        });
    } catch (error) {
      console.log(error);
    } finally {
      setShipmentError(false);
      setShipmentErrorMessage("");
    }
  };

  useEffect(() => {
    if (selectedItem) {
      setNewValue(selectedItem[selectedField]);
    }
  }, [selectedField, selectedItem]);

  const applySearch = (value) => {
    setSearchText(value);
    let filteredInventory = inventoryData.filter((item) => {
      if (filterType === "partDescription") {
        return item.partDescription.toLowerCase().includes(value.toLowerCase());
      } else if (filterType === "partNumber") {
        return item.partNumber.toLowerCase().includes(value.toLowerCase());
      } else if (filterType === "serialNumber") {
        return item.serialNumber.toLowerCase().includes(value.toLowerCase());
      }
      return false;
    });

    setTrans(filteredInventory);
  };

  const handleInvShipment = (item) => {
    setSelectedItem(item);
    setShipmentQuantity(item.quantity);
    setCurrentQuantity(item.quantity);
    setShipmentSerialNum(item.serialNumber);
    document.getElementById("inv_shipment").showModal();
  };

  const handleAddInventory = async (event) => {
    event.preventDefault();

    const formData = new FormData();

    formData.append("partDescription", partDescription);
    formData.append("partNumber", partNumber);
    formData.append("serialNumber", serialNumber);
    formData.append("quantity", quantity);
    formData.append("manufactureroem", manufacturer);
    formData.append("condition", condition);
    formData.append("status", status);
    formData.append("userEmail", email);

    if (image) {
      formData.append("image", image);
    }

    axios({
      method: "post",
      url: `${process.env.REACT_APP_NODE_API_SERVER}inventory/addToInventory`,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response) {
        console.log(response);
        document.getElementById("add_inventory").close();
        setUpdateCounter(updateCounter + 1);
      })
      .catch(function (response) {
        console.log(response);
      });
  };

  const updateInventory = async (event) => {
    event.preventDefault();

    const formData = new FormData();

    formData.append(`${selectedField}`, newValue);
    formData.append("email", email);
    formData.append("remark", "remark");
    formData.append(
      "action",
      `${selectedField} has been changed to ${newValue}`
    );
    if (image) {
      formData.append("image", image);
    }

    axios({
      method: "put",
      url: `${process.env.REACT_APP_NODE_API_SERVER}inventory/update/${selectedItem.id}`,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response) {
        console.log(response);
        document.getElementById("update_inventory").close();
        setUpdateCounter(updateCounter + 1);
      })
      .catch(function (response) {
        console.log(response);
      });
  };

  const handleImageClick = (imageUrl, title) => {
    document.getElementById("image_modal").showModal();
    setImageUri(
      `${process.env.REACT_APP_SERVER_BASE_URL}/inventory/${imageUrl}`
    );
    setTitleNum(title);
  };

  return (
    <>
      <TitleCard
        title="Inventory"
        topMargin="mt-2"
        TopSideButtons={
          <TopSideButtons
            applySearch={applySearch}
            applyFilter={applyFilter}
            removeFilter={() => setTrans(inventoryData)}
            setFilterType={setFilterType}
          />
        }
      >
        <div className="overflow-x-auto w-full">
          <dialog id="add_inventory" className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Add Inventory</h3>
              <form onSubmit={handleAddInventory} className="space-y-4">
                {/*  <input
                  type="text"
                  name="serialNumber"
                  placeholder="Serial Number"
                  className="input input-sm input-bordered input-primary w-full max-w-full mt-2"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                /> */}
                <select className="select select-bordered w-full max-w-xs">
                  <option>Parts/Machines</option>
                  <option>Consumables/Others</option>
                </select>
                <input
                  type="text"
                  name="partNumber"
                  placeholder="Part Number"
                  className="input input-sm input-bordered input-primary w-full max-w-xs"
                  value={partNumber}
                  onChange={(e) => setPartNumber(e.target.value)}
                />
                <input
                  type="text"
                  name="partDescription"
                  placeholder="Part Description"
                  className="input input-sm input-bordered input-primary w-full max-w
                  -xs"
                  value={partDescription}
                  onChange={(e) => setPartDescription(e.target.value)}
                />
                <input
                  type="text"
                  name="manufacturer"
                  placeholder="Manufacturer/OEM"
                  className="input input-sm input-bordered input-primary w-full max-w-xs"
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.target.value)}
                />
                <input
                  type="text"
                  name="condition"
                  placeholder="Condition"
                  className="input input-sm input-bordered input-primary w-full max-w-xs"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                />
                <input
                  type="text"
                  name="status"
                  placeholder="Status"
                  className="input input-sm input-bordered input-primary w-full max-w-xs"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                />
                <input
                  type="text"
                  name="quantity"
                  placeholder="Quantity"
                  className="input input-sm input-bordered input-primary w-full max-w-xs"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
                <input
                  type="file"
                  name="image"
                  className="file-input file-input-bordered file-input-md w-full max-w-xs"
                  onChange={(e) => setImage(e.target.files[0])}
                />
                <Datepicker
                  value={inDate}
                  onChange={(date) => setInDate(date)}
                  className="input input-sm input-bordered input-primary w-full max-w-full"
                  asSingle={true}
                  useRange={false}
                  placeholder="inDate"
                />
                <Datepicker
                  value={outDate}
                  onChange={(date) => setOutDate(date)}
                  className="input input-sm input-bordered input-primary w-full max-w-full"
                  asSingle={true}
                  useRange={false}
                  placeholder="outDate"
                />
                <div className="modal-action space-x-2">
                  <button type="submit" className="btn">
                    Add
                  </button>
                  <button
                    type="button"
                    className="btn"
                    onClick={() =>
                      document.getElementById("add_inventory").close()
                    }
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </dialog>
          <dialog id="update_inventory" className="modal">
            <div className="modal-box max-w-2xl">
              <h3 className="font-bold text-lg">Update Inventory</h3>
              <form onSubmit={updateInventory}>
                <div className="label">
                  <span className="label-text">Select Field to Update</span>
                </div>
                <select
                  className="select select-bordered w-full max-w-full"
                  value={selectedField}
                  onChange={(e) => setSelectedField(e.target.value)}
                >
                  <option value="serialNumber">Serial Number</option>
                  <option value="partNumber">Part Number</option>
                  <option value="partDescription">Part Description</option>
                  <option value="manufactureroem">Manufacturer/OEM</option>
                  <option value="condition">Condition</option>
                  <option value="status">Status</option>
                </select>
                <div className="label">
                  <span className="label-text">New Value</span>
                </div>

                <input
                  type="text"
                  className="input input-sm input-bordered input-primary w-full max-w-full"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                />

                <div className="modal-action space-x-2">
                  <button type="submit" className="btn">
                    Update
                  </button>
                  <button
                    type="button"
                    className="btn"
                    onClick={() =>
                      document.getElementById("update_inventory").close()
                    }
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </dialog>
          <dialog id="inv_shipment" className="modal">
            <form
              method="dialog"
              className="modal-box"
              onSubmit={handleInvShipment}
            >
              <h3 className="font-bold text-lg">Shipment</h3>
              <div className="form-control">
                <h3 className="font-semibold text-sm">
                  Item Serial Number: {shipmentSerialNum}
                </h3>
                <h5 className="text-sm">
                  Quantity
                  <span className="badge badge-xs">{currentQuantity}</span>
                </h5>
                <label className="label">
                  <span className="label-text">Shipment Type</span>
                </label>
                <select
                  className="select select-bordered"
                  value={shipmentType}
                  onChange={(e) => setShipmentType(e.target.value)}
                >
                  <option value="shipIn">Item In[Add Quantity]</option>
                  <option value="shipOut">Item Out[Reduce Quantity]</option>
                </select>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Quantity</span>
                </label>
                <input
                  type="number"
                  placeholder="Quantity"
                  className="input input-bordered"
                  value={shipmentQuantity}
                  onChange={(e) => setShipmentQuantity(e.target.value)}
                  required
                />
              </div>

              {shipmentType === "shipIn" && (
                <div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">In Date</span>
                    </label>
                    <Datepicker
                      onChange={(newDate) => setInDate(newDate)}
                      asSingle={true}
                      useRange={false}
                      popoverDirection="down"
                    />
                  </div>
                  <label className="label mt-4">
                    <span className="label-text">Supplier Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Type here"
                    className="input input-bordered w-full max-w-xs"
                  />
                </div>
              )}

              {shipmentType === "shipOut" && (
                <div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Out Date</span>
                    </label>
                    <Datepicker
                      onChange={(newDate) => setInDate(newDate)}
                      asSingle={true}
                      useRange={false}
                      popoverDirection="down"
                    />
                  </div>
                  <label className="label mt-4">
                    <span className="label-text">Customer</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Type here"
                    className="input input-bordered w-full max-w-xs"
                  />
                </div>
              )}
              {shipmentError && (
                <div
                  className="p-4 mb-4 mt-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                  role="alert"
                >
                  {shipmentErrorMessage}
                </div>
              )}

              <div className="modal-action">
                <button
                  className="btn"
                  type="submit"
                  onClick={handleShipmentSubmit}
                >
                  Add Shipment
                </button>
                <button
                  className="btn"
                  onClick={() =>
                    document.getElementById("inv_shipment").close()
                  }
                >
                  Cancel
                </button>
              </div>
            </form>
          </dialog>
          <dialog id="image_modal" className="modal">
            <div className="modal-box w-11/12 max-w-xl align-middle justify-center">
              <h3 className="font-bold text-lg">{titleNum}</h3>
              <div className="divider"></div>
              <img src={imageUri} width={500} height={500} />
              <div className="modal-action">
                <form method="dialog">
                  <button className="btn">Close</button>
                </form>
              </div>
            </div>
          </dialog>
          <table className="table w-full table-xs">
            <thead>
              <tr>
                <th></th>

                <th>Image</th>
                <th>Part Description</th>
                <th>Part Number</th>
                <th>Quantity</th>
                <th>Serial Number</th>
                <th>Status</th>
                <th>Condition</th>
                <th>Manufacturer/OEM</th>
                <th>In Date</th>
                <th>Out Date</th>
                <th>Created By</th>
                <th>Update</th>
                <th>Ship In/Out</th>
              </tr>
            </thead>
            <tbody>
              {trans.map((item, index) => (
                <tr key={index}>
                  <td>
                    <Link to={`/app/inventory/${item.id}`}>
                      <button className="btn btn-xs">Logs</button>
                    </Link>
                  </td>

                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div
                          className="mask mask-squircle w-12 h-12 cursor-pointer"
                          onClick={() =>
                            handleImageClick(item.image, item.serialNumber)
                          }
                        >
                          <img
                            src={
                              item.image
                                ? `${process.env.REACT_APP_SERVER_BASE_URL}/inventory/${item.image}`
                                : `/emptyinv.jpg`
                            }
                            alt="Inventory"
                          />
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>{item.partDescription}</td>
                  <td>{item.partNumber}</td>
                  <td>{item.quantity}</td>
                  <td>{item.serialNumber}</td>
                  <td>{item.status}</td>
                  <td>{item.condition}</td>
                  <td>{item.manufactureroem}</td>
                  <td>{item.inDate}</td>
                  <td>{item.outDate}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      {item.userEmail}
                      <div className="avatar">
                        <div className="mask mask-squircle w-8 h-8">
                          <img
                            src={`${process.env.REACT_APP_SERVER_BASE_URL}/profileImg/${item.userImage}`}
                            alt="Inventory"
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <button
                      className="btn btn-square btn-xs"
                      onClick={() => handleUpdateInventory(item)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-square btn-xs"
                      onClick={() => handleInvShipment(item)}
                    >
                      <FaShippingFast />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TitleCard>
    </>
  );
}

export default Inventory;
