import React, { useEffect, useMemo, useState } from 'react';
import '../../../Stylesheet/Details.scss';
import { useTable } from 'react-table';
import Header from '../../../Components/Header';
import CustomDivider from '../../../Components/Divider';
import Footer from '../../../Components/Footer';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { EntryASN } from '../../../redux/action/Entry';
import { connect } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import { IconContext } from 'react-icons';
import { AiFillCaretDown, AiFillCaretUp } from 'react-icons/ai';

const apiURL = process.env.REACT_APP_API_URL

function ItemFeild(props) {
  const location = useLocation();
  const itemdata = location.state || {};
  let headerdata = itemdata.data || {};
  console.log('itemdata', itemdata);
  console.log('headerdata', headerdata);
  const navigate = useNavigate();
  const [da, setda] = useState([]);
  const [subjectToVerification, setSubjectToVerification] = useState(false);

  useEffect(() => {
    const newData = [];
    if (Array.isArray(itemdata.podata)) {
      itemdata.podata.forEach((items) => {
        if (Array.isArray(items.Details)) {
          items.Details.forEach((item) => {
            newData.push({ 
              ...item, 
              BILLED_QTY: item.DELIVERED_QUANTITY || 0 
            });
          });
        } else {
          console.warn('items.Details is not an array:', items.Details);
        }
      });
    } else {
      console.warn('itemdata.podata is not an array or is undefined:', itemdata.podata);
    }
    console.log('Initialized da:', newData);
    setda(newData);
  }, [itemdata.podata]);

  const col = [
    {
      Header: 'PO Number',
      accessor: 'PO_NO',
    },
    {
      Header: 'Line Item',
      accessor: 'ITEM_CATEGORY',
    },
    {
      Header: 'Material Number',
      accessor: 'MATERIAL',
    },
    {
      Header: 'Material Description',
      accessor: 'MATERIAL_DESCRIPTION',
    },
    {
      Header: 'Unit',
      accessor: 'UNIT',
    },
    {
      Header: 'PO Qty',
      accessor: 'ORDER_QUANTITY',
    },
    {
      Header: 'Remaining Quantity',
      accessor: (row) => Number(row.PENDING_QUANTITY).toFixed(3),
    },
    {
      Header: 'Billed Qty',
      accessor: 'BILLED_QTY',
    },
  ];

  const columns = useMemo(() => col, []);
  const data = useMemo(() => da, [da]);

  const tableInstance = useTable({
    columns,
    data,
  });

  const handleInputChange = (event, row, columnId) => {
    const newValue = event.target.value;
    console.log('Input change:', { row: row.original, columnId, newValue });

    const updatedDa = da.map((item) => {
      if (item.PO_NO === row.original.PO_NO && item.ITEM_CATEGORY === row.original.ITEM_CATEGORY) {
        return { ...item, [columnId]: Number(newValue) >= 0 ? Number(newValue) : 0 };
      }
      return item;
    });

    console.log('Updated da:', updatedDa);
    setda(updatedDa);
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  const handlesubmit = () => {
    let Details = [];

    da.forEach((item) => {
      Details.push({
        PO_NUMBER: item.PO_NO,
        LINE_ITEM: item.ITEM_CATEGORY,
        MATERIAL_NUMBER: item.MATERIAL,
        MATERIAL_DESCRIPTION: item.MATERIAL_DESCRIPTION,
        REMAINING_QUANTITY: item.PENDING_QUANTITY,
        UNIT: item.UNIT,
        BILLED_QTY: Number(item.BILLED_QTY),
        SUBJECT_TO_VERIFICATION: subjectToVerification ? 1 : 0,
      });
    });

    console.log('Details for submit:', Details);

    const hasBilledQuantity = Details.some((item) => Number(item.BILLED_QTY) > 0);

    if (!hasBilledQuantity) {
      toast.error('Please enter Billed Quantity for at least one line item.');
      return;
    }

    const send = JSON.stringify(Details);
    headerdata.PLANT = itemdata.podata?.[0]?.PLANT || '';
    headerdata.VENDOR_ID = itemdata.podata?.[0]?.VENDOR_ID || '';

    setIsLoading(true);

    setTimeout(() => {
      props
        .EntryASN(itemdata.selectedFile, headerdata, send, 1, props.EmpId)
        .then((res) => {
          console.log("res", res);
          setIsLoading(false);
          if (res.status === 200) {
            navigate('/Home');
            toast.success(`${res.data.GATE_ENTRY_NO} Entry Created successfully.`);
          }
        })
        .catch((err) => {
          setIsLoading(false);
          console.error('Error:', err);
          toast.error(err.message || 'Unable to create Gate Entry, Please try again!');
        });
    }, 1000);
  };

  const [plantList, setPlantList] = useState([]);
  const [plantOptions, setPlantOptions] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${apiURL}/Employee/allocated_plant?id=${props.EmpId}`
        );
        const newData = await response.json();

        setPlantList(newData);

        const options = newData.map((plant) => ({
          label: plant.PLANT_NAME,
          value: plant.PLANT_ID,
        }));
        setPlantOptions(options);

        const matchedPlant = newData.find(
          (plant) => plant.PLANT_ID === itemdata.podata?.[0]?.PLANT
        );
        if (matchedPlant) {
          setSelectedPlant(matchedPlant);
        }
      } catch (error) {
        console.error('Error fetching plant data:', error);
      }
    };

    fetchData();
  }, [props.EmpId, itemdata.podata]);

  const [detail, setDetail] = useState(false);

  return (
    <>
      <Toaster />
      <Header />
      <div className="headinggg">
        <div className="headingStyle">
          <Link to="/Home" style={{ color: 'black' }}>
            <p>Inward Gate Entry - </p>
          </Link>
          <p className="po">With ASN</p>
        </div>
      </div>

      <div className="InputBox">
        <div className="detailStyleee">
          <p>Incoming Reference Number : </p>
          <p className="detailStyle1">{itemdata.data?.INVOICE || 'N/A'}</p>
        </div>

        <div className="dividerStyle1">
          <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
        </div>

        <div className="detailStyle">
          <p>Invoice Date : </p>
          <p className="detailStyle1">
            {itemdata.data?.DOCDATE ? new Date(itemdata.data.DOCDATE).toDateString() : 'N/A'}
          </p>
        </div>

        <div className="dividerStyle1">
          <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
        </div>

        <div className="moreDetail">
          <p>More Details</p>
          <div className="arrowStyle" onClick={() => setDetail(!detail)}>
            <IconContext.Provider value={{ color: '#FF0000', size: '23px' }}>
              {detail === false ? <AiFillCaretDown type="button" /> : <AiFillCaretUp type="button" />}
            </IconContext.Provider>
          </div>
        </div>

        {detail && (
          <div>
            <div className="detailStyle">
              <p>Vendor Details : </p>
              <p className="detailStyle1">
                {(itemdata.podata?.[0]?.VENDOR_NAME || 'N/A') + ' (' + (itemdata.podata?.[0]?.VENDOR_ID || 'N/A') + ')'}
              </p>
            </div>

            <div className="dividerStyle1">
              <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
            </div>

            <div className="detailStyle">
              <p>Transporter Vendor Name : </p>
              <p className="detailStyle1">{itemdata.data?.VENDORNAME || 'N/A'}</p>
            </div>

            <div className="dividerStyle1">
              <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
            </div>

            <div className="detailStyle">
              <p>Plant : </p>
              <p className="detailStyle1">
                {selectedPlant ? `${selectedPlant.PLANT_ID}-${selectedPlant.PLANT_NAME}` : 'N/A'}
              </p>
            </div>

            <div className="dividerStyle1">
              <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
            </div>

            <div className="detailStyle">
              <p>Driver Name : </p>
              <p className="detailStyle1">{itemdata.data?.DRIVERNAME || 'N/A'}</p>
            </div>

            <div className="dividerStyle1">
              <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
            </div>

            <div className="detailStyle">
              <p>Mobile no. : </p>
              <p className="detailStyle1">{itemdata.data?.MOBILE || 'N/A'}</p>
            </div>

            <div className="dividerStyle1">
              <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
            </div>

            <div className="detailStyle">
              <p>Mode of Transport : </p>
              <p className="detailStyle1">{itemdata.data?.MOT || 'N/A'}</p>
            </div>

            <div className="dividerStyle1">
              <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
            </div>

            <div className="detailStyle">
              <p>Road Permit Number : </p>
              <p className="detailStyle1">{itemdata.data?.ROADPERMIT || 'N/A'}</p>
            </div>

            <div className="dividerStyle1">
              <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
            </div>

            <div className="detailStyle">
              <p>LR Number & Date : </p>
              <p className="detailStyle1">
                {(itemdata.data?.LR || 'N/A') + ' , ' + (itemdata.data?.LRDATE ? new Date(itemdata.data.LRDATE).toDateString() : 'N/A')}
              </p>
            </div>

            <div className="dividerStyle1">
              <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
            </div>

            <div className="detailStyle">
              <p>Packages : </p>
              <p className="detailStyle1">{itemdata.data?.PACKAGES || 'N/A'}</p>
            </div>

            <div className="dividerStyle1">
              <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
            </div>

            <div className="detailStyle">
              <p>Vehicle Reporting Date & Time : </p>
              <p className="detailStyle1">
                {(itemdata.data?.VEHICLEREPDATE
                  ? new Date(itemdata.data.VEHICLEREPDATE).toDateString() + ' , ' + itemdata.data.VEHICLEREPDATE.split('T')[1]
                  : 'N/A')}
              </p>
            </div>

            <div className="dividerStyle1">
              <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
            </div>

            <div className="detailStyle">
              <p>Attachments:</p>
              <div className="attachmentList">
                {itemdata.data?.ATTACHMENT?.length > 0 ? (
                  itemdata.data.ATTACHMENT.map((file, index) => (
                    <p
                      key={index}
                      className="detailStyle1"
                      style={{
                        cursor: 'pointer',
                        borderRadius: '20px',
                        border: '1px solid blue',
                        color: 'blue',
                        width: '4em',
                        overflow: 'hidden',
                        fontSize: '12px',
                        padding: '4px 10px',
                        margin: '5px',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        display: 'inline-block',
                      }}
                      onClick={() => {
                        const fileURL = URL.createObjectURL(file);
                        window.open(fileURL, '_blank');
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

            <div className="dividerStyle1">
              <CustomDivider width="130vh" color="#D2D2D2" thickness="0.2vh" />
            </div>
          </div>
        )}
      </div>

      <div
        style={{ marginLeft: '10%', marginTop: '1%', display: 'flex', alignItems: 'center' }}
      >
        <input
          type="checkbox"
          id="subjectToVerificationCheckbox"
          checked={subjectToVerification}
          onChange={() => setSubjectToVerification(!subjectToVerification)}
          style={{ marginLeft: '20px' }}
        />
        <label htmlFor="subjectToVerificationCheckbox" style={{ marginLeft: '10px' }}>
          Subject to Verification
        </label>
      </div>

      <div className="tableStyle" style={{ marginTop: '1%' }}>
        {da.length === 0 ? (
          <p>No data available</p>
        ) : (
          <table {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                console.log("row data",row)
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} key={`${row.original.PO_NO}-${row.original.ITEM_CATEGORY}`}>
                    {row.cells.map((cell) => {
                      if (cell.column.Header === 'Billed Qty') {
                        return (
                          <td>
                            <input
                              type="number"
                              min={0}
                              style={{
                                fontSize: '10px',
                                marginLeft: '20px',
                                width: '120px',
                                height: '18px',
                                borderRadius: '5px',
                              }}
                              value={row.original.BILLED_QTY ?? ''}
                              onChange={(event) => handleInputChange(event, row, 'BILLED_QTY')}
                            />
                          </td>
                        );
                      }
                      return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div
        className="buttonAlign"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '20px',
        }}
      >
        <button
          className="feildBtn"
          onClick={() => handlesubmit()}
          disabled={isLoading || da.length === 0}
          style={{
            backgroundColor: isLoading || da.length === 0 ? '#ccc' : '#007BFF',
            color: isLoading || da.length === 0 ? '#666' : '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: isLoading || da.length === 0 ? 'not-allowed' : 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          {isLoading ? (
            <span
              style={{
                border: '2px solid #f3f3f3',
                borderTop: '2px solid #3498db',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                animation: 'spin 1s linear infinite',
                display: 'inline-block',
              }}
            ></span>
          ) : (
            'Submit'
          )}
        </button>
      </div>

      <div className="footerSpacing">
        <Footer />
      </div>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    EmpId: state.loginreducer.details,
  };
};

export default connect(mapStateToProps, { EntryASN })(ItemFeild);