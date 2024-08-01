import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useSearchParams } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Pagination from "@mui/material/Pagination";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import ShipOutModal from "./ShipOutModal";
import ShipOutUnsModal from "./ShipOutUnsModal";
import UnserializedForm from "./UnserializedForm";

function Row(props) {
  const { row } = props;
  const [open, setOpen] = useState(false);
  const [shipOutMode, setShipOutMode] = useState(false);
  const [selectedSerialNumbers, setSelectedSerialNumbers] = useState([]);
  const [shipModal, setShipModal] = useState(false);
  const [unserializedModal, setunserializedModal] = useState(false);
  const [selectedUnsPN, setSelectedUnsPN] = useState("");
  const [selectedUnsPD, setSelectedUnsPD] = useState("");
  const [selectedUnsInvId, setSelectedUnsInvId] = useState(0);
  const [shipOutUnsModal, setshipOutUnsModal] = useState(false);
  const [outunsID, setoutunsID] = useState(0);

  const handleShipOutClick = () => {
    setShipOutMode(!shipOutMode);
  };

  const handleCheckboxChange = (serialNumber) => {
    setSelectedSerialNumbers((prevSelected) =>
      prevSelected.includes(serialNumber)
        ? prevSelected.filter((num) => num !== serialNumber)
        : [...prevSelected, serialNumber]
    );
  };

  const handleShipOut = () => {
    setShipModal(true);
  };

  const handleUnsShipOut = (id, unsID) => {
    setshipOutUnsModal(true);
    setSelectedUnsInvId(id);
    setoutunsID(unsID);
  };

  const handleUnserializedIn = (partNumber, partDescription, id) => {
    setSelectedUnsPN(partNumber);
    setSelectedUnsPD(partDescription);
    setSelectedUnsInvId(id);
    setunserializedModal(true);
  };

    const formatToMalaysianTime = (utcTime) => {
    const date = new Date(utcTime);
    const options = {
      timeZone: "Asia/Kuala_Lumpur",
      year: "numeric",
      month: "long",
      day: "numeric",
     
    };
    return date.toLocaleString("en-US", options);
  };

  const cellBorderStyle = {
    borderRight: "1px solid rgba(224, 224, 224, 1)",
    borderTop: "1px solid rgba(224, 224, 224, 1)",
    borderLeft: "1px solid rgba(224, 224, 224, 1)",
  };

  return (
    console.log("row", row),
    (
      <React.Fragment>
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
          <TableCell sx={cellBorderStyle}>
            {row.type === "serialized" || row.type === "non-serialized" ? (
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => setOpen(!open)}
              >
                {open ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
              </IconButton>
            ) : null}
          </TableCell>
          <TableCell component="th" scope="row" sx={cellBorderStyle}>
            {row.partNumber}
          </TableCell>
          <TableCell align="right" sx={cellBorderStyle}>
            {row.description}
          </TableCell>
          <TableCell align="right" sx={cellBorderStyle}>
            {row.type}
          </TableCell>
          <TableCell align="right" sx={cellBorderStyle}>
            {row.quantity}
          </TableCell>
          <TableCell align="right" sx={cellBorderStyle}>
            {(row.inDate)}
          </TableCell>
          <TableCell align="right" sx={cellBorderStyle}>
            {row.outDate === null ? "-" : row.outDate}
          </TableCell>
          <TableCell align="right" sx={cellBorderStyle}>
            {row.type === "serialized" ? "-" : row.serialData.condition || "-"}
          </TableCell>
          <TableCell align="right" sx={cellBorderStyle}>
            {row.type === "serialized" ? "-" : row.serialData.status || "-"}
          </TableCell>
          <TableCell align="right" sx={cellBorderStyle}>
            {row.type === "serialized"
              ? "-"
              : row.serialData.manufacturer || "-"}
          </TableCell>
          <TableCell align="right" sx={cellBorderStyle}>
            {row.userEmail}
          </TableCell>
        </TableRow>
        {row.type === "serialized" && (
          <>
            <TableRow>
              <TableCell
                style={{ paddingBottom: 0, paddingTop: 0 }}
                colSpan={12}
              >
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <Box sx={{ margin: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginBottom: 1,
                      }}
                    >
                      <Button
                        variant="contained"
                        size="small"
                        onClick={handleShipOutClick}
                      >
                        {shipOutMode ? "Cancel" : "Select"}
                      </Button>
                    </Box>
                    <Table size="small" aria-label="serial details">
                      <TableHead>
                        <TableRow>
                          {shipOutMode && (
                            <TableCell sx={cellBorderStyle}>Ship Out</TableCell>
                          )}
                          <TableCell sx={cellBorderStyle}>
                            Serial Number
                          </TableCell>
                          <TableCell sx={cellBorderStyle}>Condition</TableCell>
                          <TableCell align="right" sx={cellBorderStyle}>
                            Status
                          </TableCell>
                          <TableCell align="right" sx={cellBorderStyle}>
                            Manufacturer/OEM
                          </TableCell>
                          <TableCell align="right" sx={cellBorderStyle}>
                            Unit Price
                          </TableCell>
                          <TableCell align="right" sx={cellBorderStyle}>
                            In Date
                          </TableCell>
                          <TableCell align="right" sx={cellBorderStyle}>
                            Warranty End Date
                          </TableCell>
                          <TableCell align="right" sx={cellBorderStyle}>
                            Out Date
                          </TableCell>
                          <TableCell align="right" sx={cellBorderStyle}>
                            Supplier
                          </TableCell>
                          <TableCell align="right" sx={cellBorderStyle}>
                            Customer
                          </TableCell>
                          <TableCell align="right" sx={cellBorderStyle}>
                            User Email
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {row.serialData.map((serialRow) => (
                          <TableRow key={serialRow.serialNumber}>
                            {shipOutMode && (
                              <TableCell sx={cellBorderStyle}>
                                <Checkbox
                                  checked={selectedSerialNumbers.includes(
                                    serialRow.serialNumber
                                  )}
                                  onChange={() =>
                                    handleCheckboxChange(serialRow.serialNumber)
                                  }
                                  disabled={!!serialRow.outDate}
                                />
                              </TableCell>
                            )}
                            <TableCell
                              component="th"
                              scope="row"
                              sx={cellBorderStyle}
                            >
                              {serialRow.serialNumber}
                            </TableCell>
                            <TableCell sx={cellBorderStyle}>
                              {serialRow.condition}
                            </TableCell>
                            <TableCell align="right" sx={cellBorderStyle}>
                              {serialRow.status}
                            </TableCell>
                            <TableCell align="right" sx={cellBorderStyle}>
                              {serialRow.manufacturer}
                            </TableCell>
                            <TableCell align="right" sx={cellBorderStyle}>
                              {serialRow.unitPrice}
                            </TableCell>
                            <TableCell align="right" sx={cellBorderStyle}>
                              {formatToMalaysianTime(serialRow.inDate)}
                            </TableCell>
                            <TableCell align="right" sx={cellBorderStyle}>
                            {serialRow.warrantyEndDate ? formatToMalaysianTime(serialRow.warrantyEndDate) : "N/A"}
                            </TableCell>
                            <TableCell align="right" sx={cellBorderStyle}>
                            {serialRow.outDate ? formatToMalaysianTime(serialRow.outDate) : "N/A"}
                            </TableCell>
                            <TableCell align="right" sx={cellBorderStyle}>
                              {serialRow.supplier}
                            </TableCell>
                            <TableCell align="right" sx={cellBorderStyle}>
                              {serialRow.customer}
                            </TableCell>
                            <TableCell align="right" sx={cellBorderStyle}>
                              {serialRow.userEmail}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {shipOutMode && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          marginTop: 2,
                        }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={handleShipOut}
                        >
                          Ship Out
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Collapse>
              </TableCell>
            </TableRow>
          </>
        )}
        {row.type === "non-serialized" && (
          <>
            <TableRow>
              <TableCell
                style={{ paddingBottom: 0, paddingTop: 0 }}
                colSpan={12}
              >
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <Box sx={{ margin: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginBottom: 1,
                        gap: 1,
                      }}
                    >
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() =>
                          handleUnserializedIn(
                            row.partNumber,
                            row.description,
                            row.id
                          )
                        }
                      >
                        Item In
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={handleShipOutClick}
                      >
                        Ship Out
                      </Button>
                    </Box>
                    <Table
                      size="small"
                      aria-label="non-serialized details"
                      className="mt-2"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell sx={cellBorderStyle}>Condition</TableCell>
                          <TableCell align="right" sx={cellBorderStyle}>
                            Status
                          </TableCell>
                          <TableCell align="right" sx={cellBorderStyle}>
                            Manufacturer/OEM
                          </TableCell>
                          <TableCell align="right" sx={cellBorderStyle}>
                            In Date
                          </TableCell>
                          <TableCell align="right" sx={cellBorderStyle}>
                            Stock
                          </TableCell>
                          <TableCell align="right" sx={cellBorderStyle}>
                            Total Added
                          </TableCell>
                          <TableCell align="right" sx={cellBorderStyle}>
                            Unit Price
                          </TableCell> 
                           <TableCell align="right" sx={cellBorderStyle}>
                            Total Price
                          </TableCell>
                          <TableCell align="right" sx={cellBorderStyle}>
                            Supplier
                          </TableCell>
                          
                          <TableCell align="right" sx={cellBorderStyle}>
                            User Email
                          </TableCell>
                          <TableCell align="right" sx={cellBorderStyle}>
                            Action
                          </TableCell>
                          <TableCell align="right" sx={cellBorderStyle}>
                            Customer Details
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {row.unserialData.map((unserialRow) => (
                          <React.Fragment key={unserialRow.date}>
                            <TableRow>
                              <TableCell
                                component="th"
                                scope="row"
                                sx={cellBorderStyle}
                              >
                                {unserialRow.condition}
                              </TableCell>
                              <TableCell align="right" sx={cellBorderStyle}>
                                {unserialRow.status}
                              </TableCell>
                              <TableCell align="right" sx={cellBorderStyle}>
                                {unserialRow.manufacturer}
                              </TableCell>
                              <TableCell align="right" sx={cellBorderStyle}>
                                {unserialRow.date}
                              </TableCell>
                              <TableCell align="right" sx={cellBorderStyle}>
                                <p
                                  className={
                                    unserialRow.quantity < 5
                                      ? "text-red-500"
                                      : "text-black"
                                  }
                                >
                                  {unserialRow.quantity}
                                </p>
                              </TableCell>
                              <TableCell align="right" sx={cellBorderStyle}>
                                <p>{unserialRow.totalPurchased}</p>
                              </TableCell>
                              <TableCell align="right" sx={cellBorderStyle}>
                                <p>{unserialRow.unitPrice}</p>
                              </TableCell>
                              <TableCell align="right" sx={cellBorderStyle}>
                                <p>{unserialRow.totalPrice}</p>
                              </TableCell>
                              <TableCell align="right" sx={cellBorderStyle}>
                                {unserialRow.supplier}
                              </TableCell>
                              <TableCell align="right" sx={cellBorderStyle}>
                                {unserialRow.userEmail}
                              </TableCell>
                              <TableCell align="right" sx={cellBorderStyle}>
                                <Button
                                  variant="contained"
                                  size="small"
                                  onClick={() =>
                                    handleUnsShipOut(row.id, unserialRow.unsID)
                                  }
                                  disabled={unserialRow.quantity <= 0}
                                >
                                  Ship Out
                                </Button>
                              </TableCell>
                              <TableCell align="right" sx={cellBorderStyle}>
                                {unserialRow.unserializedOut.length > 0 && (
                                  <Collapse
                                    in={open}
                                    timeout="auto"
                                    unmountOnExit
                                  >
                                    <Table
                                      size="small"
                                      aria-label="unserialized out details"
                                    >
                                      <TableHead>
                                        <TableRow>
                                          <TableCell sx={cellBorderStyle}>
                                            Customer Name
                                          </TableCell>
                                          <TableCell
                                            align="right"
                                            sx={cellBorderStyle}
                                          >
                                            Quantity Out
                                          </TableCell>
                                          <TableCell
                                            align="right"
                                            sx={cellBorderStyle}
                                          >
                                            Date
                                          </TableCell>
                                          <TableCell
                                            align="right"
                                            sx={cellBorderStyle}
                                          >
                                            Selling Price Per Unit
                                          </TableCell>
                                          <TableCell
                                            align="right"
                                            sx={cellBorderStyle}
                                          >
                                            Profit Per Unit
                                          </TableCell>
                                          <TableCell
                                            align="right"
                                            sx={cellBorderStyle}
                                          >
                                            Total Profit
                                          </TableCell>
                                          <TableCell
                                            align="right"
                                            sx={cellBorderStyle}
                                          >
                                            User Email
                                          </TableCell>
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {unserialRow.unserializedOut.map(
                                          (outItem, idx) => (
                                            <TableRow key={idx}>
                                              <TableCell sx={cellBorderStyle}>
                                                {outItem.customer}
                                              </TableCell>
                                              <TableCell
                                                align="right"
                                                sx={cellBorderStyle}
                                              >
                                                {outItem.quantity}
                                              </TableCell>
                                              <TableCell
                                                align="right"
                                                sx={cellBorderStyle}
                                              >
                                                {outItem.date}
                                              </TableCell>
                                            
                                              <TableCell
                                                align="right"
                                                sx={cellBorderStyle}
                                              >
                                                {outItem.sellingPricePerUnit}
                                              </TableCell>
                                              <TableCell
                                                align="right"
                                                sx={cellBorderStyle}
                                              >
                                                {outItem.profitPerUnit}
                                              </TableCell>
                                              <TableCell
                                                align="right"
                                                sx={cellBorderStyle}
                                              >
                                                {outItem.totalProfit}
                                              </TableCell>
                                              <TableCell
                                                align="right"
                                                sx={cellBorderStyle}
                                              >
                                                {outItem.userEmail}
                                              </TableCell>
                                            </TableRow>
                                          )
                                        )}
                                      </TableBody>
                                    </Table>
                                  </Collapse>
                                )}
                              </TableCell>
                            </TableRow>
                          </React.Fragment>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                </Collapse>
              </TableCell>
            </TableRow>
          </>
        )}

        {shipModal && (
          <ShipOutModal
            open={shipModal}
            onClose={() => setShipModal(false)}
            serialNumbers={selectedSerialNumbers}
            userEmail={props.userEmail}
            updateCounter={props.updateCounter}
            setUpdateCounter={props.setUpdateCounter}
          />
        )}
        {shipOutUnsModal && (
          <ShipOutUnsModal
            open={shipOutUnsModal}
            setshipOutUnsModal={setshipOutUnsModal}
            selectedUnsInvId={selectedUnsInvId}
            outunsID={outunsID}
          />
        )}
        {unserializedModal && (
          <UnserializedForm
            open={unserializedModal}
            closeModal={() => setunserializedModal(false)}
            partNumber={selectedUnsPN}
            partDescription={selectedUnsPD}
            inventoryId={selectedUnsInvId}
            userEmail={props.userEmail}
            updateCounter={props.updateCounter}
            setUpdateCounter={props.setUpdateCounter}
            conversionRate = {[props.conversionRate]}
          />
        )}
      </React.Fragment>
    )
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.number.isRequired,
    partNumber: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    inDate: PropTypes.string,
    outDate: PropTypes.string,
    userEmail: PropTypes.string,
    serialData: PropTypes.oneOfType([
      PropTypes.arrayOf(
        PropTypes.shape({
          serialNumber: PropTypes.string.isRequired,
          condition: PropTypes.string.isRequired,
          status: PropTypes.string.isRequired,
          manufacturer: PropTypes.string.isRequired,
          inDate: PropTypes.string,
          outDate: PropTypes.string,
          supplier: PropTypes.string,
          userEmail: PropTypes.string,
          customer: PropTypes.string,
        })
      ),
      PropTypes.shape({
        condition: PropTypes.string,
        status: PropTypes.string,
        manufacturer: PropTypes.string,
      }),
    ]),
    unserialData: PropTypes.oneOfType([
      PropTypes.arrayOf(
        PropTypes.shape({
          unsID: PropTypes.number.string,
          condition: PropTypes.string.isRequired,
          status: PropTypes.string.isRequired,
          manufacturer: PropTypes.string.isRequired,
          date: PropTypes.string,
          totalPurchased: PropTypes.number,
          supplier: PropTypes.string,
          userEmail: PropTypes.string,
          unserializedOut: PropTypes.arrayOf(
            PropTypes.shape({
              id: PropTypes.number.isRequired,
              outDate: PropTypes.string.isRequired,
              quantity: PropTypes.number.isRequired,
              customer: PropTypes.string.isRequired,
            })
          ),
        })
      ),
      PropTypes.shape({
        condition: PropTypes.string,
        status: PropTypes.string,
        manufacturer: PropTypes.string,
      }),
    ]),
  }).isRequired,
};

function SemiconductorTable({
  result,
  searchBy,
  searchQuery,
  setSearchQuery,
  updateCounter,
  userEmail,
  setUpdateCounter,
  showUpdateModal,
  setShowUpdateModal,
  conversionRate
}) {
  const [rows, setRows] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const partNum = searchParams.get("partNum");
  const partDescription = searchParams.get("partDescription");
  const decodedPartDescription = partDescription
    ? decodeURIComponent(partDescription)
    : "";
  const cleanedPartDescription = decodedPartDescription.replace(/\s+/g, " ");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${
            process.env.REACT_APP_NODE_API_SERVER
          }inventory/getInventory?page=${currentPage}&limit=10&type=${result}&partNum=${
            partNum ? partNum : ""
          }&partDescription=${partDescription ? cleanedPartDescription : ""}`
        );
        const data = await response.json();
        console.log("data", data);

        setTotalPages(data.totalPages);

        const items = data.items.map((item) => {
          if (item.type === "serialized") {
            return createData(
              item.id,
              item.partNumber,
              item.partDescription,
              item.type,
              item.quantity,
              item.inDate,
              item.outDate,
              item.userEmail,
              item.serializedItems?.map((serial) => ({
                serialNumber: serial.serialNumber,
                condition: serial.condition,
                status: serial.status,
                manufacturer: serial.manufactureroem,
                inDate: serial.inDate,
                outDate: serial.outDate,
                supplier: serial.supplier,
                userEmail: serial.userEmail,
                customer: serial.customer,
                warrantyEndDate: serial.warrantyEndDate,
                unitPrice : serial.unitPrice
              })),
              []
            );
          } else if (item.type === "non-serialized") {
            return createData(
              item.id,
              item.partNumber,
              item.partDescription,
              item.type,
              item.quantity,
              item.inDate,
              item.outDate,
              item.userEmail,
              [],
              item.unserializedIn.map((nonserial) => ({
                unsID: nonserial.id,
                condition: nonserial.condition,
                status: nonserial.status,
                manufacturer: nonserial.manufactureroem,
                date: nonserial.date,
                supplier: nonserial.supplier,
                userEmail: nonserial.userEmail,
                quantity: nonserial.quantityChange,
                totalPurchased: nonserial.totalPurchased,
                unitPrice: nonserial.unitPrice,
                totalPrice: nonserial.totalPrice,

                unserializedOut: nonserial.unserializedOut.map((outItem) => ({
                  id: outItem.id,
                  unserializedInId: outItem.unserializedInId,
                  customer: outItem.customer,
                  quantity: outItem.quantity,
                  date: outItem.date,
                  sellingPricePerUnit : outItem.shipOutPrice,
                  profitPerUnit: outItem.profitPerUnit,
                  totalProfit: outItem.totalProfit,
                  userEmail: outItem.userEmail,
                })),
              }))
            );
          }
        });
        setRows(items);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchData();
  }, [result, currentPage, partNum, updateCounter, partDescription]);

  useEffect(() => {
    setCurrentPage(1);
  }, [result]);

  useEffect(() => {
    setSearchQuery("");
    setCurrentPage(1);
  }, [partNum]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const cellBorderStyle = { borderRight: "1px solid rgba(224, 224, 224, 1)" };



  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="semiconductor table">
          <TableHead>
            <TableRow>
              <TableCell sx={cellBorderStyle} />
              <TableCell sx={cellBorderStyle}>Part Number</TableCell>
              <TableCell align="right" sx={cellBorderStyle}>
                Part Description
              </TableCell>
              <TableCell align="right" sx={cellBorderStyle}>
                Type
              </TableCell>
              <TableCell align="right" sx={cellBorderStyle}>
                Quantity
              </TableCell>
              <TableCell align="right" sx={cellBorderStyle}>
                Latest In Date
              </TableCell>
              <TableCell align="right" sx={cellBorderStyle}>
                Latest Out Date
              </TableCell>
              <TableCell align="right" sx={cellBorderStyle}>
                Condition
              </TableCell>
              <TableCell align="right" sx={cellBorderStyle}>
                Status
              </TableCell>
              <TableCell align="right" sx={cellBorderStyle}>
                Manufacturer/OEM
              </TableCell>
              <TableCell align="right" sx={cellBorderStyle}>
                Created By
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <React.Fragment key={row.id}>
                <Row
                  row={row}
                  userEmail={userEmail}
                  updateCounter={updateCounter}
                  setUpdateCounter={setUpdateCounter}
                  setShowUpdateModal={setShowUpdateModal}
                  showUpdateModal={showUpdateModal}
                  conversionRate = {conversionRate}
                />
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        count={totalPages}
        variant="outlined"
        page={currentPage}
        onChange={handlePageChange}
        shape="rounded"
        size="small"
        className="flex justify-end mt-10"
      />
    </>
  );
}

export default SemiconductorTable;

function createData(
  id,
  partNumber,
  description,
  type,
  quantity,
  inDate,
  outDate,
  userEmail,
  serialData,
  unserialData
) {
  return {
    id,
    partNumber,
    description,
    type,
    quantity,
    inDate,
    outDate,
    userEmail,
    serialData,
    unserialData,
  };
}
