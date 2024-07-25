import React, { useState, useEffect } from "react";
import TitleCard from "../../components/Cards/TitleCard";
import moment from "moment";
import axios from "axios";
import SearchBar from "../../components/Input/SearchBar";
import { FaFolder } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FileIcon, defaultStyles } from "react-file-icon";
import DocViewer from "react-doc-viewer";
import pdfToText from "react-pdftotext";
import SubfolderList from "./components/SubFolderList";
import FileList from "./components/FileList";
import SupplierQuotation from "./components/SupplierQuotationList";
import SupplierPo from "./components/SupplierPOList";
import SupplierInvoice from "./components/SupplierInvoiceList";

const FolderData = ({ folderId }) => {
  const [folderData, setFolderData] = useState({});
  const [searchText, setSearchText] = useState("");
  const [selectedFolders, setSelectedFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([folderId]);
  const [newFolderName, setNewFolderName] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [linkedFile, setIsLinkedFile] = useState(false);
  const [chosenType, setChosenType] = useState("");
  const [optionData, setOptionData] = useState([]);
  const [poOptionData, setpoOptionData] = useState([]);
  const [quotationOptionData, setQuotationOptionData] = useState([]);
  const [invoiceOptionData, setInvoiceOptionData] = useState([]);
  const [quotationId, setQuotationId] = useState("");
  const [poId, setPoId] = useState("");
  const [invoiceId, setInvoiceId] = useState("");
  const [paymentHistoryId, setPaymentHistoryId] = useState("");
  const [selectedQuotation, setSelectedQuotation] = useState("");
  const [selectedPO, setSelectedPO] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState("");

  useEffect(() => {
    const fetchFolderData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_NODE_API_SERVER}folder/getAllSubFolderandFile/${folderId}`
        );
        setFolderData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching folder data:", error);
        setLoading(false);
      }
    };

    fetchAllQuotation();
    fetchAllPO();
    fetchAllInvoice();
    fetchFolderData();
  }, [folderId]);

  const fetchAllPO = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_NODE_API_SERVER}supplier/po/getAll`
      );
      setpoOptionData(response.data.supplierPO);
    } catch (error) {
      console.error("Error fetching folder data:", error);
    }
  };
  const fetchAllQuotation = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_NODE_API_SERVER}supplier/quotation/getAll`
      );
      setQuotationOptionData(response.data.supplierQuotation);
    } catch (error) {
      console.error("Error fetching folder data:", error);
    }
  };

  const fetchAllInvoice = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_NODE_API_SERVER}supplier/invoice/getAll`
      );
      setInvoiceOptionData(response.data.supplierInvoice);
    } catch (error) {
      console.error("Error fetching folder data:", error);
    }
  };

  function extractText(event) {
    const file = event.target.files[0];
    pdfToText(file)
      .then((text) => console.log(text))
      .catch((error) => console.error("Failed to extract text from pdf"));
  }

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  const handleCreateFolder = async () => {
    try {
      if (!newFolderName.trim()) {
        setError(true);
        setErrorMessage("Folder name cannot be empty.");
        return;
      }
      const response = await axios.post(
        `${process.env.REACT_APP_NODE_API_SERVER}folder/createFolder`,
        {
          title: newFolderName,
          parentFolderId: folderId,
        }
      );
      document.getElementById("my_modal_8").close();
      // If successful, refetch the folder data
      fetchFolderData();
      setShowCreateModal(false);
      setNewFolderName("");
      setError(false);
      setErrorMessage("");
    } catch (error) {
      console.error("Error creating folder:", error);
    }
  };

  const handleFileUpload = async () => {
    const formData = new FormData();

    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      console.log("Folder Id", folderId);
      const response = await axios.post(
        `${process.env.REACT_APP_NODE_API_SERVER}files/upload/${folderId}`,
        formData
      );
      fetchFolderData();
      document.getElementById("my_modal_9").close();
    } catch (error) {
      console.error("Error uploading files:", error);
      setError(true);
      setErrorMessage("Error uploading files");
    } finally {
      setError(false);
      setErrorMessage("");
    }
  };

  const fetchFolderData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_NODE_API_SERVER}folder/getAllSubFolderandFile/${folderId}`
      );
      setFolderData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching folder data:", error);
      setLoading(false);
    }
  };

  const handleTypeChange = (type) => {
    setChosenType(type);
    setIsLinkedFile(true);

    switch (type) {
      case "quotation":
        setOptionData(quotationOptionData);
        break;
      case "po":
        setOptionData(quotationOptionData);
        break;
      case "invoice":
        setOptionData(poOptionData);
        break;
      case "payment":
        setOptionData(invoiceOptionData);
        break;
      default:
        setOptionData([]);
    }
  };

  const handleQuotationIdChange = (event) => {
    setQuotationId(event.target.value);
  };

  const handlePOIdChange = (event) => {
    setPoId(event.target.value);
  };

  const handleInvoiceId = (event) => {
    setInvoiceId(event.target.value);
  };

  const hanldePaymentHistoryId = (event) => {
    setPaymentHistoryId(event.target.value);
  };

  const handleQuotationOptionChange = (event) => {
    setSelectedQuotation(event.target.value);
  };

  const handlePOOptionChange = (event) => {
    setSelectedPO(event.target.value);
  };

  const handleInvoiceOptionChange = (event) => {
    setSelectedInvoice(event.target.value);
  };

  const handleQuatationUpload = async () => {
    const formData = new FormData();

    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      if (quotationId === "") {
        setError(true);
        setErrorMessage("Please fill in quotationId");
        return;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_NODE_API_SERVER}supplier/quotation/upload/${quotationId}/${folderId}`,
        formData
      );

      fetchFolderData();
      document.getElementById("my_modal_9").close();
    } catch (error) {
      console.error("Error uploading files:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Error uploading files");
      }
      setError(true);
    } finally {
      setError(false);
    }
  };

  const handlePOUpload = async () => {
    const formData = new FormData();

    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      if (poId === "") {
        setError(true);
        setErrorMessage("Please fill in poId");
        return;
      }
      const response = await axios.post(
        `${process.env.REACT_APP_NODE_API_SERVER}supplier/po/upload/${selectedQuotation}/${folderId}/${poId}`,
        formData
      );

      fetchFolderData();
      document.getElementById("my_modal_9").close();
    } catch (error) {
      console.error("Error uploading files:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Error uploading files");
      }
      setError(true);
    } finally {
      setError(false);
    }
  };

  const handleInvoiceUpload = async () => {
    const formData = new FormData();

    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      if (invoiceId === "") {
        setError(true);
        setErrorMessage("Please fill in invoice Id");
        return;
      }
      const response = await axios.post(
        `${process.env.REACT_APP_NODE_API_SERVER}supplier/invoice/upload/${selectedPO}/${folderId}/${invoiceId}`,
        formData
      );

      fetchFolderData();
      document.getElementById("my_modal_9").close();
    } catch (error) {
      console.error("Error uploading files:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Error uploading files");
      }
      setError(true);
    } finally {
      setError(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    console.log(folderData),
    (
      <>
        <TitleCard
          title="Folder"
          topMargin="mt-2"
          TopSideButtons={
            <SearchBar
              searchText={searchText}
              setSearchText={setSearchText}
              placeholder="Search folders"
            />
          }
        >
          <div className="w-full overflow-auto">
            <dialog id="my_modal_8" className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-lg">Create Folder</h3>
                <p className="py-4">
                  <input
                    type="text"
                    placeholder="Type here"
                    className="input input-bordered input-info w-full"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                  />
                </p>
                {error && <p className="text-red-500">{errorMessage}</p>}
                <div className="modal-action">
                  <button
                    className="btn"
                    onClick={() =>
                      document.getElementById("my_modal_8").close()
                    }
                  >
                    Close
                  </button>

                  <button className="btn" onClick={handleCreateFolder}>
                    Create
                  </button>
                </div>
              </div>
            </dialog>
            <dialog id="my_modal_9" className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-lg">File Upload</h3>
                <input
                  type="file"
                  className="file-input w-full mt-4"
                  accept=".pdf,.doc,.docx,.txt,.xlsx,.xls"
                  multiple
                  onChange={(e) => handleFileSelect(e)}
                />
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">
                      Link file to sales progress
                    </span>
                    <input
                      type="checkbox"
                      className="toggle"
                      onChange={(e) => setIsLinkedFile(e.target.checked)}
                      checked={linkedFile}
                    />
                  </label>
                  {!linkedFile && (
                    <div className="modal-action">
                      <form method="dialog" className="space-x-3">
                        <button className="btn">Close</button>
                        <button className="btn" onClick={handleFileUpload}>
                          Upload
                        </button>
                      </form>
                    </div>
                  )}
                  {linkedFile && (
                    <div className="space-y-2">
                      <select className="select select-bordered w-full max-w-xs">
                        <option disabled selected>
                          Choose Type
                        </option>
                        <option>Supplier</option>
                        <option>Customer/Client</option>
                      </select>
                      <select
                        className="select select-bordered w-full max-w-xs"
                        onChange={(e) => handleTypeChange(e.target.value)}
                        value={chosenType}
                      >
                        <option disabled value="">
                          Choose option
                        </option>
                        <option value="quotation">Quotation</option>
                        <option value="po">Purchase Order (PO)</option>
                        <option value="invoice">Invoice</option>
                        <option value="payment">Payment Receipt</option>
                      </select>
                      {chosenType === "quotation" && (
                        <>
                          <input
                            type="text"
                            placeholder="Enter quotation ID"
                            className="input input-bordered input-info w-full"
                            value={quotationId}
                            onChange={handleQuotationIdChange}
                          />
                          {error && (
                            <p className="text-red-500">{errorMessage}</p>
                          )}

                          <div className="modal-action">
                            <button className="btn">Close</button>
                            <button
                              className="btn"
                              onClick={handleQuatationUpload}
                            >
                              Upload Quotation
                            </button>
                          </div>
                        </>
                      )}
                      {chosenType === "po" && (
                        <>
                          <select
                            className="select select-bordered w-full max-w-xs"
                            value={selectedQuotation}
                            onChange={handleQuotationOptionChange}
                          >
                            <option disabled selected>
                              Choose Quotation To Link
                            </option>
                            {optionData.map((po) => (
                              <option key={po.id} value={po.qId}>
                                {po.qId}
                              </option>
                            ))}
                          </select>
                          <input
                            type="text"
                            placeholder="Enter PO ID"
                            className="input input-bordered input-info w-full"
                            value={poId}
                            onChange={handlePOIdChange}
                          />
                          <div className="modal-action">
                            <form method="dialog" className="space-x-3">
                              <button className="btn">Close</button>
                              <button className="btn" onClick={handlePOUpload}>
                                Upload PO
                              </button>
                            </form>
                          </div>
                        </>
                      )}
                      {chosenType === "invoice" && (
                        <>
                          <select
                            className="select select-bordered w-full max-w-xs"
                            value={selectedPO}
                            onChange={handlePOOptionChange}
                          >
                            <option disabled selected>
                              Choose PO to Link
                            </option>
                            {optionData.map((i) => (
                              <option key={i.id} value={i.poId}>
                                {i.poId}
                              </option>
                            ))}
                          </select>
                          <input
                            type="text"
                            placeholder="Enter Invoice ID"
                            className="input input-bordered input-info w-full"
                            value={invoiceId}
                            onChange={handleInvoiceId}
                          />
                          <div className="modal-action">
                            <form method="dialog" className="space-x-3">
                              <button className="btn">Close</button>
                              <button
                                className="btn"
                                onClick={handleInvoiceUpload}
                              >
                                Upload Invoice
                              </button>
                            </form>
                          </div>
                        </>
                      )}
                      {chosenType === "payment" && (
                        <>
                          <select
                            className="select select-bordered w-full max-w-xs"
                            value={selectedInvoice}
                            onChange={handleInvoiceOptionChange}
                          >
                            <option disabled selected>
                              Choose Invoice to Link
                            </option>
                            {optionData.map((ph) => (
                              <option key={ph.id} value={ph.id}>
                                {ph.invoiceId}
                              </option>
                            ))}
                          </select>
                          <input
                            type="text"
                            placeholder="Enter Paymemt History ID"
                            className="input input-bordered input-info w-full"
                            value={paymentHistoryId}
                            onChange={hanldePaymentHistoryId}
                          />
                          <div className="modal-action">
                            <form method="dialog" className="space-x-3">
                              <button className="btn">Close</button>
                              <button
                                className="btn"
                                onClick={handleFileUpload}
                              >
                                Upload Payment Receipt
                              </button>
                            </form>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </dialog>

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
              <span>
                documentmanager/{folderData.path}
                {folderData.folderTitle}
              </span>
            </div>
            <div className="join flex justify-between mt-2 mb-2">
              <div className="dropdown">
                <div tabIndex={0} role="button" className="btn m-1">
                  Action
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-[1] menu p-2 space-y-2 shadow bg-base-100 rounded-box w-52"
                >
                  <li>
                    <button
                      className="btn"
                      onClick={() =>
                        document.getElementById("my_modal_9").showModal()
                      }
                    >
                      Upload File
                    </button>
                  </li>
                  <li>
                    <button
                      className="btn"
                      onClick={() =>
                        document.getElementById("my_modal_8").showModal()
                      }
                    >
                      Create Folder
                    </button>
                  </li>
                </ul>
              </div>
              {selectedFolders.length > 0 && (
                <button className="join-item btn">
                  {selectedFolders.length} selected
                </button>
              )}
            </div>
            <table className="table w-full">
              <thead>
                <tr>
                  <th></th>
                  <th>Folder/File Name</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                  <th>
                    <label>
                      <input type="checkbox" className="checkbox" />
                    </label>
                  </th>
                </tr>
              </thead>

              <SubfolderList subfolders={folderData.subfolders} />
              <SupplierQuotation
                supplierQuotations={folderData.supplierQuotation}
                quotationFileExtensions={folderData.quotationfileExtensions}
              />
              <SupplierPo
                supplierPO={folderData.supplierPO}
                poExtensions={folderData.poExtentions}
              />
              <SupplierInvoice
                supplierInvoice={folderData.supplierInvoice}
                invoiceExtensions={folderData.invoiceExtensions}
              />
              <FileList
                filesData={folderData.files}
                extensions={folderData.fileExtensions}
              />
            </table>
          </div>
        </TitleCard>
      </>
    )
  );
};

export default FolderData;
