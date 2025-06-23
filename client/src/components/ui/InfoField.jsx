import { useColorClasses } from "../../theme/useColorClasses";

const InfoField = ({ Icon, label, value }) => {
    const COLOR_CLASSES = useColorClasses();
    return (
        <div className="overflow-hidden">
            <div className="flex items-start gap-2 w-auto h-[45px]">
            {Icon && (
                <Icon className="w-4 h-4 mt-[3.5px] text-blue-500 shrink-0 flex-none" />
            )}
            <div className={`${COLOR_CLASSES.textPrimary} w-full break-words break-all text-sm`}>
                <span className="font-[700] leading-none break-normal">{label}</span>
                <br />
                <span className="font-normal break-words break-all block max-h-[40px] overflow-y-auto"
                 style={{
                    scrollbarWidth: 'none',  
                    msOverflowStyle: 'none',  
                }}>
                    {value}
                </span>
            </div>
        </div>
        </div>
        
    );
};


export default InfoField;
