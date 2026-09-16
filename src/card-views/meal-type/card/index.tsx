import { FC, memo, useCallback } from 'react';
import { MealTypesProps } from '../../../interfaces/meal/types';
import { onDeleteMealType, onUpdateMealTypeState } from '../../../redux/meals/action';
import { useDispatch } from 'react-redux';
import { setSelectedMealType } from '../../../redux/meals/reducer';
import { TableRow, TableCell } from '../../../components/ui/table';
import moment from 'moment';
import { Badge } from '../../../components/ui/badge';
import { useNavigate } from 'react-router';
import { Button } from '../../../components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { Switch } from '../../../components/ui/switch';

interface ExtendedMealTypeProps extends MealTypesProps {
  setIsEdit: (value: boolean) => void;
}

const MealTypeCard: FC<ExtendedMealTypeProps> = ({
  id,
  name,
  code,
  description,
  state,
  proteinPercentage,
  carbsPercentage,
  fatsPercentage,
  minimumProtein,
  startTime,
  endTime,
  setIsEdit,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onDelete = useCallback(() => {
    onDeleteMealType({ id });
  }, [id]);

  const onEdit = () => {
    const data = {
      id: id || '',
      name: name || '',
      code: code || '',
      description: description || '',
      state: state || '',
      proteinPercentage: proteinPercentage || 0,
      carbsPercentage: carbsPercentage || 0,
      fatsPercentage: fatsPercentage || 0,
      minimumProtein: minimumProtein || 0,
      startTime: startTime || '',
      endTime: endTime || '',
    };
    setIsEdit(true);
    dispatch(setSelectedMealType(data));
    navigate(`edit-type/${id}`);
  };

  const handleStateToggle = useCallback(() => {
    const newState = state === 'published' ? 'unpublished' : 'published';
    onUpdateMealTypeState(id, newState);
  }, [id, state]);

  return (
    <TableRow className="hover:bg-gray-100 transition-all">
      <TableCell className="px-4 py-3 text-sm font-semibold text-secondary capitalize">
        {name}
      </TableCell>
      
      <TableCell className="px-4 py-3 text-sm text-gray-700">
        <div className="flex items-center justify-center gap-3">
          {[
            { label: 'Carbs', value: carbsPercentage, color: 'bg-blue-50 text-blue-700 border-blue-200' },
            { label: 'Protein', value: proteinPercentage, color: 'bg-green-50 text-green-700 border-green-200' },
            { label: 'Fats', value: fatsPercentage, color: 'bg-orange-50 text-orange-700 border-orange-200' }
          ].map(({ label, value, color }) => (
            <Badge
              key={label}
              className={`min-w-[60px] py-1 font-medium border ${color}`}
            >
              {label[0]}: {value || '--'}%
            </Badge>
          ))}
        </div>
      </TableCell>
      
      <TableCell className="px-4 py-3 text-sm text-gray-700 text-center">
        {minimumProtein || 0}
      </TableCell>
      
      <TableCell className="px-4 py-3 text-sm text-gray-700 text-center">
        {startTime} - {endTime}
      </TableCell>
      
      <TableCell className="px-4 py-3 text-center">
        <div className="flex flex-col items-center gap-1">
          <Switch
            checked={state === 'published'}
            onCheckedChange={handleStateToggle}
            className={`h-6 w-11 rounded-full transition-colors ${state === 'published' ? 'bg-secondary' : 'bg-primary'}`}
          />
          <span className="text-sm capitalize font-medium text-gray-600">{state || 'Unpublished'}</span>
        </div>
      </TableCell>
      
      <TableCell className="px-4 py-3 text-center">
        <div className="flex gap-2 justify-center">
          <Button
            size="sm"
            variant="ghost"
            onClick={onEdit}
            className="font-bold bg-secondary text-sm text-white hover:bg-secondary/80"
          >
            <Edit className="w-4 h-4" /> Edit
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onDelete}
            className="font-bold bg-primary text-sm text-white hover:bg-primary/80"
          >
            <Trash className="w-4 h-4" /> Delete
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default memo(MealTypeCard);
