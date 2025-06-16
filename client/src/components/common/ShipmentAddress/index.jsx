import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  Building,
  LocateIcon,
  MapPin,
  Pencil,
  PinIcon,
  Plus,
} from 'lucide-react';
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
  const COLOR_CLASSES = useColorClasses();

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

  const renderField = (Icon, label, value) => (
    <div className="flex items-start gap-3">
      <Icon className="w-5 h-5 mt-0.5 text-blue-500" />
      <p className={COLOR_CLASSES.textPrimary}>
        <span className={`text-sm ${COLOR_CLASSES.textLight}`}>{label}</span>
        <br />
        <span className="font-medium text-base">{value}</span>
      </p>
    </div>
  );

  const renderForm = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
      <InputField
        label="Address"
        name="address"
        value={formData.address || ''}
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
      <InputField
        label="Zip"
        name="zip"
        value={formData.zip || ''}
        onChange={handleChange}
      />
      <div className="sm:col-span-2 flex flex-wrap gap-3 mt-2">
        <Button className="text-sm px-6" onClick={handleSave}>
          Save
        </Button>
        <Button className="text-sm px-6" variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
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

      {addresses.map((addr, index) => (
        <div
          key={index}
          className={`border rounded-xl p-6 shadow-sm ${COLOR_CLASSES.borderGray200} bg-white`}
        >
          <div className="flex justify-between items-center mb-4">
            <h4 className={`text-lg font-medium ${COLOR_CLASSES.textPrimary}`}>
              Address {index + 1}
            </h4>
            <button
              onClick={() => handleEdit(index)}
              title="Edit"
              className={`hover:text-blue-600 ${COLOR_CLASSES.textSecondary}`}
            >
              <Pencil className="w-5 h-5" />
            </button>
          </div>

          {editingIndex === index ? (
            renderForm()
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
              {renderField(MapPin, 'Address', addr.address)}
              {renderField(Building, 'City', addr.city)}
              {renderField(LocateIcon, 'State', addr.state)}
              {renderField(PinIcon, 'Zip', addr.zip)}
            </div>
          )}
        </div>
      ))}

      {editingIndex === addresses.length && (
        <div
          className={`border rounded-xl p-6 shadow-sm ${COLOR_CLASSES.borderGray200} bg-white`}
        >
          <h4 className={`text-lg font-medium mb-4 ${COLOR_CLASSES.textPrimary}`}>
            Add New Address
          </h4>
          {renderForm()}
        </div>
      )}
    </div>
  );
}

export default ShipmentAddress;
