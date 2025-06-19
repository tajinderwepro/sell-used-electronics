import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Building, LocateIcon, Mail, Trash2, MapPin, PinIcon, Plus, Circle, CircleHelp, SquarePen } from 'lucide-react';
import { useColorClasses } from '../../../theme/useColorClasses';
import api from '../../../constants/api';
import Button from '../../ui/Button';
import InputField from '../../ui/InputField';
import { useAuth } from '../../../context/AuthContext';
import InfoField from '../../ui/InfoField';
import Popup from '../../../common/Popup';

function ShipmentAddress() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({});
  const COLOR_CLASSES = useColorClasses();
  const [showAddAddressModal, setshowAddAddressModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (editingIndex === addresses.length) {
      setshowAddAddressModal(true);
    }
  }, [editingIndex, addresses.length]);


  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    const res = await api.address.get(user.id);
    setAddresses(res.address || []);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setFormData(addresses[index]);
  };

  const handleAddNew = () => {
    setshowAddAddressModal(true);
    setEditingIndex(addresses.length);
    setFormData({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setshowAddAddressModal(false);
    setEditingIndex(null);
    setFormData({});
  };

  const handleSave = async () => {
    const isNew = editingIndex === addresses.length;
    const payload = { ...formData };
    console.log('data to edit', payload);
    if (!isNew) payload.id = addresses[editingIndex].id;

    const res = await api.address.add(user.id, payload);
    const updated = [...addresses];

    if (isNew) updated.push(res.address);
    else updated[editingIndex] = res.address;

    setAddresses(updated);
    setEditingIndex(null);
    toast.success(res.message);
  };

  const handleDeleteClick = (index) => {
    setDeleteIndex(index);
  };

  const confirmDelete = async () => {
    if (!deleteIndex) return;

    try {
      const res = await api.address.deleteAddress(deleteIndex);
      toast.success(res.message || 'Address deleted successfully.');
      loadAddresses();
    } catch (err) {
      toast.error('Failed to delete address.');
    } finally {
      setDeleteIndex(null);
    }
  };

  const cancelDelete = () => {
    setDeleteIndex(null);
  };


  // const renderField = (Icon, label, value) => (
  //   <div className="flex items-start gap-3">
  //     <Icon className="w-5 h-5 mt-0.5 text-blue-500" />
  //     <p className={COLOR_CLASSES.textPrimary}>
  //       <span className={`text-sm ${COLOR_CLASSES.textLight}`}>{label}</span>
  //       <br />
  //       <span className="font-medium text-base">{value}</span>
  //     </p>
  //   </div>
  // );

  const renderForm = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
      <InputField
        label="Address"
        name="address"
        value={formData.address || ''}
        onChange={handleChange}
      />
      <InputField
        label="Zip"
        name="zip"
        value={formData.zip || ''}
        onChange={handleChange}
      />
      <InputField
        label="City"
        name="city"
        value={formData.city || ''}
        onChange={handleChange}
      />
      <InputField
        label="State"
        name="state"
        value={formData.state || ''}
        onChange={handleChange}
      />
    </div>
  );

  return (
    <div className="space-y-6 mt-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className={`text-2xl font-semibold ${COLOR_CLASSES.textPrimary}`}>
          Shipment Address
        </h2>
        <Button
          onClick={handleAddNew}
          className="text-sm w-full sm:w-48"
          icon={<Plus size={16} />}
        >
          Add New Address
        </Button>
      </div>

      {addresses.length === 0 && editingIndex !== addresses.length && (
        <div className="flex items-center justify-center mt-12 min-h-[200px] text-center">
          <div className="flex flex-col items-center space-y-2">
            <Building className="w-10 h-10 text-blue-500" />
            <h4 className={`text-lg font-semibold ${COLOR_CLASSES.textPrimary}`}>
              No addresses found
            </h4>
            <p className={`text-sm ${COLOR_CLASSES.textSecondary}`}>
              Start by adding a new address.
            </p>
          </div>
        </div>
      )}

      <div  className={`grid gap-x-4  gap-y-4 mx-auto grid-cols-1 sm:grid-cols-2  items-stretch`}>
        {addresses.map((addr, index) => (
        <div
          key={index}
          className={`${COLOR_CLASSES.borderGray200} ${COLOR_CLASSES.shadowMd} border p-4 rounded-lg flex flex-col h-full`}
        >
          <div className="flex justify-between items-center mb-2 pb-2 border-b">
            <span className={`font-normal ${COLOR_CLASSES.primaryBg} text-sm text-white rounded-md px-2 py-1 leading-none`}>Address {index + 1}</span>
           <div className="flex items-center gap-2">
          {/* <Button
            variant="outline"
            className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white px-2 py-1 text-xs rounded"
            style={{ minWidth: 'auto', height: '28px' }}
          >
            Set as Default
          </Button> */}

                <button
                  onClick={() => handleDeleteClick(addr.id)}
                  className={`${COLOR_CLASSES.textSecondary} hover:text-red-700`}
                >
                  <Trash2 size={18} className="w-5 h-5" />
                  
                </button>

                <button
                  onClick={() => handleEdit(index)}
                  title="Edit"
                  className={`${COLOR_CLASSES.textSecondary} ${COLOR_CLASSES.textHoverPrimary}`}
                >
                  <SquarePen className="w-5 h-5" />
                </button>
              </div>
            </div>
           <div className='flex flex-col h-full w-full'>
             <div className='w-full mb-4 h-[80px]'>
                <InfoField Icon={MapPin} label="Address" value={addr.address} />
              </div>
            <div className={`grid grid-cols-2 gap-x-2 gap-y-4 rounded-md`}>
              
                <InfoField Icon={PinIcon} label="Zip" value={addr.zip} />
              <InfoField Icon={Building} label="City" value={addr.city} />
             
              <InfoField Icon={LocateIcon} label="State" value={addr.state} />
            </div>
           </div>

          </div>
        ))}
      </div>

      <Popup
        open={editingIndex === addresses.length && showAddAddressModal}
        title="Add New Address"
        onSubmit={handleSave}
        onClose={handleCancel}
      >
        {renderForm()}
      </Popup>
      <Popup
        open={deleteIndex !== null}
        title="Delete Address?"
        onClose={cancelDelete}
        onDelete={confirmDelete}
        isbtnSubmit={false}
        isbtnCancel={true}
        isbtnDelete={true}
        btnDelete="Delete"
      >
        <div className="flex flex-col items-center justify-center text-center space-y-4 py-2">
          <CircleHelp className="w-28 h-28" />
          <p className={`${COLOR_CLASSES.textPrimary} text-sm font-medium`}>
            Are you sure you want to delete this address?
          </p>
        </div>
      </Popup>
      <Popup
        open={editingIndex !== null}
        title="Edit Address"
        onSubmit={handleSave}
        onClose={handleCancel}
      >
        {renderForm()}
      </Popup>
    </div>
  );
}

export default ShipmentAddress;
