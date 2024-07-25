import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { FaFolder } from "react-icons/fa";

const SubfolderList = ({ subfolders }) => (
  <tbody>
    {subfolders.map((folder) => (
      <tr key={folder.id}>
        <td>
          <FaFolder />
        </td>
        <td className="hover:underline cursor-pointer">
          <Link to={`/app/documentmanager/${folder.id}`}>{folder.title}</Link>
        </td>
        <td>{moment(folder.createdAt).format("YYYY-MM-DD HH:mm:ss")}</td>
        <td>{moment(folder.updatedAt).format("YYYY-MM-DD HH:mm:ss")}</td>
        <td className="flex">
          <input type="checkbox" className="checkbox" />
        </td>
      </tr>
    ))}
  </tbody>
);

export default SubfolderList;
