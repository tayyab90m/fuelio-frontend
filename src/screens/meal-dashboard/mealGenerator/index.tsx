import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../../redux/store';
import { Progress } from '../../../components/ui/progress';
import { Button } from '../../../components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { onMount, onSubmitQuestionair } from '../../../redux/questionaire/action';
import PlanGeneratorCard from './card';
import { onGetAllActivityLevels } from '../../../redux/activity/action';
import { onGetAllGoals } from '../../../redux/goals/action';

const QuestionsList: React.FC = () => {
  const navigate = useNavigate();
  // Access questions and error state from Redux using useSelector
  const { questions, answers } = useSelector((state: RootState) => state.questionReducer);
  const { activityLevels } = useSelector((state: RootState) => state.activityLevels);
  const { goals } = useSelector((state: RootState) => state.goalsReducer);
  const [currentStep, setCurrentStep] = useState(0);
  const data = questions[currentStep];
  const totalSteps = questions.length;
  const showSubmit = currentStep == (totalSteps - 1);

  useEffect(() => {
    onMount();
    onGetAllActivityLevels();
    onGetAllGoals();
  }, []);


  const handleNext = () => {
    if (showSubmit) {
      onSubmitQuestionair(navigate)
    } else {
      setCurrentStep((prevState) => prevState += 1);
    }
    window.scrollTo(0, 0);
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prevState) => prevState -= 1);
      window.scrollTo(0, 0);
    }
  };

  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-white rounded shadow">
      <div className="mx-auto space-y-5">
        <div className="flex px-6 pt-6 items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Fitness Questionnaire</h1>
            <p className="text-muted-foreground">
              Help us create your perfect fitness plan
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 bg-white rounded-lg p-4 max-w-3xl mx-auto">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Step {currentStep + 1} of {totalSteps}</span>
            <span>{Math.round(progress)}% completed</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div>
          {/* Map through the questions, but only render the current step */}
          <PlanGeneratorCard {...data} goals={goals} activitiesData={activityLevels} selectedItems={answers} />
          {/* Next and Previous buttons */}
          <div className="flex justify-between px-6 pb-6 m-0">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="font-bold"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {/* Show submit button only on the last step */}

            <Button
              className="bg-primary font-bold text-white hover:bg-primary/80"
              variant="destructive"
              onClick={handleNext}
            // disabled={isSubmitting}
            >
              {showSubmit ? 'Submit' : "Next"}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionsList;

