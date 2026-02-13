import React, { useEffect,useState } from 'react'
import { getStoreByStatus, updateStoreByStatus } from '../api/authApi'
import NavBar from '../components/NavBar';
import { Button, Table, message } from 'antd';


const AdminHomepage = () => {
  const menus=["Pending","Approved","Rejected"];
  const [menu,setMenu]=useState("pending");
  const [messageApi,contextHolder]=message.useMessage();
  const [storeDetails,setStoreDetails]=useState([]);

  const updateStoreStatus = async(id,status)=>{
    try{
      const payload= {id:id,status:status}
      const storeUpdateStatusResponse= await updateStoreByStatus(payload);
      if(storeUpdateStatusResponse.data.success){
        messageApi.success(`${storeUpdateStatusResponse.data.data.shopName} status is updated`)
        fetchStoreByStatus();
      }
      else{
        messageApi.error(`Store status not updated`)
        // setStoreDetails([])
      }
      
    }
    catch(error){
      console.log(error)
      messageApi.error(`Store status not updated`)
    }
  }
  const columns=[
  {
    title : "Shop Name",
    dataIndex : "shopName",
    key : "shopName",
    render : (text)=> <a>{text}</a>
  },
  {
    title : "Owner Name",
    dataIndex: "ownerName",
    key : "ownerName",
  },
  {
    title : "Email",
    dataIndex : "email",
    key : "email"
  },
  {
    title : "Phone Number",
    dataIndex : "phoneNumber",
    key: "phoneNumber"
  },
  {
    title : "GST Number",
    dataIndex : "gstNumber",
    key : "gstNumber"
  },
  {
    title : "Address",
    dataIndex : "address",
    key : "address",
    render: (text, record) => (
      <div className='ml-3'>
        {text}, {record.pincode}
      </div>
    )
  },
  {
    title : "Action",
    render : (_, record)=>(<div className='flex justify-evenly items-center'>
      {/* onClick={()=>handleStoreStatusUpdate(record._id,"approved") */}
      {menu === "pending" && <Button type='primary' className='bg-green-300' onClick={()=>updateStoreStatus(record.id,"approved")}>Aprove</Button>}
      <Button type="primary" danger id={record._id} onClick={()=>updateStoreStatus(record.id,"rejected")}>Reject</Button>
    </div>),
    hidden : (menu === "rejected")
  },
  ]
  
  
  const filteredCoulumns=columns.filter(column => !column.hidden);

  const fetchStoreByStatus = async()=>{
    try{
      console.log("getting data pending")
      const updatedPendingStoresResponse = await getStoreByStatus({ storeStatus: menu.toLowerCase() });
      const updatedData = updatedPendingStoresResponse.data?.data || [];
      setStoreDetails(updatedData)
    }
    catch(error){
      if (error.response && error.response.status === 404) {
      console.log("Backend returned 404: No pending stores left.");
      setStoreDetails([]);
    } else {
      console.error("Actual API error:", error);
    }
    }
  }
  
  useEffect(()=>{
    console.log("running useeefect")
    fetchStoreByStatus();
  },[menu])

  const handleMenuClick = (status)=>{
    setMenu(status)
  }
  return (
    <div>
    {contextHolder}
    <NavBar menus={menus} defaultKey={menu} onMenuClick={handleMenuClick}/>
    <div>AdminHomepage</div>
    <Table columns={filteredCoulumns} 
      dataSource={storeDetails} 
      rowKey="id" 
      locale={{ emptyText: 'All caught up! No stores pending approval.' }}>
    </Table>
    </div>
  )
}

export default AdminHomepage