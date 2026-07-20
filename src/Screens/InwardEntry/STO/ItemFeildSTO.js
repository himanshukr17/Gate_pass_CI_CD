import React, { useEffect, useMemo, useState, } from 'react'
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
import { AiFillCaretDown, AiFillCaretRight, AiFillCaretUp } from "react-icons/ai";


const apiURL = process.env.REACT_APP_API_URL

function ItemFeildSTO(props) {

  const location = useLocation();
  const itemdata = location.state;
  console.log("item screen", itemdata)
  let headerdata = itemdata.data
  const navigate = useNavigate()
  // console.log("EMP_ID",props.EmpId)
  const [da, setda] = useState([])
  // useEffect(() => {

  //   console.log("insiede")
  //   let data = []
  //   itemdata.podata.map(items => {
  //     items.Details.map(item => {
  //       data.push({ ...item, ...{ BILLED_QTY: 0 } })
  //     })
  //   })
  //   setda(data)
  // }, [])


  useEffect(() => {
    // On component mount, set the table data with BILLED_QTY property set to 0
    const newData = [];
    itemdata.podata.GateEntrydata.forEach((items) => {
      items.Details.forEach((item) => {
        newData.push({ ...item, BILLED_QTY: 0 });
      });
    });
    console.log("newddddddddddd",newData);
    setda(newData);
  }, []);

  console.log("daaaa",da)
  const col = [
    {
      Header: "PO Number",
      accessor: "PO_NO"
    },
    {
      Header: "Line Item",
      accessor: "LINE_ITEM"
    },
    // {
    //   Header: "Invoice Number",
    //   accessor: "INVOICE_NO"
    // },

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
  // const [data,setdata]=useState(da)
  const data = da  //useMemo(() => da, [])
  // console.log("++++", data)
  const tableInstance = useTable({
    columns,
    data
  })
  
  const handleInputChange = (event, row, columnId) => {
    let newarr = [...da]
    // console.log(newarr[row.id].ORDER_QUANTITY<event.target.value)
    if (newarr[row.id].PO_QTY >= event.target.value) {
      newarr[row.id][columnId] = event.target.value
    }
    // else{

    // }
    setda(newarr)
  };
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance


  const notify = () => toast('Entry created successfully.');


  // console.log("ddddddddddddaaaaaaaaaaaaaaaaa",da)
  const [isLoading, setIsLoading] = useState(false);

 
  const handlesubmit = () => {
    let Details = [];

    // Filter and prepare details
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
      });
    });
    
    
    // console.log("Details to be sent:", Details);
    
    let send = JSON.stringify(Details);
    headerdata.PLANT = itemdata.podata.GateEntrydata[0].PLANT;
    headerdata.VENDOR_ID = itemdata.podata.GateEntrydata[0].VENDOR_ID;
    
    // console.log("Form data and data",itemdata.selectedFile)
    // console.log("headerdata",headerdata)
    // console.log("send",send)
    // console.log("props.EmpId",props.EmpId)
  // console.log("data that is submittteedddddddd", headerdata)


    // Show loading animation
    setIsLoading(true);


    // Add 2-second delay before API call
    setTimeout(() => {
      props
        .EntryData(itemdata.selectedFile, headerdata, send, 3, props.EmpId)
        .then((res) => {
          setIsLoading(false); // Hide loading animation
          if (res.status === 200) {
            navigate("/Home");
            toast.success(
              `${res.data.GATE_ENTRY_NO} Entry Created successfully.`
            );
            // console.log("Entry Created successfully");
          }
        })
        .catch((err) => {
          setIsLoading(false); // Hide loading animation
          toast.error("Unable to create Gate Entry, Please try again!");
          console.error("Error:", err);
        });
    }, 1000);
  };


  const [plantList, setPlantList] = useState([]); // Raw API data
const [plantOptions, setPlantOptions] = useState([]); // Transformed data for dropdown
const [selectedPlant, setSelectedPlant] = useState(null);
console.log("selectedPlants",selectedPlant) // To store matched plant data

useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await fetch(`${apiURL}/Employee/allocated_plant?id=${props.EmpId}`);
            const newData = await response.json();

            // Update plantList with raw data
            setPlantList(newData);

            // Transform data into { label, value } format for dropdown
            const options = newData.map((plant) => ({
                label: plant.PLANT_NAME,
                value: plant.PLANT_ID,
            }));
            setPlantOptions(options);

            // Match the plant ID and update selectedPlant state
            const matchedPlant = newData.find((plant) => plant.PLANT_ID === itemdata.podata.GateEntrydata[0].PLANT);
            console.log("matchedPlant",matchedPlant)
            if (matchedPlant) {
                setSelectedPlant(matchedPlant);
            }
        } catch (error) {
            console.error("Error fetching plant data:", error);
        }
    };

    fetchData();
}, [props.EmpId, itemdata.podata.GateEntrydata[0].PLANT]); // Fetch when EmpId or plant ID changes

