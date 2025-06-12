import React, { useEffect, useState } from 'react'
import Heading from '../../../components/ui/Heading'
import api from '../../../constants/api';
import { toast } from 'react-toastify';
import CommonTable from '../../../common/CommonTable';

function Products() {
  const [devices,setDevices]=useState([])
  const [loading,setLoading] = useState(false)

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const response = await api.admin.getDevices();
      setDevices(response.data);
    } catch (err) {
      console.error("Failed to fetch devices:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    fetchDevices()
  },[])

  
  const columns = [
    { key: "id", label: "ID" },
    { key: "category_name", label: "Category" },
    { key: "brand_name", label: "Brand" },
    { key: "model_name", label: "Model" },
    { key: "condition", label: "Condition" },
    { key: "base_price", label: "Base Price" },
    { key: "ebay_avg_price", label: "Ebay Avg Price" },
    {
      key: "actions",
      label: "Actions",
      render: (device) => (
        <div className="flex gap-2">
          {/* <button onClick={() => getDevice(device.id)}>
            <SquarePen size={18} color="gray" />
          </button>
          <button onClick={() => handleDelete(device.id)}>
            <Trash2 size={18} color="gray" />
          </button> */}
        </div>
      ),
    },
  ];

  return (
    <div className="py-6">
        <Heading className='text-start'>Products List</Heading>
        <CommonTable
        columns={columns}
        data={devices}
        loading={loading}
        pageSize={10}
        title="gbhu"
        // isCreate={false}
       
      />
        
    </div>
  )
}

export default Products