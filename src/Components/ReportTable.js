import React, { useEffect, useState } from "react";
import "../Stylesheet/Report.scss";
import { CSVLink } from "react-csv";
// import First from "../Assests/Images/FirstPage.png";
// import Last from "../Assests/Images/LastPage.png";
// import Prev from "../Assests/Images/Prev.png";
// import Next from "../Assests/Images/Next.png";
// import CSV from "../Assests/Images/CSV.png";

const ReportTable = ({ headers, data, buttonComponent, csvButtonComponent }) => {
    // State for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // State for search functionality
    const [searchQuery, setSearchQuery] = useState("");

    // Function to handle pagination logic
    const paginateData = () => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return data.slice(indexOfFirstItem, indexOfLastItem);
    };

    // Function to handle search functionality
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const renderTypeBadge = (type) => {
        let badgeClass = "";
        if (type === "Inward") {
            badgeClass = "inward";
        } else if (type === "Outward") {
            badgeClass = "outward";
        } else {
            badgeClass = "badge-default";
        }

        return <span className={`${badgeClass}`}>{type}</span>;
    };

    const renderStatusColor = (status) => {
        let statusClass = "";
        if (status == "Pending for Unloading" || status == "Pending for Loading") {
            statusClass = "pending";
        } else if (status === "Unloading in process" || status === "Loading in process") {
            statusClass = "unloading";
        } else if (status === "Completed") {
            statusClass = "completed";
        }
        else if(status == "Pending for PO Approval"){
            statusClass = "pendingPO"
        }
        else if(status  == "Pending Cancel"){
            statusClass = "pendingCancel"
        }
        else if (status === "Cancelled") {
            statusClass = "cancelled";
        }
        else if (status === "Active") {
            statusClass = "active-badge"
        }
        else if (status === "InActive") {
            statusClass = "inactive-badge";
        }
        else {
            statusClass = "default";
        }

        return <span className={`${statusClass}`}>{status}</span>;
    };

    // Filtered data based on search query
    const filteredData = data.filter((row) =>
        headers.some((header) =>
            String(row[header.dataKey])
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
        )
    );
    console.log("filteredData", data);

    // Calculate pagination details
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const handlePrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleFirstPage = () => {
        setCurrentPage(1);
    };

    const handleLastPage = () => {
        setCurrentPage(totalPages);
    };

    // Ensure currentPage is within valid range when filteredData changes
    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages > 0 ? totalPages : 1);
        }
    }, [filteredData, totalPages]);

    return (
        <div className="table-container">
            {/* Search Input */}
            <div
                className="search-container"
                style={{
                    marginBottom: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <div>{buttonComponent}</div> {/* Render the passed button component */}
                <div style={{ display: "flex", alignItems: "center" }}>
                {csvButtonComponent && <div className="csv-download">{csvButtonComponent}</div>}

                    <input
                        style={{
                            height: "5vh",
                            width: "70%",
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                            padding: "0 10px",
                        }}
                        type="text"
                        value={searchQuery}
                        onChange={handleSearch}
                        placeholder="Search..."
                    />
                </div>
            </div>

            {/* Table Section */}
            <div style={{ position: "relative", minHeight: "200px" }}>
                {filteredData.length === 0 ? (
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <img src="../Images/No_data_found.svg" style={{ width: "30%", height: "auto" }}></img>

                    </div>
                ) : (
                    <>
                        <table
                            className="report-table"
                            style={{
                                boxShadow: "0px 0px 4px 2px rgba(0, 0, 0, 0.1)",
                                padding: "20px",
                                borderRadius: "10px",
                                background: "#fff",
                                overflow: "hidden",
                            }}
                        >
                            {/* Table Headers */}
                            <thead>
                                <tr>
                                    {headers.map((header, index) => (
                                        <th key={index} style={header.style || {}}>
                                            {header.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            {/* Table Body */}
                            <tbody>
                                {paginateData().map((row, rowIndex) => (
                                    <tr key={rowIndex} className="table-row">
                                        {headers.map((header, index) => (
                                            <td
                                                key={index}
                                                className={header.className || ""}
                                                style={header.style || {}}
                                            >
                                                {header.dataKey === "type"
                                                    ? renderTypeBadge(row[header.dataKey])
                                                    : header.dataKey === "status"
                                                        ? renderStatusColor(row[header.dataKey])
                                                        : row[header.dataKey]}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination Controls */}
                        <div
                            className="pagination-container"
                            style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    width: "12%",
                                    height: "4vh",
                                    justifyContent: "space-between",
                                    backgroundColor: "#b9dcf7",
                                    padding: "1px",
                                    borderRadius: "50px",
                                    marginTop: "5px",
                                    boxShadow: "0px 0px 4px 2px rgba(0, 0, 0, 0.1)",
                                    borderRadius: "10px",
                                    overflow: "hidden",
                                }}
                            >
                                <img
                                    src="../../Images/Firstpage.png"
                                    onClick={handleFirstPage}
                                    style={{ cursor: "pointer", height: "4vh", width: "4vh" }}
                                />
                                <img
                                    src="../../Images/Prev.png"
                                    onClick={handlePrevPage}
                                    style={{ cursor: "pointer", height: "4vh", width: "4vh" }}
                                />
                                <span
                                    style={{ color: "#2298f2", fontWeight: "bold" }}
                                >{` ${currentPage} of ${totalPages}`}</span>
                                <img
                                    src="../../Images/Next.png"
                                    onClick={handleNextPage}
                                    style={{ cursor: "pointer", height: "4vh", width: "4vh" }}
                                />
                                <img
                                    src="../../Images/LastPage.png"
                                    onClick={handleLastPage}
                                    style={{ cursor: "pointer", height: "4vh", width: "4vh" }}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );

};

export default ReportTable;
