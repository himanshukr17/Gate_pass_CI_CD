import React, { useMemo, } from 'react'
import '../../../Stylesheet/Details.scss'
import { useTable } from 'react-table'
import Header from '../../../Components/Header'
import CustomDivider from '../../../Components/Divider'
import Footer from '../../../Components/Footer'
import { Link, useNavigate } from "react-router-dom";


function ItemFeildRGP() {

  const navigate = useNavigate()

  const da = [
    {
      "id": 1,
      "po_number": "638289",
      "material_no": "40001638",
      "desc": "dummy text here",
      "unit": "NOS",
      "pending_qty": "800",
      "billed_qty": "689",
    },

    {
      "id": 1,
      "po_number": "638289",
      "material_no": "40001638",
      "desc": "dummy text here",
      "unit": "NOS",
      "pending_qty": "800",
      "billed_qty": "689",
    },

    {
      "id": 1,
      "po_number": "638289",
      "material_no": "40001638",
      "desc": "dummy text here",
      "unit": "NOS",
      "pending_qty": "800",
      "billed_qty": "689",
    },

    {
      "id": 1,
      "po_number": "638289",
      "material_no": "40001638",
      "desc": "dummy text here",
      "unit": "NOS",
      "pending_qty": "800",
      "billed_qty": "689",
    },

    {
      "id": 1,
      "po_number": "638289",
      "material_no": "40001638",
      "desc": "dummy text here",
      "unit": "NOS",
      "pending_qty": "800",
      "billed_qty": "689",
    },

    {
      "id": 1,
      "po_number": "638289",
      "material_no": "40001638",
      "desc": "dummy text here",
      "unit": "NOS",
      "pending_qty": "800",
      "billed_qty": "689",
    },

  ]

  const col = [
    {
      Header: "Line Item",
      accessor: "id"
    },

    {
      Header: "PO Numnber",
      accessor: "po_number"
    },

    {
      Header: "Material Number",
      accessor: "material_no"
    },

    {
      Header: "Material Description",
      accessor: "desc"
    },

    {
      Header: "Unit",
      accessor: "unit"
    },

    {
      Header: "Pending Qty",
      accessor: "pending_qty"
    },

    {
      Header: "Billed Qty",
      accessor: "billed_qty"
    },

  ]
  const columns = useMemo(() => col, [])
  const data = useMemo(() => da, [])

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

  return (
    <>
      <Header></Header>

      <div className='headinggg'>
        <div className='headingStyle'>
         <Link to="/Home" style={{ color: 'black' }}><p>Inward Gate Entry - </p></Link>
          <p className='po'>Against RGP/RFA Number</p>
        </div>
      </div>

      <div className='InputBox'>

      <div className='entryNoStyle'>
                              <div>
                                    <div className='entryHead'>
                                          <p>Gate Entry Number - </p>
                                          <p className='po'>I526</p>
                                    </div>

                                    <div className='dividerStyle'>
                                          <CustomDivider color="#1897CE" thickness="0.8vh" />
                                    </div>
                              </div>

                              <div>
                                    <div className='entryHead'>
                                          <p>Ref Gate Entry Number - </p>
                                          <p className='po'>I526</p>
                                    </div>

                                    <div className='dividerStyle'>
                                          <CustomDivider color="#1897CE" thickness="0.8vh" />
                                    </div>
                              </div>
                        </div>

        <div className='detailStyle' >
          <p>Invoice Number : </p>
          <p className='detailStyle1'>4002749</p>
        </div>

        <div className='dividerStyle1'>
          <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
        </div>

        <div className='detailStyle' >
          <p>Document Date : </p>
          <p className='detailStyle1'>{new Date().toDateString()}</p>
        </div>

        <div className='dividerStyle1'>
          <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
        </div>

        <div className='detailStyle' >
          <p>Transporter Vendor Name : </p>
          <p className='detailStyle1'>TUV India Ltd (583345)</p>
        </div>

        <div className='dividerStyle1'>
          <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
        </div>

        <div className='detailStyle' >
          <p>Plant : </p>
          <p className='detailStyle1'>Plant Name (PG05)</p>
        </div>

        <div className='dividerStyle1'>
          <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
        </div>

        <div className='detailStyle' >
          <p>Driver Name : </p>
          <p className='detailStyle1'>Rajesh Kumar (9975347895)</p>
        </div>

        <div className='dividerStyle1'>
          <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
        </div>

        <div className='detailStyle' >
          <p>Mode of Transport : </p>
          <p className='detailStyle1'>Truck (HR-26-CY-8976)</p>
        </div>

        <div className='dividerStyle1'>
          <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
        </div>

        <div className='detailStyle' >
          <p>Road Permit Number : </p>
          <p className='detailStyle1'>64325678</p>
        </div>

        <div className='dividerStyle1'>
          <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
        </div>

        <div className='detailStyle' >
          <p>LR Number & Date : </p>
          <p className='detailStyle1'>{new Date().toDateString()}</p>
        </div>

        <div className='dividerStyle1'>
          <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
        </div>

        <div className='detailStyle' >
          <p>Packages : </p>
          <p className='detailStyle1'>389</p>
        </div>

        <div className='dividerStyle1'>
          <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
        </div>

        <div className='detailStyle' >
          <p>Vehicle Reporting Date & Time : </p>
          <p className='detailStyle1'>{new Date().toDateString()}</p>
        </div>

        <div className='dividerStyle1'>
          <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
        </div>

        <div className='detailStyle' >
          <p>Vehicle Inward Date & Time : </p>
          <p className='detailStyle1'>{new Date().toDateString()}</p>
        </div>

        <div className='dividerStyle1'>
          <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
        </div>

        <div className='detailStyle' >
          <p>Vehicle Weight at time of Reporting : </p>
          <p className='detailStyle1'>112 kg</p>
        </div>

        <div className='dividerStyle1'>
          <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
        </div>

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
        <button className="feildBtn" onClick={() => { }}>
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

export default ItemFeildRGP