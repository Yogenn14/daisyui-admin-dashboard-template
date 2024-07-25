import React from "react";

const Alert = () => {
  return (
    <div role="alert" className="alert shadow-xl mb-4">
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
      <div>
        <h3 className="font-bold">Inventory Testing and Development Phase</h3>
        <div className="divider mb-0 mt-0"></div>
        <div className="text-xs mb-2">Dear Staff/Employees of GMT,</div>
        <div className="text-xs">
          This web application is currently in the testing and development
          phase. It is hosted on a local network server, and anyone connected to
          the same LAN can access it. The server runs continuously (24/7) to
          allow for thorough testing of the inventory logic and features.
        </div>
        <div className="text-xs mt-2">
          We invite you to explore and test the application. If you encounter
          any bugs, issues, or have any questions, please contact Yogenthirran
          at <a href="mailto:dhia@grandmtech.com">dhia@grandmtech.com</a>. Your
          feedback is invaluable to us and will help improve the application.
        </div>
      </div>
    </div>
  );
};

export default Alert;
