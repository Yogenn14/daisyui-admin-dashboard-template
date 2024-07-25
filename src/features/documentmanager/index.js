import React, { useState, useEffect } from "react";
import TitleCard from "../../components/Cards/TitleCard";
import SearchBar from "../../components/Input/SearchBar";
import { FaFolder } from "react-icons/fa";
import moment from "moment";
import axios from "axios";
import { Link } from "react-router-dom";

const FoldersList = () => {
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [folders, setFolders] = useState([]);
  const [selectedFolders, setSelectedFolders] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [newFolderName, setNewFolderName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(false);
  const baseURL = process.env.NODE_API_SERVER;

  const itemsPerPage = 5;

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_NODE_API_SERVER}folder/getRootFolders`
      );
      console.log(process.env.NODE_API_SERVER);
      const { totalPages, currentPage, rootFolders } = response.data;
      setTotalPages(totalPages);
      setPage(currentPage);
      setFolders(rootFolders);
    } catch (error) {
      console.error("Error fetching root folders:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Filter folders based on search text
    let filteredFolders = folders.filter((folder) =>
      folder.title.toLowerCase().includes(searchText.toLowerCase())
    );

    // Calculate the index range of folders for the current page
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Slice the folders array to get the folders for the current page
    filteredFolders = filteredFolders.slice(startIndex, endIndex);

    // Update the folders state
    setFolders(filteredFolders);
  }, [page, searchText]);

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const handleFolderSelect = (folder) => {
    const index = selectedFolders.indexOf(folder);
    if (index === -1) {
      setSelectedFolders([...selectedFolders, folder]);
    } else {
      const updatedSelection = [...selectedFolders];
      updatedSelection.splice(index, 1);
      setSelectedFolders(updatedSelection);
    }
  };

  const handleCreateFolder = async () => {
    try {
      if (!newFolderName.trim()) {
        setError(true);
        setErrorMessage("Folder name cannot be empty.");
        return;
      }

      await axios.post(
        `${process.env.REACT_APP_NODE_API_SERVER}folder/createFolder`,
        {
          title: newFolderName,
        }
      );
      document.getElementById("my_modal_1").close();
      fetchData();
      // Reset error state after successful creation
      setError(false);
      setErrorMessage("");
    } catch (error) {
      console.error("Error creating folder:", error);
    }
  };

  return (
    <>
      <TitleCard
        title="Document Management"
        topMargin="mt-2"
        TopSideButtons={
          <SearchBar
            searchText={searchText}
            setSearchText={setSearchText}
            placeholder="Search folders"
          />
        }
      >
        <div className="overflow-x-auto w-full">
          <div role="alert" className="alert mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-info shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>documentmanager/</span>
          </div>
          <div className="flex justify-between mb-4">
            <button
              className="btn"
              onClick={() => document.getElementById("my_modal_1").showModal()}
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Create Folder
            </button>
            <dialog id="my_modal_1" className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-lg">Create folder</h3>
                <p className="py-4">
                  <input
                    type="text"
                    placeholder="Type here"
                    className={`input input-bordered input-info w-full`}
                    value={newFolderName}
                    onChange={(e) => {
                      setNewFolderName(e.target.value);
                      setError(false); // Reset error when input changes
                    }}
                  />
                  {error && <p className="text-red-500">{errorMessage}</p>}
                </p>
                <div className="modal-action">
                  <button
                    className="btn mr-2"
                    onClick={() => {
                      document.getElementById("my_modal_1").close();
                      // Reset error state when modal is closed
                      setError(false);
                      setErrorMessage("");
                    }}
                  >
                    Close
                  </button>
                  <button className="btn" onClick={handleCreateFolder}>
                    Create
                  </button>
                </div>
              </div>
            </dialog>
            {selectedFolders.length > 0 && (
              <div>
                <button className="join-item btn">
                  {selectedFolders.length} selected
                </button>
              </div>
            )}
          </div>

          <table className="table w-full">
            <thead>
              <tr>
                <th></th>
                <th>Folder Name</th>
                <th>Created At</th>
                <th>Selected At</th>
                <th>
                  <label>
                    <input type="checkbox" className="checkbox" />
                  </label>
                </th>
              </tr>
            </thead>
            <tbody>
              {folders.map((folder, index) => (
                <tr key={index}>
                  <td>
                    <FaFolder />
                  </td>
                  <td className="hover:underline cursor-pointer">
                    <Link to={`/app/documentmanager/${folder.id}`}>
                      {folder.title}
                    </Link>
                  </td>
                  <td>
                    {moment(folder.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                  </td>
                  <td>
                    {moment(folder.updatedAt).format("YYYY-MM-DD HH:mm:ss")}
                  </td>
                  <td className="flex">
                    <input
                      type="checkbox"
                      className="checkbox"
                      onChange={() => handleFolderSelect(folder)}
                      checked={selectedFolders.includes(folder)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
      </TitleCard>
    </>
  );
};

export default FoldersList;
