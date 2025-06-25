import { useState, useRef, useEffect } from "react";
import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";
import { CircleUser, SquarePen } from "lucide-react";
import api from "../constants/api";
import LoadingIndicator from "../common/LoadingIndicator";
import { toast } from "react-toastify";
import validatePhone from "../components/ui/ValidPhoneFormat";
import InfoField from "../components/ui/InfoField";
import { useColorClasses } from "../theme/useColorClasses";
import { useAuth } from "../context/AuthContext";
import { FONT_SIZES, FONT_WEIGHTS } from "../constants/theme";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [loading, setloading] = useState(false);
  const COLOR_CLASSES = useColorClasses();
  const [initialFormState, setInitialFormState] = useState({});
  const { user } = useAuth();

  const [form, setForm] = useState({
    id:"",
    name: "",
    email: "",
    phone: "",
    new_password: "",
    confirm_password: "",
    image_path:"",
    stripe_account_id:""
  });

  const [errors, setErrors] = useState({});

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setImagePreview(imageURL);
      setForm((prev) => ({ ...prev, image_path: file }));

      // Optional: Upload to backend
      // const formData = new FormData();
      // formData.append("avatar", file);
      // await api.auth.uploadAvatar(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if(name=='phone'){
       const formatted = validatePhone(value);

       setForm((prev) => ({
      ...prev,
      [name]: formatted,
    }));
    }else{
      setForm((prev) => ({
        ...prev,
        [name]: value.toString(),
      }));
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    } 
  };

  const handleToggleEdit = async () => {

    if (isEditing) {
      const newErrors = {};
      if (!form.name.trim()) newErrors.name = "Name is required";
      if (!form.email.trim()) newErrors.email = "Email is required";
      if (!form.phone || form.phone.toString().trim() === "") {
        newErrors.phone = "Phone number is required";
      }


      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("email", form.email);
        formData.append("phone", String(form.phone ?? "").replace(/\D/g, ""));


        if (form.image_path instanceof File) {
            formData.append("image_path", form.image_path);
         }
         setloading(true);
        try {
        
          const res=await api.admin.updateUser(form.id, formData);

          if (res.success) {
            // Optionally show a success toast
            toast.success("Profile Updated Successfully")
          }
        } catch (error) {
          toast.error(error.message)
          console.error("Profile update failed:", error);
        }
        finally{
          setloading(false)
        }
    }

    setIsEditing(!isEditing);
  };

  const handleResetPasswordClick = (toggle) => {
    setShowPasswordFields(toggle);
    setErrors((prev) => ({
      ...prev,
      new_password: "",
      confirm_password: "",
    }));
  };

  const getMe = async () => {
    setloading(true)
    try {
      const res = await api.auth.getMe();
      const { email, name, phone, media,id,stripe_account_id } = res.user;
      if (res.success) {
        const newFormState = {
            id: id || "",
            name: name || "",
            email: email || "",
            phone: phone || "",
            stripe_account_id: stripe_account_id || "",
            image_path: media ? (media[0]?.path) : ""
        };

        setForm((prev) => ({  
          ...prev,
          id: newFormState.id,
          name: newFormState.name,
          email: newFormState.email,
          phone: newFormState.phone,
          image_path: newFormState.image_path,
          stripe_account_id: newFormState.stripe_account_id
        }));

        setInitialFormState(newFormState);

        if (media && media[0]?.path) {
          setImagePreview(media[0]?.path);
        }
      }
    } catch (error) {
      toast.error(error.message)
      console.error("Failed to fetch user data:", error);
    }
    finally{
        setloading(false)
    }
  };

  useEffect(() => {
    getMe();
  }, []);

  const handleResetPasswordSave = async (id) => {
    console.log(id,'id')
    const newErrors = {};

    if (!form.new_password) newErrors.new_password = "New password is required";
    if (!form.confirm_password) newErrors.confirm_password = "Confirm password is required";
    if (form.new_password !== form.confirm_password) {
      newErrors.confirm_password = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...newErrors }));
      return;
    }

    try {
      const res = await api.admin.resetPassword(id,{
        new_password: form.new_password,
        confirm_password: form.confirm_password,
      });

      if (res.success) {
        setForm((prev) => ({
          ...prev,
          new_password: "",
          confirm_password: "",
        }));

        setShowPasswordFields(false);
        // Optionally show success toast
      }
    } catch (error) {
      toast.error(error.message)
      console.error("Password update failed:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);  
    setForm((prev) => ({
      ...prev,
      ...initialFormState
    }));
  }

  return (
    <div className=" p-6">
      {/* Top section */}
      <LoadingIndicator isLoading={loading}/>
      <div className="flex justify-between items-center mb-8">
        <div className={`flex ${isEditing ? "flex-col w-full items-center justify-center text-center" : "items-center space-x-4"}`}>
        <div className="relative cursor-pointer" onClick={handleAvatarClick}>
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Profile Preview"
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gray-100">
              <CircleUser size="100%" strokeWidth={1} color="gray" />
            </div>
          )}
          {isEditing && (
            <span className={`absolute bottom-0 right-0 ${COLOR_CLASSES.bgWhite} rounded-full p-1 shadow`}>
              <SquarePen size={16} />
            </span>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleImageChange}
        />
        
        {!isEditing && (
          <div className="ml-4">
            <h2 className="text-xl font-semibold">{form.name}</h2>
            <p className="text-gray-500 text-sm">{form.email}</p>
          </div>
        )}
      </div>

        {!isEditing && <Button onClick={handleToggleEdit} className="text-sm px-3">
              <div className="hidden md:block">
            Edit Profile
          </div>
           
          <div className="w-4 block md:hidden">
            <SquarePen size="100%" strokeWidth={2}/>
          </div>
        </Button>}
      </div>

      {/* Edit or View Mode */}
      {isEditing ? (
        <>
        <form className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${COLOR_CLASSES.borderGray200} ${COLOR_CLASSES.shadowMd} border p-4 rounded  ${COLOR_CLASSES.borderGray200}`}>
          <InputField
            id="name"
            name="name"
            label="Full Name"
            placeholder="Enter name"
            value={form.name}
            onChange={handleChange}
            error={errors.name}
          />
          <InputField
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="Enter email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
          />
          <InputField
            id="phone"
            name="phone"
            type="text"
            label="Phone Number"
            placeholder="Enter phone number"
            value={validatePhone(form.phone)}
            onChange={handleChange}
            error={errors.phone}
          />
         
        </form>
        
        <div className="flex gap-2 justify-center mt-3">
                  <Button onClick={handleToggleEdit} className="text-sm px-3">
                    Save
                  </Button>
                  <Button onClick={() => handleCancel()} className="text-sm px-3" variant="secondary">
                    Cancel
                  </Button>
                </div>
        
        </>
      ) : (
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700 ${COLOR_CLASSES.borderGray200} ${COLOR_CLASSES.shadowMd} border p-4 rounded-lg`}>
          {/* <div>
            <p className="text-gray-500 mb-1">Full Name</p>
            <p className="py-3 rounded">{form.name}</p>
          </div> */}
          {/* <div>
            <p className="text-gray-500 mb-1">Email</p>
            <p className="py-3 rounded">{form.email}</p>
          </div> */}
          {/* <div>
            <p className="text-gray-500 mb-1">Phone Number</p>
            <p className="py-3 rounded">{validatePhone(form.phone)}</p>
          </div> */}
          <InfoField label="Full Name" value={form.name}/>
          <InfoField label="Email" value={form.email}/>
          <InfoField label="Phone Number" value={validatePhone(form.phone)}/>
          <InfoField label="Stripe Account Id" value={form.stripe_account_id}/>

          <div>
            <p className={`font-[700] leading-none ${COLOR_CLASSES.textPrimary}`}>Password</p>
            {showPasswordFields ? (
              <div className="py-3 rounded space-y-4">
                <InputField
                  id="new_password"
                  name="new_password"
                  type="password"
                  label="New Password"
                  placeholder="Enter new password"
                  value={form.new_password}
                  onChange={handleChange}
                  error={errors.new_password}
                />
                <InputField
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  label="Confirm Password"
                  placeholder="Confirm new password"
                  value={form.confirm_password}
                  onChange={handleChange}
                  error={errors.confirm_password}
                />
                <div className="flex gap-2">
                  <Button onClick={()=>handleResetPasswordSave(user.id)} className="text-sm px-3">
                    Save
                  </Button>
                  <Button onClick={() => handleResetPasswordClick(false)} className="text-sm px-3" variant="secondary">
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p className="py-3 rounded flex gap-5 items-center">
                <span className={`${COLOR_CLASSES.textPrimary}`}>********</span>
                <span
                  onClick={() => handleResetPasswordClick(true)}
                  className="text-blue-600 cursor-pointer hover:underline text-sm"
                >
                  Reset Password
                </span>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
