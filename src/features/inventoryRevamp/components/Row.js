import React, { useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

function Row(props) {
  const { row } = props;
  const [open, setOpen] = useState(true);
  const [shipOutMode, setShipOutMode] = useState(false);
  const [selectedSerialNumbers, setSelectedSerialNumbers] = useState([]);

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

  const cellBorderStyle = { borderRight: "1px solid rgba(224, 224, 224, 1)" };

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell sx={cellBorderStyle}>
          {row.type === "serialized" ? (
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
          {row.inDate}
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
          {row.type === "serialized" ? "-" : row.serialData.manufacturer || "-"}
        </TableCell>
        <TableCell align="right" sx={cellBorderStyle}>
          {row.userEmail}
        </TableCell>
      </TableRow>
      {row.type === "serialized" && (
        <>
          <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
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
                          In Date
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
                            {serialRow.inDate}
                          </TableCell>
                          <TableCell align="right" sx={cellBorderStyle}>
                            {serialRow.outDate}
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
                        onClick={() =>
                          console.log("Ship Out", selectedSerialNumbers)
                        }
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
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
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
  }).isRequired,
};

export default Row;
