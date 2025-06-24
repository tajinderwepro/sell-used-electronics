import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../constants/api";
import { Chip } from "../../../components/ui/Chip";
import LoadingIndicator from "../../../common/LoadingIndicator";
import { useColorClasses } from "../../../theme/useColorClasses";
import Button from "../../../components/ui/Button";
import { ChevronRight, CircleCheckBig, CircleHelp, StickyNote } from "lucide-react";
import ConfirmationPopup from "../../../components/common/ConfirmationPopup";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";
import CustomBreadcrumbs from "../../../common/CustomBreadCrumbs";
import InputField from "../../../components/ui/InputField";
import Notes from "../../../components/common/Notes";
import ViewQuoteCard from "../../../components/common/ViewQuoteCard";

const ViewQuote = () => {
  const [loading, setLoading] = useState(false);
  const [device, setDevice] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [noteSubmitting, setNoteSubmitting] = useState(false);


  const [popupState, setPopupState] = useState({ open: false, type: null });
  const { quoteId } = useParams();
  const { user } = useAuth();
  const COLOR_CLASSES = useColorClasses();

  const breadcrumbItems = [
    { label: "Quotes", path: "/admin/quotes" },
    { label: device?.brand_name || "Loading...", path: `/admin/quotes/${quoteId}` },
  ];

  const getDevice = async () => {
    try {
      setLoading(true);
      const res = await api.admin.quotes.get(quoteId);
      setDevice(res.data);
      setSelectedImage(res.data.media?.[0]?.path || "");
    } catch (err) {
      toast.error("Failed to fetch device");
    } finally {
      setLoading(false);
    }
  };

  const getNotes = async () => {
    const res = await api.admin.notes.noteList();
    setNotes(res);
  }

  useEffect(() => {
    getDevice();
    getNotes();
  }, []);
  const handleApproved = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("user_id", user.id);
      formData.append("status", "approved");
      const res = await api.admin.quotes.updateStatus(device.id, formData);
      toast.success(res.message);
      await getDevice();
      setPopupState({ open: false, type: null });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    try {
      setNoteSubmitting(true);
      const payload = {
        user_id: device.user_id,
        content: newNote,
        notiable_id: device.id,
        notiable_type: "Quote",
      };
      await api.admin.notes.create(payload);
      toast.success("Note added");
      setNewNote("");
      getNotes();
      await getDevice();
      setPopupState({ open: false, type: null });
    } catch (err) {
      toast.error("Failed to add note");
    } finally {
      setNoteSubmitting(false);
    }
  };



  const handleClosePopup = () => {
    setPopupState({ open: false, type: null });
    setNewNote("");
  };

  if (loading || !device) return <LoadingIndicator isLoading={loading} />;
  // const selectedDevice = orders.find((d) => String(d.id) === orderId);

  return (
    <div className="max-w-7xl mx-auto">
      <CustomBreadcrumbs items={breadcrumbItems} separator={<ChevronRight />} />
      <div className="h-4"></div>
       <ViewQuoteCard />
        <Notes/>
      <ConfirmationPopup
        open={popupState.open}
        onClose={handleClosePopup}
        onSubmit={popupState.type === "note" ? handleAddNote : handleApproved}
        title={popupState.type === "note" ? "Add Note" : "Approve Device"}
        btnCancel="Cancel"
        btnSubmit={popupState.type === "note" ? "Add" : "Approve"}
        loading={loading || noteSubmitting}
        content={
          popupState.type === "note" ? (
            <InputField
              id="note"
              label="Note"
              multiline
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Write your note..."
              error=""
            />
          ) : null
        }
        icon={
          popupState.type !== "note" ? <CircleHelp className={`w-20 h-20 ${COLOR_CLASSES.primary}`} /> : null
        }
        description={
          popupState.type !== "note" ? "Are you sure you want to approve this device?" : ""
        }
      />
    </div>
  );
};

export default ViewQuote;
