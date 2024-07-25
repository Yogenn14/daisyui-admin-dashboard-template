import React, { useState, useEffect } from "react";
import { DocumentIcon } from "@heroicons/react/24/solid";

function SalesProgressCard({ sale }) {
  return (
    <div className="max-w-md w-full mx-auto bg-white shadow-lg rounded-lg overflow-hidden mb-8">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800">Supplier</h2>
        <div className="divider mt-0"></div>

        <AccordionSection
          title="Quotation"
          files={sale.quotation ? [sale.quotation.filename] : []}
        />
        <AccordionSection title="PO" files={sale.po.map((po) => po.filename)} />
        <AccordionSection
          title="Invoice"
          files={sale.invoice.map((invoice) => invoice.filename)}
          defaultClosed={sale.invoice.length === 0}
        />
        <AccordionSection
          title="Payment History"
          files={sale.paymentHistory.map((ph) => ph.filename)}
          defaultClosed={sale.paymentHistory.length === 0}
        />
      </div>
    </div>
  );
}

function AccordionSection({ title, files, defaultClosed }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-4">
      <div
        className={`flex items-center cursor-pointer ${
          files.length === 0 ? "opacity-50" : ""
        }`}
        onClick={() => files.length > 0 && setOpen(!open)}
      >
        |_
        <DocumentIcon className="h-5 w-5 text-gray-600 mr-2" />
        <span className="font-semibold text-gray-800">{title}</span>
      </div>
      {open && files.length > 0 && (
        <div className="ml-4 flex">
          <ul className="hover:cursor-pointer">
            {files.map((file, index) => (
              <li key={index}>{file}</li>
            ))}
          </ul>
          <span className="font-semibold text-gray-800">
            <div className="tooltip tooltip-bottom" data-tip="replace">
              <button className="btn btn-square btn-xs">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"
                  />
                </svg>
              </button>
            </div>
          </span>
        </div>
      )}
    </div>
  );
}

function SalesProgressCards() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_NODE_API_SERVER}supplier/getAllSales`
        );
        if (response.ok) {
          const data = await response.json();
          setSales(data.sales);
        } else {
          console.error("Failed to fetch sales data");
        }
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchSales();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {sales.map((sale, index) => (
        <SalesProgressCard key={index} sale={sale} />
      ))}
    </div>
  );
}

export default SalesProgressCards;
