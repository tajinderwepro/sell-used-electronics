import { useColorClasses } from "../../theme/useColorClasses";

const InfoField = ({ Icon, label, value }) => {
    const COLOR_CLASSES = useColorClasses();
    return (
        <div className={`flex items-start gap-2`}>
            {Icon && <Icon size="80%" className="w-5 h-5 mt-0.5 text-blue-500" />}
            <p className={`${COLOR_CLASSES.textPrimary}`}>
                <span className="font-[700] leading-none">{label}</span><br /><span className={`font-normal`}>{value}</span>
            </p>
        </div>
    );
};


export default InfoField;
