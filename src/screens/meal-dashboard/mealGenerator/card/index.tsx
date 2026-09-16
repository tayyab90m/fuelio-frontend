import React, { FC } from "react";
import { QuestionairsDataProps } from "../../../../interfaces/meal/types";
import SelectionSection from "../../../../components/selection-section";

const PlanGeneratorCard: FC<QuestionairsDataProps> = ({ questions, category, selectedItems, activitiesData, goals }) => {
    return (
        <div className="p-10">
            <p className="text-3xl mb-1">Please fill out the following information carefully</p>
            <p className="text-2xl mb-5 font-bold text-primary">{category}</p>
            {questions?.map((item) => (
                <SelectionSection
                    key={item.id}
                    defaultValues={selectedItems?.find((selectedItem) => selectedItem.questionId == item.id)}
                    activityLevels={activitiesData}
                    goals={goals}
                    {...item}
                />
            ))}
        </div>
    )
};
export default PlanGeneratorCard;