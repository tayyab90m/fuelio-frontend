import React, { FC } from "react";
import {  CircleStop, CheckCircle} from "lucide-react";
import { RadioButtonProps } from "./types";
const RadioButton: FC<RadioButtonProps> = ({ title, isSelected, onPress }) => {
    return (
        <div className="flex cursor-pointer mb-3 gap-3 ml-5" onClick={onPress}>
            {isSelected ? <CheckCircle className="text-primary" /> : <CircleStop />}
            <p>{title}</p>
        </div>
    )
};
export default RadioButton;