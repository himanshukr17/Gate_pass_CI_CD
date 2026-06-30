import React, { useMemo, useEffect, useState } from 'react'
import '../../../Stylesheet/Details.scss'
import { useTable } from 'react-table'
import Header from '../../../Components/Header'
import CustomDivider from '../../../Components/Divider'
import Footer from '../../../Components/Footer'
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ChangeData } from '../../../redux/action/Change'
import { connect } from 'react-redux'
import toast, { Toaster } from 'react-hot-toast';
import { AiFillDelete, AiOutlineCloseCircle } from "react-icons/ai";
import { IconContext } from "react-icons";
import { Button, Dialog, DialogContent, DialogActions, TextField } from '@mui/material';
import axios from 'axios'
import { AiFillCaretDown, AiFillCaretRight, AiFillCaretUp } from "react-icons/ai";

const apiURL = process.env.REACT_APP_API_URL


function ItemFeildsChange(props) {

  const location = useLocation()
  const outTimedata = location.state
  const navigate = useNavigate()
  // console.log(outTimedata)
  const [da, setda] = useState([])

  useEffect(() => {
    // On component mount, set the table data with BILLED_QTY property set to 0
    const newData = [];
    outTimedata.previousdata[0].Entry_Details.forEach((items) => {
      newData.push(items)
      // items.Details.forEach((item) => {
      //   newData.push({ ...item, BILLED_QTY: 0 });
      // });
    });
    setda(newData);
  }, []);

  // console.log("newData",da)

  const col = (outTimedata.previousdata[0].TYPE == 1 ? [
    {
      Header: "Line Item",
      accessor: "LINE_ITEM"
    },

    {
      Header: "PO Number",
      accessor: "PO_NO"
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
      Header: "Unit of Measurement",
      accessor: "UOM"
    },

    {
      Header: "Pending Quantity",
      accessor: "PENDING_QTY"
    },

    {
      Header: "Billed Quantity",
      accessor: "BILLED_QTY"
    },

  ] : outTimedata.previousdata[0].TYPE == 3 ? [


    {
      Header: "Bill Number",
      accessor: "PO_NO"
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
      Header: "Unit of Measurement",
      accessor: "UOM"
    },

    {
      Header: "Pending Quantity",
      accessor: "PENDING_QTY"
    },

    {
      Header: "Billed Quantity",
      accessor: "BILLED_QTY"
    },

  ] :

    outTimedata.previousdata[0].TYPE == 2 && [
      // {
      //   Header: "Line Item",
      //   accessor: "LINE_ITEM"
      // },

      // {
      //   Header: "PO Number",
      //   accessor: "PO_NO"
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
        Header: "Vendor Id",
        accessor: "VENDOR_ID"
      },

      {
        Header: "Vendor Name",
        accessor: "VENDOR_NAME"
      },

      {
        Header: "Quantity",
        accessor: "PO_QTY"
      },

      {
        Header: "Billed Quantity",
        accessor: "BILLED_QTY"
      },

    ]

  )

  const columns = useMemo(() => col, [])
  const data = da

  const tableInstance = useTable({
    columns,
    data
  })

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance


  const handleSubmit = () => {
    props.ChangeData(null, outTimedata.data, outTimedata.previousdata[0].GATE_ENTRY_NO).then(res => {
      if (res == "success") {
        navigate('/Inward')
        toast.success('Entry Updated successfully.')
        // console.log("Entry Created successful")
      }
    }
    )
      .catch((err) => {
        console.log(err)
        toast.error('Unable to update Gate Entry, Please try again!')
        // console.log("Unable to create Gate Entry, Please try again!")
      })
  }
  let diff = 0
  let time = new Date().getTime() - new Date(outTimedata.previousdata[0].INWARD_DATETIME).getTime()
  diff = time / (1000 * 3600 * 24)
  const [mendata, setmendata] = useState({
    "REMARKS": "",
  })
  const [error, seterror] = useState({
  })
  const setValue = (val) => {
    setmendata({ ...mendata, ...val })
  }

  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  let n = [1, 2, 3, 4, 5, 6, 7, 8]

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = (e) => {
    setIsOpen(false);

    // setInputValue(e.target.value);
    let hasErr = false
    let require = ["REMARKS"]
    let err = {
      REMARKS: null,
    }
    require.map((items) => {
      if (mendata[items] == "" || mendata[items] == '' || mendata[items] == null) {
        hasErr = true
        err[items] = "This field is mandatory"
      }
    })

    seterror(err)
    if (!hasErr) {

      axios.post(`${apiURL}Entry/cancelEntry?id=${outTimedata.previousdata[0].GATE_ENTRY_NO}`, { REMARK: mendata.REMARKS }).then(response => {
        if (response.status == 200) {
          navigate('/Inward')
          toast.success('Entry cancelled successfully.')
          // console.log(response)
        }
      })
    }
  }
  // console.log("isOpen", isOpen)

  const [detail, setDetail] = useState(false)


  return (
    <>
      <Header></Header>

      <div className='headinggg'>
        <div className='headingStyle'>
         <Link to="/Home" style={{ color: 'black' }}><p>Inward Gate Entry - </p></Link>
          <p className='po'>Change Inward Gate Entry</p>
        </div>


        {diff <= 1 && <div className="CancelStyle" onClick={handleOpen}>

          Cancel Entry

          <div className='deleteIcon'>
            <IconContext.Provider value={{ color: "#f10f0f", size: "20px" }}>
              <AiFillDelete
              // type="button"
              // onClick={() => { }}
              />
            </IconContext.Provider>
          </div>

          <Dialog open={isOpen} onClose={() => { setIsOpen(!isOpen) }}>
            <DialogContent>

              <div>

                {/* <div className='modalIcon'>
                  <IconContext.Provider value={{ color: "#f10f0f", size: "20px" }}>
                    <AiOutlineCloseCircle
                      type="button"
                      onClick={() => handleClose() }
                    />
                  </IconContext.Provider>
                </div> */}

                <p className='entryDelete'> Please add reason for cancelling Gate Entry*</p>

                <div className='cancelRemark'>
                  <textarea
                    type='text'
                    className='remarks'
                    rows="3"
                    required
                    onChange={text => setValue({ REMARKS: text.target.value })}
                  />
                </div>
              </div>

            </DialogContent>

            <DialogActions>
              <Button onClick={() => handleClose()} disabled={(mendata.REMARKS == "" || mendata.REMARKS == '' || mendata.REMARKS == null) ? true : false} color="primary">
                Done
              </Button>

            </DialogActions>
          </Dialog>
        </div>}
      </div>

      <div className='InputBox'>

        <div className='entryHead'>
          <p >Gate Entry Number - </p>
          <p className='po'>{outTimedata.previousdata[0].GATE_ENTRY_NO}</p>
        </div>

        <div className='dividerStyle'>
          <CustomDivider color="#1897CE" thickness="0.8vh" />
        </div>

        <div className='detailStyle' >
          <p>Invoice Number : </p>
          <p className='detailStyle1'>{outTimedata.previousdata[0].Entry_Details[0].PO_NO}</p>
        </div>

        <div className='dividerStyle1'>
          <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
        </div>

        <div className='detailStyle' >
          <p>Document Date : </p>
          <p className='detailStyle1'>{new Date(outTimedata.previousdata[0].DOCUMENT_DATE).toDateString()}</p>
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
            <p className='detailStyle1'>TUV India Pvt Ltd (582246)</p>
          </div>

          <div className='dividerStyle1'>
            <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
          </div>

          <div className='detailStyle' >
            <p>Transporter Vendor Name : </p>
            <p className='detailStyle1'>{outTimedata.previousdata[0].VENDOR_NAME}</p>
          </div>

          <div className='dividerStyle1'>
            <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
          </div>

          <div className='detailStyle' >
            <p>Plant : </p>
            <p className='detailStyle1'>{outTimedata.previousdata[0].PLANT}</p>
          </div>

          <div className='dividerStyle1'>
            <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
          </div>

          <div className='detailStyle' >
            <p>Driver Name : </p>
            <p className='detailStyle1'>{outTimedata.previousdata[0].DRIVER_NAME} ({outTimedata.previousdata[0].MOBILE_NUMBER})</p>
          </div>

          <div className='dividerStyle1'>
            <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
          </div>

          <div className='detailStyle' >
            <p>Mode of Transport : </p>
            <p className='detailStyle1'>{outTimedata.previousdata[0].MODE_OF_TRANSPORT} ({outTimedata.previousdata[0].VEHICLE_NO})</p>
          </div>

          <div className='dividerStyle1'>
            <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
          </div>

          <div className='detailStyle' >
            <p>Road Permit Number : </p>
            <p className='detailStyle1'>{outTimedata.previousdata[0].ROAD_PERMIT_NUMBER}</p>
          </div>

          <div className='dividerStyle1'>
            <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
          </div>

          <div className='detailStyle' >
            <p>LR Number : </p>
            <p className='detailStyle1'>{outTimedata.previousdata[0].LR_NO}</p>
          </div>

          <div className='dividerStyle1'>
            <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
          </div>

          <div className='detailStyle' >
            <p>LR Date : </p>
            <p className='detailStyle1'>{new Date(outTimedata.previousdata[0].LR_DATE).toDateString()}</p>
          </div>

          <div className='dividerStyle1'>
            <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
          </div>

          <div className='detailStyle' >
            <p>Packages : </p>
            <p className='detailStyle1'>{outTimedata.previousdata[0].PACKAGES}</p>
          </div>

          <div className='dividerStyle1'>
            <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
          </div>

          <div className='detailStyle' >
            <p>Vehicle Reporting Date & Time : </p>
            <p className='detailStyle1'>{new Date(outTimedata.previousdata[0].REPORTING_DATETIME).toDateString() + " , " + outTimedata.previousdata[0].REPORTING_DATETIME.split("T")[1].split(":")[0] + ":" + outTimedata.previousdata[0].REPORTING_DATETIME.split("T")[1].split(":")[1]}</p>
          </div>

          <div className='dividerStyle1'>
            <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
          </div>

          <div className='detailStyle' >
            <p>Vehicle Inward Date & Time : </p>
            <p className='detailStyle1'>{new Date(outTimedata.previousdata[0].INWARD_DATETIME).toDateString() + " , " + outTimedata.previousdata[0].INWARD_DATETIME.split("T")[1].split(":")[0] + ":" + outTimedata.previousdata[0].INWARD_DATETIME.split("T")[1].split(":")[1]}</p>
          </div>

          <div className='dividerStyle1'>
            <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
          </div>

          {outTimedata.data.OUTDATE && <div className='detailStyle' >
            <p>Vehicle Outward Date & Time : </p>
            <p className='detailStyle1'>{new Date(outTimedata.data.OUTDATE).toDateString() + " , " + outTimedata.data.OUTDATE.split("T")[1]}</p>
          </div>}

          {outTimedata.data.OUTDATE && <div className='dividerStyle1'>
            <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
          </div>}

          {outTimedata.previousdata[0].ATTACHMENT && <div className='detailStyle' >
            <p>Attached Document : </p>
            <a href={`${apiURL}images/${outTimedata.previousdata[0].ATTACHMENT}`} target="_blank" rel="noopener noreferrer"><p className='detailStyle1'>{outTimedata.previousdata[0].ATTACHMENT}</p></a>
          </div>}

          {outTimedata.previousdata[0].ATTACHMENT && <div className='dividerStyle1'>
            <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
          </div>}

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
              rows.map((row) => {
                prepareRow(row)
                return (
                  <tr {...row.getRowProps()}>
                    {
                      row.cells.map((cell) => {
                        return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
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
        <button className="feildBtn" onClick={() => handleSubmit()}>
          Submit
        </button>
      </div>

      <div className='footerSpacing'>
        <Footer>

        </Footer>
      </div>

    </>
  )
}

export default connect(null, { ChangeData })(ItemFeildsChange)