import { CircleHelp, StickyNote } from "lucide-react"
import InputField from "../../ui/InputField";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Button from "../../ui/Button";
import ConfirmationPopup from "../ConfirmationPopup";
import api from "../../../constants/api";
import { useColorClasses } from "../../../theme/useColorClasses";
import { useAuth } from "../../../context/AuthContext";

const Notes = ({  order }) => {
    const [popupState, setPopupState] = useState({ open: false, type: null });
    const [noteSubmitting, setNoteSubmitting] = useState(false);
    const [newNote, setNewNote] = useState("");
    const [notes, setNotes] = useState([]);
    const COLOR_CLASSES= useColorClasses();
    const {user} = useAuth()

    const getNotes = async () => {
        try {
            const res = await api.admin.notes.noteList();
            setNotes(res);
        } catch {
            toast.error("Failed to load notes");
        }
    };

    useEffect(() => {
        getNotes();
    }, []);


    const handleAddNote = async () => {
        if (!newNote.trim()) return;
        setNoteSubmitting(true);
        try {
            const payload = {
                user_id: order?.quote?.user_id,
                content: newNote,
                notiable_id: order?.quote?.id,
                notiable_type: "Quote",
            };
            await api.admin.notes.create(payload);
            toast.success("Note added");
            setNewNote("");
            getNotes();
            setPopupState({ open: false, type: null });
        } catch {
            toast.error("Failed to add note");
        } finally {
            setNoteSubmitting(false);
        }
    };
    return (
        <>
            <div className={`mb-6 mt-6 p-6 ${COLOR_CLASSES.borderGray200} border rounded-2xl ${COLOR_CLASSES.bgWhite} shadow-sm`}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Notes</h3>
                    <Button className="p-2 text-sm" icon={<StickyNote />} onClick={() => setPopupState({ open: true, type: "note" })}>
                        Add Note
                    </Button>
                </div>
                {notes.length === 0 ? (
                    <p className="text-gray-500">No notes available.</p>
                ) : (
                    <ul className="space-y-3 max-h-[300px] overflow-auto pr-1">
                        {notes.map(note => (
                            <li key={note.id} className={`border p-3 rounded-md ${COLOR_CLASSES.bgGradient} ${COLOR_CLASSES.borderGray200}`}>
                                <div className={`text-sm ${COLOR_CLASSES.textPrimary} mb-1`}>
                                    By <strong>{user?.name}</strong> on {new Date(note.created_at).toLocaleString()}
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