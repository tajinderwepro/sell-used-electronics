import { useEffect, useState } from "react";
import CommonTable from "../../../common/CommonTable";
import api from "../../../constants/api";
import { useFilters } from "../../../context/FilterContext";
import { Chip } from "../../../components/ui/Chip";
import RiskScoreBadge from "../../../common/RiskScoreBadge";

export default function RiskManagement() {
    const [riskItems, setRiskItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalItems, setTotalItems] = useState(0);
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

    const columns = [
        { key: "id", label: "ID", sortable: true },
        {
            key: "key",
            label: "Risk Type",
            render: (row) => {
                return row.key
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ");
            },
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
                                <Chip key={i} status="highRisk">
                                    {v}
                                </Chip>
                            ))}
                        </div>
                    );
                } catch {
                    return row.value;
                }
            }

        },
        {
            key: "score",
            label: "Score",
            render: (row) => {
                try {
                    return (
                        <div className="flex flex-wrap gap-2">
                            <RiskScoreBadge score={row.score} />
                        </div>
                    );
                } catch {
                    return row.value;
                }
            }

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
