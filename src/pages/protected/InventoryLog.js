import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import { useParams } from "react-router-dom";
import DocumentIcon from "@heroicons/react/24/solid/DocumentIcon";

function InternalPage() {
  const dispatch = useDispatch();
  const { inventoryId } = useParams();
  const [logs, setLogs] = useState([]);
  const [invDetails, setInvDetails] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    dispatch(setPageTitle({ title: "Inventory Log" }));
  }, [dispatch]);

  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_NODE_API_SERVER}inventory/getLog/${inventoryId}`
    )
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, [inventoryId]);

  return (
    console.log(invDetails, "invDetails"),
    (
      <div className="grid lg:grid-cols-3 mt-4 grid-cols-1 gap-6">
        <div className="card bg-base-100 col-span-2 p-5">
          <table className="table table-xs w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Action</th>
                <th>Remark</th>
                <th>Email</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {data?.logs?.map((log) => (
                <tr key={log.id}>
                  <td>{log.name}</td>
                  <td>{log.action}</td>
                  <td>{log.remark}</td>
                  <td>{log.email}</td>
                  <td>{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card bg-base-100 shadow-xl">
          <div className="flex justify-start ml-8">
            <figure>
              <img
                src={`${process.env.REACT_APP_SERVER_BASE_URL}/inventory/${data?.inventory?.image}`}
                alt="Shoes"
                className="rounded-md mt-4"
              />
            </figure>
          </div>
          <div className="card-body">
            <h2 className="card-title">Item Details</h2>
            <div className="divider"></div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-600">
                Serial Number:
              </span>
              <span>{data?.inventory?.serialNumber}</span>
            </div>
            <div className="divider"></div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-600">Part Number:</span>
              <span>{data?.inventory?.partNumber}</span>
            </div>
            <div className="divider"></div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-600">Manufacturer:</span>
              <span>{data?.inventory?.manufactureroem}</span>
            </div>
            <div className="divider"></div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-600">Condition:</span>
              <span>{data?.inventory?.condition}</span>
            </div>
            <div className="divider"></div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-600">Status:</span>
              <span>{data?.inventory?.status}</span>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

export default InternalPage;
