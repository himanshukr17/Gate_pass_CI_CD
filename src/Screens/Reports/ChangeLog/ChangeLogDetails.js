import React, { useMemo, useEffect, useState } from 'react'
import '../../../Stylesheet/Details.scss'
import { useTable } from 'react-table'
import Header from '../../../Components/Header'
import CustomDivider from '../../../Components/Divider'
import Footer from '../../../Components/Footer'
import { Link, useNavigate, useLocation } from "react-router-dom";

const apiURL = process.env.REACT_APP_API_URL

function ChangeLogDetails() {

  const navigate = useNavigate()
  const location = useLocation();
  const itemdata = location.state;
  // console.log(itemdata)
  const [da, setda] = useState([])

  useEffect(() => {
    // On component mount, set the table data with BILLED_QTY property set to 0
    const newData = [];
    itemdata.Entry_Details.forEach((items) => {
      newData.push(items)
      // items.Details.forEach((item) => {
      //   newData.push({ ...item, BILLED_QTY: 0 });
      // });
    });
    setda(newData);
  }, []);


  const col = (itemdata.TYPE == 1 ? [
    {
      Header: "Line Item",
      accessor: "LINE_ITEM"
    },

    {
      Header: "PO Numnber",
      accessor: "PO_NO"
    },

    {
      Header: "Material Numnber",
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

    itemdata.TYPE == 2 ? [
      // {
      //   Header: "Line Item",
      //   accessor: "LINE_ITEM"
      // },

      // {
      //   Header: "PO Numnber",
      //   accessor: "PO_NO"
      // },

      {
        Header: "Material Numnber",
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

    ] :

      itemdata.TYPE == 5 ? [
        {
          Header: "Line Item",
          accessor: "LINE_ITEM"
        },

        {
          Header: "PO Numnber",
          accessor: "PO_NO"
        },

        {
          Header: "Material Numnber",
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

        itemdata.TYPE == 3 ? [
          // {
          //   Header: "Line Item",
          //   accessor: "LINE_ITEM"
          // },

          {
            Header: "PO Numnber",
            accessor: "PO_NO"
          },

          {
            Header: "Material Numnber",
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

          itemdata.TYPE == 4 ? [
            {
              Header: "Line Item",
              accessor: "LINE_ITEM"
            },

            {
              Header: "PO Numnber",
              accessor: "PO_NO"
            },

            {
              Header: "Material Numnber",
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

          ] : null

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

  return (
    <>
      <Header></Header>

      <div className='headinggg'>
        <div className='headingStyle'>
          <Link to="/Home" style={{ color: 'black' }}><p>Reports </p></Link>
          <p className='po'> - Change Log Detail</p>
        </div>
      </div>

      <div className='InputBox'>

        <div className='entryNoStyle'>
          <div>
            <div className='entryHead'>
              <p>Gate Entry Number - </p>
              <p className='po'>{itemdata.GATE_ENTRY_NO}</p>
            </div>

            <div className='dividerStyle'>
              <CustomDivider color="#1897CE" thickness="0.8vh" />
            </div>
          </div>
        </div>


        {itemdata.REMARKS && <div className='detailStyle' >
          <p className='cancelRemarktext'>Remarks for Cancellation : </p>
          <p className='detailStyle1'>{itemdata.REMARKS}</p>
        </div>}

        {itemdata.REMARKS && <div className='dividerStyle1'>
          <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
        </div>}

        <div className='detailStyle' >
          <p>Invoice Number : </p>
          <p className='detailStyle1'>{itemdata.INVOICE_NO}</p>
        </div>

        <div className='dividerStyle1'>
          <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
        </div>

        <div className='detailStyle' >
          <p>Document Date : </p>
          <p className='detailStyle1'>{new Date(itemdata.DOCUMENT_DATE).toDateString()}</p>
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
          <p className='detailStyle1'>{itemdata.VENDOR_NAME} ({itemdata.VENDOR_ID})</p>
        </div>

        <div className='dividerStyle1'>
          <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
        </div>

        <div className='detailStyle' >
          <p>Plant : </p>
          <p className='detailStyle1'>{itemdata.PLANT}</p>
        </div>

        <div className='dividerStyle1'>
          <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
        </div>

        <div className='detailStyle' >
          <p>Driver Name : </p>
          <p className='detailStyle1'>{itemdata.DRIVER_NAME} ({itemdata.MOBILE_NUMBER})</p>
        </div>

        <div className='dividerStyle1'>
          <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
        </div>

        <div className='detailStyle' >
          <p>Mode of Transport : </p>
          <p className='detailStyle1'>{itemdata.MODE_OF_TRANSPORT} ({itemdata.VEHICLE_NO})</p>
        </div>

        <div className='dividerStyle1'>
          <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
        </div>

        <div className='detailStyle' >
          <p>Road Permit Number : </p>
          <p className='detailStyle1'>{itemdata.ROAD_PERMIT_NUMBER}</p>
        </div>

        <div className='dividerStyle1'>
          <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
        </div>

        <div className='detailStyle' >
          <p>LR Number : </p>
          <p className='detailStyle1'>{itemdata.LR_NO}</p>
        </div>

        <div className='dividerStyle1'>
          <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
        </div>

        <div className='detailStyle' >
          <p>LR Date : </p>
          <p className='detailStyle1'>{new Date(itemdata.LR_DATE).toDateString()}</p>
        </div>

        <div className='dividerStyle1'>
          <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
        </div>

        <div className='detailStyle' >
          <p>Packages : </p>
          <p className='detailStyle1'>{itemdata.PACKAGES}</p>
        </div>

        <div className='dividerStyle1'>
          <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
        </div>

        <div className='detailStyle' >
          <p>Vehicle Reporting Date & Time : </p>
          <p className='detailStyle1'>{new Date(itemdata.REPORTING_DATETIME).toDateString() + " , " + itemdata?.REPORTING_DATETIME?.split("T")[1]?.split(":")[0] + ":" + itemdata?.REPORTING_DATETIME?.split("T")[1]?.split(":")[1]}</p>
        </div>

        <div className='dividerStyle1'>
          <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
        </div>

        {itemdata.TYPE == 1 || itemdata.TYPE == 2 || itemdata.TYPE == 3 && <div className='detailStyle' >
          <p>Vehicle Inward Date & Time : </p>
          <p className='detailStyle1'>{new Date(itemdata.INWARD_DATETIME).toDateString() + " , " + itemdata?.INWARD_DATETIME?.split("T")[1]?.split(":")[0] + ":" + itemdata?.INWARD_DATETIME?.split("T")[1]?.split(":")[1]}</p>
        </div>}

        {itemdata.TYPE == 1 || itemdata.TYPE == 2 || itemdata.TYPE == 3 && <div className='dividerStyle1'>
          <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
        </div>}

        {itemdata.OUTWARD_DATETIME && <div className='detailStyle' >
          <p>Vehicle Outward Date & Time : </p>
          <p className='detailStyle1'>{new Date(itemdata.OUTWARD_DATETIME).toDateString() + " , " + itemdata?.OUTWARD_DATETIME?.split("T")[1]?.split(":")[0] + ":" + itemdata?.OUTWARD_DATETIME?.split("T")[1]?.split(":")[1]}</p>
        </div>}

        {itemdata.OUTWARD_DATETIME && <div className='dividerStyle1'>
          <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
        </div>}

        {itemdata.ATTACHMENT && <div className='detailStyle' >
          <p>Attached Document : </p>
          <a href={`${apiURL}images/${itemdata.ATTACHMENT}`} target="_blank" rel="noopener noreferrer"><p className='detailStyle1'>{itemdata.ATTACHMENT}</p></a>
        </div>}

        {itemdata.ATTACHMENT && <div className='dividerStyle1'>
          <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
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

      {/* <p className='remarkStyle'>Remarks* :</p>
      <input
        type='text'
        className='remarks'
        disabled="true"
      />

      <div className='buttonAlign'>
        <button className="feildBtn" onClick={() => { }}>
          Submit
        </button>
      </div> */}

      <div className='footerSpacing'>
        <Footer>

        </Footer>
      </div>

    </>
  )
}

export default ChangeLogDetails