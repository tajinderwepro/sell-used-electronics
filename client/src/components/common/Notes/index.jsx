import { CircleHelp, SearchCheck, StickyNote } from "lucide-react"
import InputField from "../../ui/InputField";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Button from "../../ui/Button";
import ConfirmationPopup from "../ConfirmationPopup";
import api from "../../../constants/api";
import { useColorClasses } from "../../../theme/useColorClasses";
import { useAuth } from "../../../context/AuthContext";
import Heading from "../../ui/Heading";

const Notes = ({  data, type = "quote" }) => {
    const [popupState, setPopupState] = useState({ open: false, type: null });
    const [noteSubmitting, setNoteSubmitting] = useState(false);
    const [newNote, setNewNote] = useState("");
    const COLOR_CLASSES= useColorClasses();
    const {user} = useAuth()
    console.log("typetypetype",type, data);
    const handleAddNote = async () => {
        if (!newNote.trim()) return;
        setNoteSubmitting(true);
        try {
            const payload = {
                content: newNote,
                notiable_id: data.id,
                notiable_type: type,
            };
            await api.admin.notes.create(payload);
            toast.success("Note added");
            setNewNote("");
            setPopupState({ open: false, type: null });
        } catch {
            toast.error("Failed to add note");
        } finally {
            setNoteSubmitting(false);
        }
    };    
    return (
        <>
            <div className={`mb-6 mt-6 p-6 ${COLOR_CLASSES.borderGray200} border rounded-2xl  shadow-sm`}>
                <div className="flex justify-between items-center mb-4">
                    <Heading className="text-lg font-semibold">Notes</Heading>
                    <Button className="p-2 text-sm" icon={<StickyNote className="w-5 h-4"/>} onClick={() => setPopupState({ open: true, type: "note" })}>
                        Add Note
                    </Button>
                </div>
                {!data?.notes ||  data.notes.length === 0 ? (
                    <div className="p-4  flex items-center justify-center flex-col">
                        <SearchCheck className="h-12 w-10 text-gray-400"/>
                        <h2>No notes available</h2>
                    </div>
                ) : (
                    <ul className="space-y-3 max-h-[300px] overflow-auto pr-1">
                        {data.notes && data.notes.map(note => (
                            <li key={note.id} className={`border p-3 rounded-md ${COLOR_CLASSES.bgGradient} ${COLOR_CLASSES.borderGray200}`}>
                                <div className={`text-sm ${COLOR_CLASSES.textPrimary} mb-1`}>
                                    By <strong>{note.user ? note.user.name : ''}</strong> on {new Date(note.created_at).toLocaleString()}
                                </div>
                                <div className={`${COLOR_CLASSES.textPrimary}`}>{note.content}</div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <ConfirmationPopup
                open={popupState.open && popupState.type === "note"}
                onClose={() => setPopupState({ open: false, type: null })}
                onSubmit={handleAddNote}
                title="Add Note"
                btnCancel="Cancel"
                btnSubmit="Add"
                loading={noteSubmitting}
                icon={<CircleHelp className="w-20 h-20 text-blue-500" />}
                content={
                    <InputField
                        id="note"
                        label="Note"
                        multiline
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Write your note..."
                    />
                }
            />

        </>

    )
}
export default Notes