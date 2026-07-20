import React, { useEffect, useMemo, useState } from 'react'
import '../../../Stylesheet/Details.scss'
import { useTable } from 'react-table'
import Header from '../../../Components/Header'
import CustomDivider from '../../../Components/Divider'
import Footer from '../../../Components/Footer'
import { Link, useNavigate, useLocation } from "react-router-dom";
import { EntryData } from '../../../redux/action/Entry'
import { connect } from 'react-redux'
import toast, { Toaster } from 'react-hot-toast';
import { IconContext } from "react-icons";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";

const apiURL = process.env.REACT_APP_API_URL

function ItemFeild(props) {
  const location = useLocation();
  const itemdata = location.state;
  let headerdata = itemdata.data
  console.log("itemdata", itemdata)
  console.log("headerdata", headerdata)
  const navigate = useNavigate()
  const [da, setda] = useState([])
  const [showFiltered, setShowFiltered] = useState(false);
  const [subjectToVerification, setSubjectToVerification] = useState(false); // New state for checkbox
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      return;
    }
  
    const results = da.filter((item) =>
      item.MATERIAL_NO?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    setSearchResults(results);
  }, [searchTerm, da]);

  useEffect(() => {
    const newData = [];
    itemdata.podata.forEach((items) => {
      items.Details.forEach((item) => {
        newData.push({ ...item, BILLED_QTY: 0 });
      });
    });
    setda(newData);
  }, []);

  const col = [
    {
      Header: "PO Number",
      accessor: "PO_NO"
    },
    {
      Header: "Line Item",
      accessor: "LINE_ITEM"
    },
    {
      Header: "Material Number",
      accessor: "MATERIAL_NO"
    },
    {
      Header: "Material Description",
      accessor: "MATERIAL_DESC"
    },
    {
      Header: "Unit",
      accessor: "UNIT"
    },
    {
      Header: "PO Qty",
      accessor: "PO_QTY"
    },
    {
      Header: "Remaining Qty",
      accessor: row => Number(row.PENDING_QTY).toFixed(3)
    },
    {
      Header: "Billed Qty",
      accessor: "BILLED_QTY"
    },
  ]
  const columns = useMemo(() => col, [])
  const data = showFiltered
    ? (searchResults.length ? searchResults : da).filter(
      (item) => item.PENDING_QTY - item.BILLED_QTY !== 0
    )
    : searchResults.length ? searchResults : da;

  const filteredData = showFiltered
    ? data.filter((item) => item.PENDING_QTY - item.BILLED_QTY !== 0)
    : data;
  
  const tableInstance = useTable({
    columns,
    data: useMemo(() => filteredData, [filteredData]),
  });

  const handleInputChange = (event, row, columnId) => {
    const newValue = event.target.value;

    const updatedDa = da.map(item => {
      if (item.PO_NO === row.original.PO_NO && item.LINE_ITEM === row.original.LINE_ITEM) {
        if (Number(newValue) <= Number(item.PO_QTY)) {
          return { ...item, [columnId]: newValue };
        }
      }
      return item;
    });

    setda(updatedDa);

    const updatedSearchResults = searchResults.map(item => {
      if (item.PO_NO === row.original.PO_NO && item.LINE_ITEM === row.original.LINE_ITEM) {
        if (Number(newValue) <= Number(item.PO_QTY)) {
          return { ...item, [columnId]: newValue };
        }
      }
      return item;
    });

    setSearchResults(updatedSearchResults);
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance

  const handlesubmit = () => {
    let Details = [];

    da.filter(
      (items) =>
        items.DELIVERY_INDICATOR !== "X" && items.PENDING_QTY !== "0"
    ).map((items, index) => {
      Details.push({
        PO_NO: items.PO_NO,
        LINE_ITEM: items.LINE_ITEM,
        MATERIAL_NO: items.MATERIAL_NO,
        MATERIAL_DESC: items.MATERIAL_DESC,
        PENDING_QTY: items.PENDING_QTY,
        UOM: items.UNIT,
        BILLED_QTY: items.BILLED_QTY,
        SUBJECT_TO_VERIFICATION: subjectToVerification ? 1 : 0, // Add checkbox status
      });
    });

    const hasBilledQuantity = Details.some((item) => Number(item.BILLED_QTY) > 0);

    if (!hasBilledQuantity) {
      toast.error("Please enter Billed Quantity for at least one line item.");
      return;
    }

    let send = JSON.stringify(Details);
    headerdata.PLANT = itemdata.podata[0].PLANT;
    headerdata.VENDOR_ID = itemdata.podata[0].VENDOR_ID;

    setIsLoading(true);

    setTimeout(() => {
      props
        .EntryData(itemdata.selectedFile, headerdata, send, 1, props.EmpId)
        .then((res) => {
          setIsLoading(false);
          if (res.status === 200) {
            navigate("/Home");
            toast.success(
              `${res.data.GATE_ENTRY_NO} Entry Created successfully.`
            );
          }
        })
        .catch((err) => {
          setIsLoading(false);
          toast.error("Unable to create Gate Entry, Please try again!");
          console.error("Error:", err);
        });
    }, 1000);
  };

  const [plantList, setPlantList] = useState([]);
  const [plantOptions, setPlantOptions] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  console.log("selected Plants",selectedPlant)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiURL}/Employee/allocated_plant?id=${props.EmpId}`);
        const newData = await response.json();

        setPlantList(newData);

        const options = newData.map((plant) => ({
          label: plant.PLANT_NAME,
          value: plant.PLANT_ID,
        }));
        setPlantOptions(options);

        const matchedPlant = newData.find((plant) => plant.PLANT_ID === itemdata.podata[0].PLANT);
        if (matchedPlant) {
          setSelectedPlant(matchedPlant);
        }
      } catch (error) {
        console.error("Error fetching plant data:", error);
      }
    };

    fetchData();
  }, [props.EmpId, itemdata.podata[0].PLANT]);

  const [detail, setDetail] = useState(false)

  return (
    <>
      <Header></Header>

      <div className='headinggg'>
        <div className='headingStyle'>
         <Link to="/Home" style={{ color: 'black' }}><p>Inward Gate Entry - </p></Link>
          <p className='po'>With PO</p>
        </div>
      </div>

      <div className='InputBox'>
        <div className='detailStyleee' >
          <p>Incoming Reference Number  : </p>
          <p className='detailStyle1'>{itemdata.data.INVOICE}</p>
        </div>

        <div className='dividerStyle1'>
          <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
        </div>

        <div className='detailStyle' >
          <p>Invoice Date : </p>
          <p className='detailStyle1'>{new Date(itemdata.data.DOCDATE).toDateString()}</p>
        </div>

        <div className='dividerStyle1'>
          <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
        </div>

        <div className='moreDetail' >
          <p>More Details</p>
          <div className='arrowStyle' onClick={() => setDetail(!detail)}>
            <IconContext.Provider value={{ color: "#FF0000", size: "23px" }}>
              {detail === false ? <AiFillCaretDown type="button" /> : <AiFillCaretUp type="button" />}
            </IconContext.Provider>
          </div>
        </div>

        {detail && <div>
          <div className='detailStyle' >
            <p>Vendor Details : </p>
            <p className='detailStyle1'>{itemdata.podata[0].VENDOR_NAME + " (" + itemdata.podata[0].VENDOR_ID + ")"}</p>
          </div>

          <div className='dividerStyle1'>
            <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
          </div>

          <div className='detailStyle' >
            <p>Transporter Vendor Name : </p>
            <p className='detailStyle1'>{itemdata.data.VENDORNAME}</p>
          </div>

          <div className='dividerStyle1'>
            <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
          </div>

          <div className='detailStyle' >
            <p>Plant : </p>
            <p className='detailStyle1'>{(selectedPlant?.PLANT_ID)}-{selectedPlant?.PLANT_NAME}</p>
          </div>

          <div className='dividerStyle1'>
            <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
          </div>

          <div className='detailStyle' >
            <p>Driver Name : </p>
            <p className='detailStyle1'>{itemdata.data.DRIVERNAME}</p>
          </div>

          <div className='dividerStyle1'>
            <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
          </div>

          <div className='detailStyle' >
            <p>Mobile no. : </p>
            <p className='detailStyle1'>{itemdata.data.MOBILE}</p>
          </div>

          <div className='dividerStyle1'>
            <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
          </div>

          <div className='detailStyle' >
            <p>Mode of Transport : </p>
            <p className='detailStyle1'>{itemdata.data.MOT}</p>
          </div>

          <div className='dividerStyle1'>
            <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
          </div>

          <div className='detailStyle' >
            <p>Road Permit Number : </p>
            <p className='detailStyle1'>{itemdata.data.ROADPERMIT}</p>
          </div>

          <div className='dividerStyle1'>
            <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
          </div>

          <div className='detailStyle' >
            <p>LR Number & Date : </p>
            <p className='detailStyle1'>{itemdata.data.LR + " , " + new Date(itemdata.data.LRDATE).toDateString()}</p>
          </div>

          <div className='dividerStyle1'>
            <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
          </div>

          <div className='detailStyle' >
            <p>Packages : </p>
            <p className='detailStyle1'>{itemdata.data.PACKAGES}</p>
          </div>

          <div className='dividerStyle1'>
            <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
          </div>

          <div className='detailStyle' >
            <p>Vehicle Reporting Date & Time : </p>
            <p className='detailStyle1'>{new Date(itemdata.data.VEHICLEREPDATE).toDateString() + " , " + itemdata.data.VEHICLEREPDATE.split("T")[1]}</p>
          </div>

          <div className='dividerStyle1'>
            <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
          </div>

          <div className="detailStyle">
            <p>Attachments:</p>
            <div className="attachmentList">
              {itemdata.data.ATTACHMENT?.length > 0 ? (
                itemdata.data.ATTACHMENT.map((file, index) => (
                  <p
                    key={index}
                    className="detailStyle1"
                    style={{
                      cursor: "pointer",
                      borderRadius: "20px",
                      border: "1px solid blue",
                      color: "blue",
                      width: "4em",
                      overflow: "hidden",
                      fontSize: "12px",
                      padding: "4px 10px",
                      margin: "5px",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      display: "inline-block",
                    }}
                    onClick={() => {
                      const fileURL = URL.createObjectURL(file);
                      window.open(fileURL, "_blank");
                    }}
                  >
                    {file.name}
                  </p>
                ))
              ) : (
                <p>No attachments available</p>
              )}
            </div>
          </div>

          <div className='dividerStyle1'>
            <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
          </div>
        </div>}
      </div>

      <div style={{ marginLeft: "10%", marginTop: "1%", display: "flex", alignItems: "center" }}>
        <input
          type="checkbox"
          id="filterCheckbox"
          checked={showFiltered}
          onChange={() => setShowFiltered(!showFiltered)}
        />
        <label htmlFor="filterCheckbox" style={{  marginLeft: "10px" }}>
          Remaining Billed Quantity Left
        </label>
        <input
          type="checkbox"
          id="subjectToVerificationCheckbox"
          checked={subjectToVerification}
          onChange={() => setSubjectToVerification(!subjectToVerification)}
          style={{ marginLeft: "20px" }}
        />
        <label htmlFor="subjectToVerificationCheckbox" style={{ marginLeft: "10px" }}>
          Subject to Verification
        </label>
        <div style={{ marginLeft: "auto", marginRight: "10%" }}>
          <input
            type="text"
            placeholder="Search Material Number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "5px 10px",
              borderRadius: "4px",
              border: "1px solid gray"
            }}
          />
        </div>
      </div>

      <div className='tableStyle' style={{ marginTop: "1%" }}>
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()}>
            {rows
              .filter((row) =>
                showFiltered
                  ? data[row.id]?.["PENDING_QTY"] - (data[row.id]?.["BILLED_QTY"] || 0) !== 0
                  : true
              )
              .map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      if (cell.column.Header === "Billed Qty") {
                        return (
                          <td>
                            <input
                              type="number"
                              max={data[row.id]?.["PENDING_QTY"]}
                              min={0}
                              style={{
                                fontSize: "10px",
                                marginLeft: "20px",
                                width: "120px",
                                height: "18px",
                                borderRadius: "5px",
                              }}
                              value={data[row.id]?.["BILLED_QTY"] || ""}
                              onChange={(event) => {
                                const maxValue = data[row.id]?.["PENDING_QTY"];
                                const newValue = Math.min(Number(event.target.value), maxValue);

                                handleInputChange(
                                  { ...event, target: { ...event.target, value: newValue } },
                                  row,
                                  "BILLED_QTY"
                                );

                                if (showFiltered && data[row.id]?.["PENDING_QTY"] - newValue === 0) {
                                  setda((prevData) =>
                                    prevData.filter((_, index) => index !== row.id)
                                  );
                                }
                              }}
                            />
                          </td>
                        );
                      }
                      return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                    })}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      <div className='buttonAlign' style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "20px",
      }}>
        <button className="feildBtn" onClick={() => handlesubmit()} disabled={isLoading}
          style={{
            backgroundColor: isLoading ? "#ccc" : "#007BFF",
            color: isLoading ? "#666" : "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: isLoading ? "not-allowed" : "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "16px",
            fontWeight: "bold",
          }}>
          {isLoading ? (
            <span
              style={{
                border: "2px solid #f3f3f3",
                borderTop: "2px solid #3498db",
                borderRadius: "50%",
                width: "16px",
                height: "16px",
                animation: "spin 1s linear infinite",
                display: "inline-block",
              }}
            ></span>
          ) : (
            "Submit"
          )}
        </button>
      </div>

      <div className='footerSpacing'>
        <Footer />
      </div>
    </>
  )
}

const mapStateToProps = (state) => {
  return {
    EmpId: state.loginreducer.details
  }
}

export default connect(mapStateToProps, { EntryData })(ItemFeild)