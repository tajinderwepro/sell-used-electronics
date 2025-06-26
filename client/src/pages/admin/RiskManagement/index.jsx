import { useEffect, useState } from "react";
import CommonTable from "../../../common/CommonTable";
import api from "../../../constants/api";
import { useFilters } from "../../../context/FilterContext";
import { Chip } from "../../../components/ui/Chip";
import RiskScoreBadge from "../../../common/RiskScoreBadge";
import { Pencil } from "lucide-react";
import InputField from '../../../components/ui/InputField';
import Button from "../../../components/ui/Button";
import { useColorClasses } from "../../../theme/useColorClasses";
import { FONT_SIZES, FONT_WEIGHTS } from "../../../constants/theme";

export default function RiskManagement() {
    const [riskItems, setRiskItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalItems, setTotalItems] = useState(0);
    const [editingRowId, setEditingRowId] = useState(null);
    const COLOR_CLASSES = useColorClasses();

    const { filters } = useFilters();

    const fetchList = async () => {
        try {
            setLoading(true);
            const response = await api.admin.riskManagement.getList(filters);
            setTotalItems(response.total || response.data.length);
            setRiskItems(response.data);
        } catch (err) {
            console.error("Failed to fetch risk items:", err);
        } finally {
            setLoading(false);
        }
    };

    const updateScore = async (id, newScore) => {
        try {
            await api.admin.riskManagement.updateRiskScore(id, {score:newScore});
            await fetchList();
        } catch (err) {
            console.error("Failed to update score:", err);
        }
    };

    const EditableScoreCell = ({ row }) => {
        const isEditing = editingRowId === row.id;
        const [newScore, setNewScore] = useState(row.score);
        const [submitting, setSubmitting] = useState(false);

        const handleSave = async () => {
            setSubmitting(true);
            await updateScore(row.id, newScore);
            setEditingRowId(null);
            setSubmitting(false);
        };

        const handleCancel = () => {
            setNewScore(row.score);
            setEditingRowId(null);
        };

        return (
            <div className="flex items-center gap-2">
                {!isEditing ? (
                    <>
                        <RiskScoreBadge score={row.score} />
                        <button
                            onClick={() => setEditingRowId(row.id)}
                            className="text-gray-500 hover:text-primary"
                        >
                            <Pencil size={16} />
                        </button>
                    </>
                ) : (
                    <div className="flex items-center gap-2">
                        <InputField
                            type="number"
                            value={newScore}
                            onChange={(e) => setNewScore(e.target.value === '' ? '' : Number(e.target.value))}
                            className={`w-16 border rounded-xl py-[2px] px-2 text-center ${COLOR_CLASSES.bgWhite}`}
                            overRideStyle={true}
                        />
                        <Button
                            onClick={handleSave}
                            disabled={submitting}
                            className={`text-green-600 bg-green-500/20 border border-green-600 rounded-xl py-1 px-2 cursor-pointer ${FONT_SIZES['xs']} ${FONT_WEIGHTS['semibold']}`}
                            variant="custom"
                        >
                            Save
                        </Button>
                        <Button
                            onClick={handleCancel}
                            disabled={submitting}
                            className={`text-red-600 border bg-red-500/20 border-red-500 rounded-xl py-1 px-2 cursor-pointer ${FONT_SIZES['xs']} ${FONT_WEIGHTS['semibold']}`}
                            variant="custom"
                        >
                            Cancel
                        </Button>
                    </div>
                )}
            </div>
        );
    };

    const columns = [
        { key: "id", label: "ID", sortable: true },
        {
            key: "key",
            label: "Risk Type",
            render: (row) => row.key
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" "),
        },
        {
            key: "value",
            label: "Values",
            render: (row) => {
                try {
                    const values = JSON.parse(row.value);
                    return (
                        <div className="flex flex-wrap gap-2">
                            {values.map((v, i) => (
                                <Chip key={i} status="highRisk">{v}</Chip>
                            ))}
                        </div>
                    );
                } catch {
                    return row.value;
                }
            },
        },
        {
            key: "score",
            label: "Score",
            render: (row) => (
                <EditableScoreCell
                    row={row}
                    editingRowId={editingRowId}
                    setEditingRowId={setEditingRowId}
                />
            ),
        },
    ];

    useEffect(() => {
        fetchList();
    }, []);

    return (
        <div className="min-h-screen mt-2">
            <CommonTable
                columns={columns}
                data={riskItems}
                loading={loading}
                pageSize={10}
                title="Risk Management"
                totalItems={totalItems}
                onFetch={fetchList}
                isCreate={false}
            />
        </div>
    );
}
