import React, { useEffect, useMemo, useState, } from 'react'
import '../../../Stylesheet/Details.scss'
import { useTable } from 'react-table'
import Header from '../../../Components/Header'
import CustomDivider from '../../../Components/Divider'
import Footer from '../../../Components/Footer'
import { Link, useNavigate, useLocation } from "react-router-dom";
import { connect } from 'react-redux'
import { EntryData } from '../../../redux/action/Entry'
import toast, { Toaster } from 'react-hot-toast';



function FieldReturnPO(props) {

  const location = useLocation();
  const itemdata = location.state;
  // console.log("item screen", itemdata)
  let headerdata = itemdata.data
  const navigate = useNavigate()
  const [da, setda] = useState([])

  useEffect(() => {
    // On component mount, set the table data with BILLED_QTY property set to 0
    const newData = [];
    itemdata.podata.forEach((items) => {
      items.Details.forEach((item) => {
        newData.push({ ...item, BILLED_QTY: 0 });
      });
    });
    setda(newData);
  }, []);

  // console.log(da)
  const col = [
    {
      Header: "Line Item",
      accessor: "ITEM_CATEGORY"
    },

    {
      Header: "PO Numnber",
      accessor: "PO_NO"
    },

    {
      Header: "Material Number",
      accessor: "MATERIAL"
    },

    {
      Header: "Material Description",
      accessor: "MATERIAL_DESCRIPTION"
    },

    {
      Header: "Unit",
      accessor: "UNIT"
    },

    {
      Header: "Pending Qty",
      accessor: "ORDER_QUANTITY"
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
    if (newarr[row.id].ORDER_QUANTITY > event.target.value) {
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



  const handlesubmit = () => {
    let Details = []
    // navigate('/Inward')
    // console.log(da)
    da.map((items, index) => {
      Details.push({
        PO_NO: items.PO_NO,
        LINE_ITEM: items.ITEM_CATEGORY,
        MATERAIL_NO: items.MATERIAL,
        MATERAIL_DESC: items.MATERIAL_DESCRIPTION,
        // PO_QTY: Number,
        PENDING_QTY: items.ORDER_QUANTITY,
        // BILLED_QTY: Number,
        UOM: items.UNIT,
        BILLED_QTY: items.BILLED_QTY,
        // ORDER_NO: String,
        // SOLD_TO: String,
      })
    })
    // console.log(Details)
    let send = JSON.stringify(Details)
    // console.log(send)
    headerdata.PLANT = da[0].PLANT_ID
    headerdata.VENDOR_ID = itemdata.podata[0].Vendor_ID
    // data.append({"PLANT":props.multiPOdata[0].PLANT})
    // data.append({"VENDOR_ID":props.multiPOdata[0].Vendor_ID})

    props.EntryData(null, headerdata, send, 5, props.EmpId).then(res => {
      if (res == "success") {

        navigate('/Outward')
        toast.success('Entry Created successfully.')
        console.log("Entry Created successful")

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
    }
    )
      .catch((err) => {
        console.log(err)
        toast.error('Unable to create Gate Entry, Please try again!')
        console.log("Unable to create Gate Entry, Please try again!")
        // Snackbar.show({
        //       text: 'Unable to create Gate Entry, Please Try again!',
        //       // duration: Snackbar.LENGTH_SHORT,
        // })
      })

  }

  // console.log(props.EmpId)

  return (
    <>
      <Header></Header>

      <div className='headinggg'>
        <div className='headingStyle'>
          <Link to="/Outward" style={{ color: 'black' }}><p>Outward Gate Entry - </p></Link>
          <p className='po'>With Return PO/Return Challan</p>
        </div>
      </div>

      <div className='InputBox'>

        {/* <div className='entryHead'>
          <p >Gate Entry Number - </p>
          <p className='po'>{itemdata.data.GATE_ENTRY_NO}</p>
        </div>

        <div className='dividerStyle'>
          <CustomDivider color="#1897CE" thickness="0.8vh" />
        </div> */}

        <div className='detailStyle' >
          <p>Invoice Number : </p>
          <p className='detailStyle1'>{itemdata.data.INVOICE}</p>
        </div>

        <div className='dividerStyle1'>
          <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
        </div>

        <div className='detailStyle' >
          <p>Document Date : </p>
          <p className='detailStyle1'>{new Date(itemdata.data.DOCDATE).toDateString()}</p>
        </div>

        <div className='dividerStyle1'>
          <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
        </div>

        <div className='detailStyle' >
          <p>Vendor Details : </p>
          <p className='detailStyle1'>TUV India Pvt Ltd (582246)</p>
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
          <p className='detailStyle1'>{itemdata.podata[0].PLANT}</p>
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

        {/* <div className='detailStyle' >
          <p>Vehicle Inward Date & Time : </p>
          <p className='detailStyle1'>{new Date(itemdata.data.INDATE).toDateString() + " , " + itemdata.data.INDATE.split("T")[1]}</p>
        </div>

        <div className='dividerStyle1'>
          <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
        </div> */}

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
              rows.map((row) => {
                prepareRow(row)
                return (
                  <tr {...row.getRowProps()}>
                    {
                      row.cells.map((cell) => {
                        // console.log(row.id)
                        return (cell.column.Header == "Billed Qty" ? <input
                          type="number"
                          max={data[row.id]?.["ORDER_QUANTITY"]}
                          // name={`input-${row.id}-${"Billed Qty"}`}
                          // value={data[row.id]?.["BILLED_QTY"] || ""}
                          onChange={(event) => handleInputChange(event, row, "BILLED_QTY")}
                        /> : <td {...cell.getCellProps()}>{cell.render('Cell')}</td>)
                      })
                    }
                  </tr>
                )
              })
            }
          </tbody>

        </table>
      </div>

      <div className='buttonAlign'>
        <button className="feildBtn" onClick={() => handlesubmit()}>
          Submit
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

export default connect(mapStateToProps, { EntryData })(FieldReturnPO)