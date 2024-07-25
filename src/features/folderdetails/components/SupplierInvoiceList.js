import React from "react";
import moment from "moment";
import { FileIcon, defaultStyles } from "react-file-icon";
import CustomLink from "../CustomLink";

const POlist = ({ supplierInvoice, invoiceExtensions }) => {
  const getSanitizedFilePath = (filePath) => {
    const decodedFilePath = decodeURIComponent(filePath);
    if (decodedFilePath.startsWith("public\\")) {
      return filePath.substring(7);
    } else if (decodedFilePath.startsWith("public/")) {
      return filePath.substring(7);
    }
    return filePath;
  };

  return (
    <tbody>
      {supplierInvoice.map((file, index) => {
        const fileExtension = Array.isArray(invoiceExtensions)
          ? invoiceExtensions[index].slice(1)
          : "";
        const sanitizedPath = getSanitizedFilePath(file.filePath);

        return (
          <tr key={file.id}>
            <td className="w-14 h-14">
              {" "}
              <FileIcon
                extension={fileExtension}
                {...defaultStyles[fileExtension]}
              />
            </td>
            <td className="hover:underline cursor-pointer">
              <CustomLink
                to={`/app/viewPdf?filePath=${encodeURIComponent(
                  sanitizedPath
                )}`}
              >
                {file.filename}
              </CustomLink>
            </td>
            <td>{moment(file.createdAt).format("YYYY-MM-DD HH:mm:ss")}</td>
            <td>{moment(file.updatedAt).format("YYYY-MM-DD HH:mm:ss")}</td>
            <td className="flex">
              <input type="checkbox" className="checkbox" />
            </td>
          </tr>
        );
      })}
    </tbody>
  );
};

export default POlist;
