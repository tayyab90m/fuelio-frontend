import { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { SelectionSectionProps } from './types';
import { updateAnswers } from '../../redux/questionaire/reducer';
import RadioButton from '../radio';
import { SelectedQuestionairsProps } from '../../interfaces/meal/types';

const SelectionSection: FC<SelectionSectionProps> = ({ id, options, text, questionType, defaultValues, activityLevels, goals, onPress }) => {
    const dispatch = useDispatch();
    const [number, setNumber] = useState<number>(null);
    const [selectedItems, setSelectedItems] = useState<SelectedQuestionairsProps | undefined>(undefined);

    useEffect(() => {
        if (defaultValues) {
            setSelectedItems(defaultValues);
        }
    }, [defaultValues]);

    useEffect(() => {
        if (number) {
            const timeoutId = setTimeout(() => {
                onHandlePress(number.toString());
            });
            return () => clearTimeout(timeoutId);
        }
    }, [number]);

    const onHandlePress = (item: string) => {
        setSelectedItems((prevState) => {
            if ((questionType == 'goal' && prevState?.goalId) || (questionType == 'activity_level' && prevState?.activityLevelId)) {
                return undefined;
            }
            if (prevState?.answer?.some((prevItem) => prevItem == item)) {
                return {
                    ...prevState,
                    answer: prevState.answer.filter((prevItem) => prevItem !== item),
                    activityLevelId: '',
                    goalId: ''
                };
            }
            if (questionType == 'goal') {
                return {
                    ...prevState,
                    questionId: id,
                    goalId: item,
                    answer: []
                };
            }
            if (questionType == 'activity_level') {
                return {
                    ...prevState,
                    questionId: id,
                    activityLevelId: item,
                    answer: []
                };
            }
            if (questionType == 'multiple_choice') {
                if (prevState?.answer) {
                    return {
                        ...prevState,
                        questionId: id,
                        answer: [
                            ...prevState?.answer,
                            item
                        ]
                    };
                }
                return {
                    ...prevState,
                    questionId: id,
                    answer: [
                        item
                    ]
                };
            }
            return {
                ...prevState,
                questionId: id,
                answer: [item]
            };
        });
        dispatch(updateAnswers({
            questionId: id,
            answer: item,
            questionType,
            goalId: item,
            activityLevelId: item
        }));
        if (onPress && selectedItems) {
            onPress(selectedItems);
        }
    };

    return (
        <>
            <p className="mb-3 font-bold cursor-pointer">{text}</p>

            {questionType === "activity_level" ? (
                activityLevels.map((item) => (
                    <RadioButton
                        key={item.id}
                        isSelected={selectedItems?.activityLevelId == item.id}
                        title={item.name}
                        onPress={() => onHandlePress(item.id)}
                    />
                ))
            ) : questionType === "goal" ? (
                goals.map((item) => (
                    <RadioButton
                        key={item.id}
                        isSelected={selectedItems?.goalId == item.id}
                        title={item.name}
                        onPress={() => onHandlePress(item.id)}
                    />
                ))
            ) : questionType === "number" ? (
                <div className="flex flex-col mb-3">
                    <div className="flex items-center gap-2">
                        <input
                            className="border p-2 "
                            value={selectedItems?.answer[0] || number}
                            placeholder="Enter the value"
                            type="number"
                            onChange={(e) => {
                                const value = Number(e.target.value);
                                setNumber(value);
                            }}
                        />
                        <span className="text-gray-500 text-sm">
                            {text.includes("height") ? "cm" : text.includes("weight") ? "kg" : ""}
                        </span>
                    </div>

                    {/* ✅ Error Messages */}
                    {text.includes("age") && (number < 18 || number > 100) && (
                        <p className="text-red-500 text-sm mt-1">
                            Age must be between 18 and 100.
                        </p>
                    )}
                    {text.includes("weight") && (number < 30 || number > 300) && (
                        <p className="text-red-500 text-sm mt-1">
                            Weight must be between 30kg and 300kg.
                        </p>
                    )}
                    {text.includes("height") && (number < 100 || number > 250) && (
                        <p className="text-red-500 text-sm mt-1">
                            Height must be between 100cm and 250cm.
                        </p>
                    )}
                </div>
            ) : questionType === "multiple_choice" ? (
                <>
                    <p className="mb-3 text-sm text-gray-500">Multiple choice question</p>
                    {options.map((item) => (
                        <RadioButton
                            key={item}
                            isSelected={selectedItems?.answer?.some((selectedItem) => selectedItem === item)}
                            title={item}
                            onPress={() => onHandlePress(item)}
                        />
                    ))}
                </>
            ) : (
                options.map((item) => (
                    <RadioButton
                        key={item}
                        isSelected={selectedItems?.answer?.some((selectedItem) => selectedItem == item)}
                        title={item}
                        onPress={() => onHandlePress(item)}
                    />
                ))
            )}
        </>

    );
};
export default SelectionSection;