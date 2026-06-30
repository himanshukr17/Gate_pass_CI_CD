import React, { useEffect, useMemo, useState, } from 'react'
import '../../../Stylesheet/Details.scss'
import { useTable } from 'react-table'
import Header from '../../../Components/Header'
import CustomDivider from '../../../Components/Divider'
import Footer from '../../../Components/Footer'
import { Link, useNavigate, useLocation } from "react-router-dom";
import { EntryData, OutData } from '../../../redux/action/Entry'
import { connect } from 'react-redux'
import toast, { Toaster } from 'react-hot-toast';
import { IconContext } from "react-icons";
import { AiFillCaretDown, AiFillCaretRight, AiFillCaretUp } from "react-icons/ai";

function FieldsNRGPout(props) {

      const location = useLocation();
      const itemdata = location.state;
      // console.log("item screen", itemdata)
      let headerdata = itemdata.data
      const navigate = useNavigate()
      const [da, setda] = useState([])
      // console.log(itemdata.podata[0])

      useEffect(() => {
            // On component mount, set the table data with BILLED_QTY property set to 0
            const newData = [];
            itemdata.podata.forEach((items) => {
                  items.Details.forEach((item) => {
                        newData.push({ ...item, BILLED_QTY: item.PO_QTY });
                  });
            });
            setda(newData);
      }, []);

      // console.log(da)
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
                  Header: "Invoice Qty",
                  accessor: "PO_QTY"
            },
            {
                  Header: "Pending Qty",
                  accessor: "PENDING_QTY"
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
            let newarr = [...da];
            const inputValue = Number(event.target.value);
            if (inputValue <= newarr[row.id].PENDING_QTY && inputValue >= 0) {
                  newarr[row.id][columnId] = inputValue;
            }
            setda(newarr);
      };
      const {
            getTableProps,
            getTableBodyProps,
            headerGroups,
            rows,
            prepareRow,
      } = tableInstance


      const notify = () => toast('Entry created successfully.');


      const handlesubmit = () => {
            let Details = []
            // navigate('/Inward')
            // console.log(da)
            da.map((items, index) => {
                  Details.push({
                        PO_NO: items.PO_NO,
                        LINE_ITEM: items.LINE_ITEM,
                        MATERIAL_NO: items.MATERIAL_NO,
                        MATERIAL_DESC: items.MATERIAL_DESC,
                        // PO_QTY: Number,
                        PENDING_QTY: items.PO_QTY,
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
            headerdata.PLANT = itemdata.podata[0].PLANT
            headerdata.VENDOR_ID = itemdata.podata[0].VENDOR_ID
            // data.append({"PLANT":props.multiPOdata[0].PLANT})
            // data.append({"VENDOR_ID":props.multiPOdata[0].Vendor_ID})
            // console.log("Form data and data", itemdata.selectedFile)
            // console.log("headerdata", headerdata)
            // console.log("send", send)
            // console.log("props.EmpId", props.EmpId)

            props.OutData(itemdata.selectedFile, headerdata, send, 4, props.EmpId).then(res => {
                  if (res.status == 200) {
                        console.log("res.data", res)

                        navigate('/Home')
                        toast.success(`Outward Entry Created successfully.`)
                        // console.log("Entry Created successful")
                  }
            }
            )
                  .catch((err) => {
                        console.log(err)
                        toast.error('Unable to create Gate Entry, please try again!')
                        // console.log("Unable to create Gate Entry, please try again!")
                  })

      }

      // console.log(props.EmpId)

      const [detail, setDetail] = useState(false)


      return (
            <>
                  <Header></Header>

                  <div className='headinggg'>
                        <div className='headingStyle'>
                              <Link to="/Home" style={{ color: 'black' }}><p>Outward Gate Entry - </p></Link>
                              <p className='po'>Against Invoice/Challan</p>
                        </div>
                  </div>

                  <div className='InputBox'>

                        <div className='detailStyleee' >
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
                                    <p className='detailStyle1'>{itemdata.podata[0].VENDOR_NAME + " (" + itemdata.podata[0].VENDOR_ID + ")"}</p>
                              </div>

                              <div className='dividerStyle1'>
                                    <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
                              </div>

                              <div className='detailStyle' >
                                    <p>Transporter Vendor Name : </p>
                                    <p className='detailStyle1'>{itemdata.podata[0].VENDOR_NAME}</p>
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
                                                            {row.cells.map((cell) => (
                                                                  cell.column.Header === "Billed Qty" ? (
                                                                        <td {...cell.getCellProps()}>
                                                                              <input
                                                                                    type="text"
                                                                                    min={0}
                                                                                    max={data[row.id]?.PENDING_QTY}
                                                                                    value={data[row.id]?.BILLED_QTY || ""}
                                                                                    onChange={(event) => handleInputChange(event, row, "BILLED_QTY")}

                                                                              />
                                                                        </td>
                                                                  ) : (
                                                                        <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                                                  )
                                                            ))}
                                                      </tr>
                                                );
                                          })
                                    }
                              </tbody>

                        </table>
                  </div>

                  <div className='buttonAlign'>
                        <button className="feildBtn" onClick={() => handlesubmit()}>
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

const mapStateToProps = (state) => {
      return {
            EmpId: state.loginreducer.details
      }
}

export default connect(mapStateToProps, { OutData })(FieldsNRGPout)