// To display the matched plant data
// console.log("Selected Plant:", selectedPlant);

  // console.log(itemdata.podata.PLANT);
  // console.log('====================================');

  const [detail, setDetail] = useState(false)


  return (
    <>
      <Header></Header>

      <div className='headinggg'>
        <div className='headingStyle'>
         <Link to="/Home" style={{ color: 'black' }}><p>Inward Gate Entry - </p></Link>
          <p className='po'>Against STO Invoice</p>
        </div>
      </div>

      <div className='InputBox'>

        {/* <div className='entryHead'>
          <p >Gate Entry Number - </p>
          <p className='po'>I526</p>
        </div> */}

        {/* <div className='dividerStyle'>
          <CustomDivider color="#1897CE" thickness="0.8vh" />
        </div> */}

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
              {detail === false ? <AiFillCaretDown
                type="button"
              /> :
                <AiFillCaretUp
                  type="button"
                />
              }
            </IconContext.Provider>
          </div>
          {/* <p className='detailStyle1'>4002749</p> */}
        </div>

        {detail && <div>
          <div className='detailStyle' >
            <p>Vendor Details : </p>
            <p className='detailStyle1'>{itemdata.podata.GateEntrydata[0].VENDOR_NAME + " (" + itemdata.podata.GateEntrydata[0].VENDOR_ID + ")"}</p>
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
            <p className='detailStyle1'>{(itemdata.podata.GateEntrydata[0].PLANT)}-{itemdata.podata.GateEntrydata[0].PLANT_DESC}</p>
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
            width: "4em", // Adjust width based on your need
            overflow: "hidden",
            fontSize: "12px", // Adjust font size if needed
            padding: "4px 10px",
            margin:"5px",
            textOverflow: "ellipsis", // This will add an ellipsis (...) for long text
            whiteSpace: "nowrap", // Prevent the text from wrapping to the next line
            display: "inline-block", // Ensures it stays inline with other items
          }}
          onClick={() => {
            // Create a preview URL and open in a new tab
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

      <div className='tableStyle'>
        <table {...getTableProps()}>
          <thead>
            {
              headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {
                    headerGroup.headers.map((column) => (
                      <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                    ))
                  }
                </tr>
              ))
            }
          </thead>

          <tbody {...getTableBodyProps()}>
            {
              rows
              .filter((row) => 
                data[row.id]?.["DELIVERY_INDICATOR"] !== "X" && Number(data[row.id]?.["PENDING_QTY"]) > 0 )// Exclude rows with DELIVERY_INDICATOR = 'X'
                .map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {
                        row.cells.map((cell) => {
                          return (cell.column.Header === "Billed Qty" ? (
                            <input
                              type="text"
                              max={data[row.id]?.["PENDING_QTY"]}
                              min={0}
                              style={{ fontSize: "10px", marginLeft: "20px", width: "120px", height: "18px", borderRadius: "5px" }}
                              value={data[row.id]?.["BILLED_QTY"] || ""}
                              onChange={(event) => {
                                const maxValue = data[row.id]?.["PENDING_QTY"];
                                const newValue = Math.min(Number(event.target.value), maxValue); // Ensure value doesn't exceed max
                                handleInputChange({ ...event, target: { ...event.target, value: newValue } }, row, "BILLED_QTY");
                              }}
                            />
                          ) : cell.column.Header === "Invoice Number" ? 
                          <input
                          type="text"
                          // max={data[row.id]?.["PENDING_QTY"]}
                          min={0}
                          style={{ fontSize: "10px", marginLeft: "20px", width: "120px", height: "18px", borderRadius: "5px" }}
                          // value={data[row.id]?.["BILLED_QTY"] || ""}
                          // onChange={(event) => {
                          //   const maxValue = data[row.id]?.["PENDING_QTY"];
                          //   const newValue = Math.min(Number(event.target.value), maxValue); // Ensure value doesn't exceed max
                          //   handleInputChange({ ...event, target: { ...event.target, value: newValue } }, row, "BILLED_QTY");
                          // }}
                          onInput={(e) => {
                            // Allow only digits (0-9)
                            e.target.value = e.target.value.replace(/[^0-9]/g, '');
                          }}
                        />:(
                            <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                          ));
                        })
                      }
                    </tr>
                  );
                })
            }
          </tbody>
        </table>
      </div>


      <div className='buttonAlign'  style={{
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
        {/* <Toaster/> */}
      </div>

      <div className='footerSpacing'>
        <Footer>

        </Footer>
      </div>

    </>
  )
}

const mapStateToProps = (state) => {
  return {
    EmpId: state.loginreducer.details
  }
}

export default connect(mapStateToProps, { EntryData })(ItemFeildSTO)