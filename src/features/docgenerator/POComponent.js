import React, { useRef } from "react";

const POComponent = ({ poNum, setPoNum }) => {
  const poRef = useRef();

  const handlePrint = () => {
    const printContent = poRef.current;
    const printWindow = window.open("", "", "width=595,height=842");
    printWindow.document.write(`
      <html>
        <head>
          <title>Purchase Order</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              padding: 0;
            }
            .po-container {
              width: 100%;
              margin: 0 auto;
            }
            .flex {
              display: flex;
            }
            .justify-between {
              justify-content: space-between;
            }
            .items-center {
              align-items: center;
            }
            .text-center {
              text-align: center;
            }
            .text-right {
              text-align: right;
            }
            .mt-4 {
              margin-top: 1rem;
            }
            .mb-4 {
              margin-bottom: 1rem;
            }
            .w-1/4 {
              width: 25%;
            }
            .w-3/4 {
              width: 75%;
            }
            .w-full {
              width: 100%;
            }
            .text-xs {
              font-size: 0.75rem;
            }
            .font-bold {
              font-weight: bold;
            }
            .table {
              width: 100%;
              border-collapse: collapse;
            }
            .border {
              border: 1px solid #ccc;
            }
            .px-4 {
              padding-left: 1rem;
              padding-right: 1rem;
            }
            .py-2 {
              padding-top: 0.5rem;
              padding-bottom: 0.5rem;
            }
            .bg-blue-300 {
              background-color: #93c5fd;
            }
            .leading-8 {
              line-height: 2rem;
            }
            .logo img {
              max-width: 90px; /* Set a specific max width for the logo */
              height: auto;
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div>
      <button
        onClick={handlePrint}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Print
      </button>
      <div ref={poRef} className="po-container mt-4">
        {/* Logo and Address Section */}
        <div className="flex justify-between items-center mb-4">
          {/* Logo */}
          <div className="logo w-1/5">
            <img src={`/gmt.png`} alt="Company Logo" />
          </div>
          <div className="address w-3/4 text-center">
            <p className="font-bold text-xs font-verdana">
              GRAND MILLENNIUM TECHNOLOGY SDN BHD (1518495-W)
            </p>
            <p className="text-xs">
              198, Jalan Batik 2/1A, Taman Batik,08000 Sungai Petani, Kedah,
              Malaysia
            </p>
            <p className="text-xs">
              TEL : +6044411717 / +60125599032 / +60125599081
            </p>
            <p className="text-xs">
              Email: alex@grandmtech.com / than@grandmtech.com
            </p>
            <p className="text-xs">Website: www.grandmtech.com</p>
          </div>
          {/* PO Details */}
          <div className="po-header w-1/3 text-right text-xs">
            <h2 className="font-bold">Purchase Order</h2>
            <p>PO NO : {poNum}</p>
            <p>Date: 7-NOV-2023</p>
            <p>Page : 1 of 1</p>
          </div>
        </div>

        <div className="address-table-container mb-4">
          <table className="table w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2 font-bold bg-blue-300 text-black">
                  Vendor Address
                </th>
                <th className="border border-gray-300 px-4 py-2 bg-blue-300 text-black">
                  Ship To Address
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  <p>Vendor Company Name</p>
                  <p>Vendor Street Address</p>
                  <p>Vendor City, State ZIP</p>
                  <p>Vendor Country</p>
                  <p>Vendor Phone</p>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-xs leading-8">
                  {/* Ship To Address Content */}
                  <p>GRAND MILLENNIUM TECHNOLOGY SDN.BHD (1518495-W)</p>
                  <p>198, Jalan Batik 2/1A, Taman Batik,</p>
                  <p>08000 Sungai Petani, Kedah, Malaysia</p>
                  <p>Tel : +60125599032</p>
                  <p>Email : alex@grandmtech.com</p>
                  <p>Attn : Mr.Alex</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Tables Section */}
        <div className="tables-container">
          <table className="table w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Line</th>
                <th className="border border-gray-300 px-4 py-2">
                  Part No/Description
                </th>
                <th className="border border-gray-300 px-4 py-2">Quantity</th>
                <th className="border border-gray-300 px-4 py-2">UOM</th>
                <th className="border border-gray-300 px-4 py-2">Unit Price</th>
                <th className="border border-gray-300 px-4 py-2">Amount</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>

          {/* Additional Notes Section */}
          <div className="notes mt-4">
            <p>
              This is a computer-generated Purchase Order. No signature is
              required.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POComponent;
