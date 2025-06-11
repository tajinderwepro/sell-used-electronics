import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Building, LocateIcon, Mail, MapPin, Pencil, Plus } from 'lucide-react';
import { useColorClasses } from '../../../theme/useColorClasses';
import api from '../../../constants/api';
import Button from '../../ui/Button';
import InputField from '../../ui/InputField';
import { useAuth } from '../../../context/AuthContext';

function ShipmentAddress() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({});
  const COLOR_CLASSES  = useColorClasses();

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
    setEditingIndex(addresses.length);
    setFormData({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('name, valuename, valuename, value',name, value);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setFormData({});
  };

  const handleSave = async () => {
    const isNew = editingIndex === addresses.length;
    const payload = { ...formData };
    if (!isNew) payload.id = addresses[editingIndex].id;

    const res = await api.address.add(user.id, payload);
    const updated = [...addresses];

    if (isNew) updated.push(res.address);
    else updated[editingIndex] = res.address;

    setAddresses(updated);
    setEditingIndex(null);
    toast.success(res.message);
  };
  return (
    <div className="space-y-8 mt-8">
      <div className='flex items-center justify-between'>
          <h4 className={`text-xl font-bold ${COLOR_CLASSES.textPrimary}`}>Shipment Address</h4>
            <Button
              onClick={handleAddNew}
              className="text-sm w-40"
              icon={<Plus size={16} />}
            >
          Add New Address
        </Button>

      </div>
      {addresses.length === 0 && editingIndex != addresses.length && (
        <div className="flex items-center justify-center mt-8 min-h-[300px]">
          <div className="flex items-center gap-2">
            <Building className="w-8 h-8" />
            <div>
              <h4 className={`text-lg font-semibold ${COLOR_CLASSES.textPrimary}`}>No addresses found</h4>
              <p className={`text-sm ${COLOR_CLASSES.textSecondary}`}>Add a new address</p>
            </div>
          </div>
        </div>
      )}
      {addresses.map((addr, index) => (
        <div
          key={index}
          className={`${COLOR_CLASSES.borderGray200} ${COLOR_CLASSES.shadowMd} border p-4 rounded  ${COLOR_CLASSES.borderGray200}`}
        >
          <div className="flex justify-between items-center mb-2 ">
            <span className={`font-semibold ${COLOR_CLASSES.textPrimary}`}>Address {index + 1}</span>
            <button
              onClick={() => handleEdit(index)}
              title="Edit"
              className={`${COLOR_CLASSES.textSecondary} ${COLOR_CLASSES.textHoverPrimary}`}
            >
              <Pencil className="w-5 h-5" />
            </button>
          </div>
          {editingIndex === index ? (
            <>
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 p-4 `}>
              <InputField label="Address" name="address" value={formData.address || ''} onChange={handleChange} />
              <InputField label="City" name="city" value={formData.city || ''} onChange={handleChange} />
              <InputField label="State" name="state" value={formData.state || ''} onChange={handleChange} />
              <InputField label="Zip" name="zip" value={formData.zip || ''} onChange={handleChange} />
              <div className="flex gap-2 mt-2">
                <Button className="text-sm w-40" onClick={handleSave}>Save</Button>
                <Button className="text-sm w-40" variant="outline" onClick={handleCancel}>Cancel</Button>
              </div>
            </div>
            </>
          ) : (
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 p-4 `}>
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 mt-0.5 text-blue-500" />
                <p className={COLOR_CLASSES.textPrimary}>
                  <span className={COLOR_CLASSES.textLight}>Address:</span><br />{addr.address}
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Building className="w-5 h-5 mt-0.5 text-blue-500" />
                <p className={COLOR_CLASSES.textPrimary}>
                  <span className={COLOR_CLASSES.textLight}>City:</span><br />{addr.city}
                </p>
              </div>
              <div className="flex items-start gap-2">
                <LocateIcon className="w-5 h-5 mt-0.5 text-blue-500" />
                <p className={COLOR_CLASSES.textPrimary}>
                  <span className={COLOR_CLASSES.textLight}>State:</span><br />{addr.state}
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-5 h-5 mt-0.5 text-blue-500" />
                <p className={COLOR_CLASSES.textPrimary}>
                  <span className={COLOR_CLASSES.textLight}>Zip:</span><br />{addr.zip}
                </p>
              </div>
            </div>

          )}
        </div>
      ))}

      {editingIndex === addresses.length && (
        <div
          className={`${COLOR_CLASSES.borderGray200} ${COLOR_CLASSES.bgWhite} ${COLOR_CLASSES.shadowMd} border p-4 rounded space-y-2`}
        >
          <h4 className={`font-semibold ${COLOR_CLASSES.textPrimary}`}>Add New Address</h4>
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 p-4 `}>
                <InputField label="Address" name="address" value={formData.address || ''} onChange={handleChange} />
                <InputField label="City" name="city" value={formData.city || ''} onChange={handleChange} />
                <InputField label="State" name="state" value={formData.state || ''} onChange={handleChange} />
                <InputField label="Zip" name="zip" value={formData.zip || ''} onChange={handleChange} />
             <div className="flex gap-2 mt-2">
              <Button className="text-sm w-40" onClick={handleSave}>Save</Button>
              <Button className="text-sm w-40" variant="outline" onClick={handleCancel}>Cancel</Button>
            </div>
            </div>
        </div>
      )
      }
    </div>
  );
}

export default ShipmentAddress;
