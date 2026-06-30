import React, { useMemo, useEffect, useState } from "react";
import "../../../Stylesheet/Details.scss";
import { useTable } from "react-table";
import Header from "../../../Components/Header";
import CustomDivider from "../../../Components/Divider";
import Footer from "../../../Components/Footer";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { OutNRGP } from "../../../redux/action/Entry";
import { IconContext } from "react-icons";
import {
  AiFillCaretDown,
  AiFillCaretRight,
  AiFillCaretUp,
} from "react-icons/ai";

function FeildsWithoutPO(props) {
  const location = useLocation();
  const comingdata = location.state;
  let { previousdata, everyitemdata } = comingdata;
  const [da, setda] = useState([]);
  const navigate = useNavigate();
  console.log("previousdata.data", previousdata.data)
  useEffect(() => {
    // On component mount, set the table data with BILLED_QTY property set to 0
    const newData = [];
    everyitemdata.forEach((items) => {
      newData.push(items);
      // items.Details.forEach((item) => {
      //   newData.push({ ...item, BILLED_QTY: 0 });
      // });
    });
    setda(newData);
  }, []);

  const col = [
    {
      Header: "Material Number",
      accessor: "MATERIAL",
    },

    {
      Header: "Material Description",
      accessor: "MATERIAL_DESC",
    },

    {
      Header: "Vendor Id",
      accessor: "VENDOR_ID",
    },

    {
      Header: "Vendor Name",
      accessor: "VENDOR_NAME",
    },

    {
      Header: "PO Quantity",
      accessor: "QUANTITY",
    },

    {
      Header: "Billed Qty",
      accessor: "BILED_QTY",
    },
  ];
  const columns = useMemo(() => col, []);
  const data = da;

  const tableInstance = useTable({
    columns,
    data,
  });
  const handleInputChange = (event, row, columnId) => {
    let newarr = [...da];
    // console.log(newarr[row.id].ORDER_QUANTITY<event.target.value)
    if (newarr[row.id].PO_QTY >= event.target.value) {
      newarr[row.id][columnId] = event.target.value;
    }
    // else{

    // }
    setda(newarr);
  };
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  const notify = () => toast("Entry created successfully.");

  const handlesubmit = () => {
    // console.log("hi there")
    // toast('Entry created successfully.');
    let Details = [];
    // navigate('/Inward')
    // console.log("Data in FormData",da)
    da.map((items, index) => {
      Details.push({
        MATERIAL_NO: items.MATERIAL,
        MATERIAL_DESC: items.MATERIAL_DESC,
        VENDOR_ID: items.VENDOR_ID,
        VENDOR_NAME: items.VENDOR_NAME,
        PO_QTY: items.QUANTITY,
        BILLED_QTY: items.BILED_QTY,
      });
    });
    // console.log(Details)
    let send = JSON.stringify(Details);
    // console.log(send)

    previousdata.data.PLANT = everyitemdata[0].PLANT;
    previousdata.data.VENDOR_ID = everyitemdata[0].VENDOR_ID;

    props
      .OutNRGP(
        previousdata.selectedFile,
        previousdata.data,
        send,
        5,
        props.EmpId
      )
      .then((res) => {
        if (res.status == 200) {
          navigate("/Home");
          toast.success(
            `${res.data.GATE_ENTRY_NO} Entry Created successfully.`
          );
          // console.log("Entry Created successful")

          // console.log(res)
          // notify()
          // props.GetEntry()
          // props.navigation.navigate("Dashboard"),
          // setTimeout(() => {

          //       Snackbar.show({
          //             text: 'Gate Entry created Successfully',
          //             duration: Snackbar.LENGTH_SHORT,
          //       })
          // }, 1000)
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Unable to create Gate Entry, Please Try again!");
        // console.log("Unable to create Gate Entry, Please Try again!")

        // Snackbar.show({
        //       text: 'Unable to create Gate Entry, Please Try again!',
        //       // duration: Snackbar.LENGTH_SHORT,
        // })
      });
  };

  // console.log('====================================');
  // console.log(everyitemdata);
  // console.log('====================================');

  const [detail, setDetail] = useState(false);

  return (
    <>
      <Header></Header>

      <div className="headinggg">
        <div className="headingStyle">
         <Link to="/Home" style={{ color: "black" }}>
            <p>Outward Gate Entry - </p>
          </Link>
          <p className="po">RGP/NRGP</p>
        </div>
      </div>

      <div className="InputBox">
        <div className="detailStyleee">
          <p>Invoice Number : </p>
          <p className="detailStyle1">{previousdata.data?.INVOICE}</p>
        </div>

        <div className="dividerStyle1">
          <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
        </div>

        <div className="detailStyle">
          <p>Document Date : </p>
          <p className="detailStyle1">
            {new Date(previousdata.data?.DOCDATE).toDateString()}
          </p>
        </div>

        <div className="dividerStyle1">
          <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
        </div>

        <div className="moreDetail">
          <p>More Details</p>

          <div className="arrowStyle" onClick={() => setDetail(!detail)}>
            <IconContext.Provider value={{ color: "#FF0000", size: "23px" }}>
              {detail === false ? (
                <AiFillCaretDown type="button" />
              ) : (
                <AiFillCaretUp type="button" />
              )}
            </IconContext.Provider>
          </div>
          {/* <p className='detailStyle1'>4002749</p> */}
        </div>

        {detail && (
          <div>
            <div className="detailStyle">
              <p>Vendor Details : </p>
              <p className="detailStyle1">
                {`${everyitemdata[0].VENDOR_NAME}` +
                  ` (${everyitemdata[0].VENDOR_ID})`}
              </p>
            </div>

            <div className="dividerStyle1">
              <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
            </div>

            <div className="detailStyle">
              <p>Transporter Vendor Name : </p>
              <p className="detailStyle1">{da[0].VENDOR_NAME}</p>
            </div>

            <div className="dividerStyle1">
              <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
            </div>

            <div className="detailStyle">
              <p>Plant : </p>
              <p className="detailStyle1">{`${everyitemdata[0].PLANT}`}</p>
            </div>

            <div className="dividerStyle1">
              <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
            </div>

            <div className="detailStyle">
              <p>Driver Name : </p>
              <p className="detailStyle1">{`${previousdata.data.DRIVERNAME} (${previousdata.data.MOBILE})`}</p>
            </div>

            <div className="dividerStyle1">
              <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
            </div>

            <div className="detailStyle">
              <p>Mode of Transport : </p>
              <p className="detailStyle1">{previousdata.data.MOT}</p>
            </div>

            <div className="dividerStyle1">
              <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
            </div>

            <div className="detailStyle">
              <p>Road Permit Number : </p>
              <p className="detailStyle1">{previousdata.data.ROADPERMIT}</p>
            </div>

            <div className="dividerStyle1">
              <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
            </div>

            <div className="detailStyle">
              <p>LR Number & Date : </p>
              <p className="detailStyle1">{`${
                previousdata.data.LR
              } , ${new Date(previousdata.data.LRDATE).toDateString()}`}</p>
            </div>

            <div className="dividerStyle1">
              <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
            </div>

            <div className="detailStyle">
              <p>Packages : </p>
              <p className="detailStyle1">{previousdata.data.PACKAGES}</p>
            </div>

            <div className="dividerStyle1">
              <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
            </div>

            <div className="detailStyle">
              <p>Vehicle Reporting Date & Time : </p>
              <p className="detailStyle1">
                {new Date(previousdata.data.VEHICLEREPDATE).toDateString() +
                  " , " +
                  previousdata.data.VEHICLEREPDATE.split("T")[0]}
              </p>
            </div>

            <div className="dividerStyle1">
              <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
            </div>
          </div>
        )}
      </div>

      <div className="tableStyle">
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>
                        {cell.value ? cell.render("Cell") : "--"}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="buttonAlign">
        <button className="feildBtn" onClick={() => handlesubmit()}>
          Submit
        </button>
      </div>

      <div className="footerSpacing">
        <Footer></Footer>
      </div>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    EmpId: state.loginreducer.details,
  };
};

export default connect(mapStateToProps, { OutNRGP })(
  FeildsWithoutPO
);
