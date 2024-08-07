import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SerializedModal from "./SerializedModal";
import UnserializedModal from "./UnserializedModal";

const ActionButton = ({
  result,
  setResult,
  searchQuery,
  setSearchQuery,
  searchBy,
  setSearchBy,
  userEmail,
  updateCounter,
  setUpdateCounter,
  showUpdateModal,
  setShowUpdateModal,
  conversionRate
}) => {
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showUnseriliazedModal, setUnserializedModal] = useState(false);
  const [poModal, setPoModal] = useState(false);

  const handleSearchBy = (value) => {
    setSearchBy(value);
  };

  const handleResultChange = (value) => {
    setResult(value);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (searchQuery.length === 0) {
        setSearchResults([]);
        return;
      }

      try {
        const response = await fetch(
          `${process.env.REACT_APP_NODE_API_SERVER}inventory/search?${searchBy}=${searchQuery}&type=${result}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    fetchData();
  }, [searchQuery, searchBy, result]);

  useEffect(() => {
    setSearchQuery("");
  }, [searchBy]);

  const handleSetSearch = (partNum, partDesc) => {
    if (searchBy === "partNum") {
      navigate(`?${searchBy}=${partNum}`);
    } else if (searchBy === "partDescription") {
      navigate(`?${searchBy}=${partDesc}`);
    }
  };
  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const openPOmodal = () => {
    setPoModal(true);
  };

  const openUnserializedModal = () => {
    setUnserializedModal(true);
  };

  const closeUnserializedModal = () => {
    setUnserializedModal(false);
  };

  return (
    <div>
      <div className="dropdown mb-2">
        <button
          tabIndex={0}
          role="button"
          className="btn m-1 btn-sm btn-outline"
        >
          Search by: {searchBy}
        </button>
        <ul
          tabIndex={0}
          className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52"
        >
          <li>
            <a onClick={() => handleSearchBy("partNum")}>Part Number</a>
          </li>
          <li>
            <a onClick={() => handleSearchBy("partDescription")}>
              Part Description
            </a>
          </li>
        </ul>
      </div>
      <div className="dropdown mb-2">
        <div tabIndex={0} role="button" className="btn m-1 btn-sm btn-outline">
          Result: {result === "" ? "All" : result}
        </div>
        <ul
          tabIndex={0}
          className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52"
        >
          <li>
            <a onClick={() => handleResultChange("")}>All</a>
          </li>
          <li>
            <a onClick={() => handleResultChange("serialized")}>Serialized</a>
          </li>
          <li>
            <a onClick={() => handleResultChange("non-serialized")}>
              Non-Serialized
            </a>
          </li>
        </ul>
      </div>
      <div className="dropdown">
        <div tabIndex={0} role="button" className="btn m-1 btn-sm btn-outline">
          Action
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-64"
        >
          <li>
            <a onClick={openPOmodal}>Generate/Add Via PO</a>
          </li>
          <li>
            <a onClick={openModal}>Add New Part [Serialized]</a>
          </li>
          <li>
            <a onClick={openUnserializedModal}>Add New Part [Non-Serialized]</a>
          </li>
        </ul>
      </div>
      <div className="relative mb-5">
        <label className="input input-bordered flex items-center gap-2 mb-0">
          <input
            type="text"
            className="grow"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-4 h-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>
        {searchResults.length > 0 && (
          <ul
            className="absolute p-2 shadow menu z-[10] bg-base-100 rounded-box w-full"
            tabIndex={0}
          >
            {searchResults.map((result) => (
              <li key={result.id}>
                <a
                  onClick={() =>
                    handleSetSearch(result.partNumber, result.partDescription)
                  }
                >
                  {result.partNumber}: {result.partDescription}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
      {showModal && (
        <SerializedModal
          closeModal={closeModal}
          userEmail={userEmail}
          updateCounter={updateCounter}
          setUpdateCounter={setUpdateCounter}
          conversionRate = {conversionRate}
          
        />
      )}
      {showUnseriliazedModal && (
        <UnserializedModal
          closeUnserializedModal={closeUnserializedModal}
          userEmail={userEmail}
          updateCounter={updateCounter}
          setUpdateCounter={setUpdateCounter}
          showUpdateModal={showUpdateModal}
          setShowUpdateModal={setShowUpdateModal}
          conversionRate = {conversionRate}
        />
      )}
    </div>
  );
};

export default ActionButton;
