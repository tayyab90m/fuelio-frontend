import { FC, useEffect, useState } from 'react'
import { Plus, Search, X } from 'lucide-react'
import { useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router'
import MealTypeListing from '../../../../card-views/meal-type'
import { onMountAllMealTypes } from '../../../../redux/meals/action'
import { RootState } from '../../../../redux/store'
import { MealTypesProps } from '../../../../interfaces/meal/types'
import { Input } from '../../../../components/ui/input'
import Button  from '../../../../components/ui/buttons'

import debounce from 'lodash/debounce'

const MealTypes: FC = () => {
  const location = useLocation();
  const [searchValue, setSearchValue] = useState('')
  const { allGeneralTypes } = useSelector((state: RootState) => state.mealsReducer);
  const [filterData, setFilterData] = useState<MealTypesProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await onMountAllMealTypes();
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [location.pathname]);

  useEffect(() => {
    setFilterData(allGeneralTypes);
  }, [allGeneralTypes]);

  // Debounced search function
  const debouncedSearch = debounce((searchTerm: string) => {
    if (!searchTerm.trim()) {
      setFilterData(allGeneralTypes);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const filtered = allGeneralTypes.filter((element) => {
      return (
        element.name?.toLowerCase().includes(searchTermLower) ||
        element.description?.toLowerCase().includes(searchTermLower) ||
        element.code?.toLowerCase().includes(searchTermLower)
      );
    });
    setFilterData(filtered);
  }, 300);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };
  const clearSearch = () => {
    setSearchValue('');
    setFilterData(allGeneralTypes);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4" />
          <p className="text-lg font-medium">Loading meal types...</p>
        </div>
      );
    }

    if (!allGeneralTypes.length) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <Plus className="w-12 h-12 mb-4 text-gray-400" />
          <p className="text-lg font-medium">No meal types available</p>
          <p className="text-sm mb-4">Get started by adding your first meal type</p>
          <Link to="new-type">
            <Button size="sm" className="bg-secondary hover:bg-secondary/80 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Meal Type
            </Button>
          </Link>
        </div>
      );
    }

    if (searchValue && filterData.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <Search className="w-12 h-10 mb-4 text-gray-400" />
          <p className="text-lg font-medium">No results found</p>
          <p className="text-sm">No meal types match your search "{searchValue}"</p>
          <Button 
            onClick={clearSearch} 
            variant="outline" 
            className="mt-4 text-gray-600 hover:text-gray-800"
          >
            Clear Search
          </Button>
        </div>
      );
    }
    return <MealTypeListing data={filterData} />;
  };

  return (
    <div className="mx-auto">
      <div className=''>
        <div className='flex mb-4 justify-between items-center'>
          <h2 className='text-3xl font-bold text-secondary'>
            Meal Types
          </h2>
          <div className='flex gap-3 items-center'>
            {allGeneralTypes.length > 0 && (
              <div className="relative w-[300px]">
                <Input
                  type="text"
                  value={searchValue}
                  onChange={handleSearch}
                  placeholder="Search meal types..."
                  className="h-10 pr-10 border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                />
                {searchValue && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
            <Link to="new-type">
              <Button size="sm" className="bg-secondary hover:bg-secondary/80 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Meal Type
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl bg-white">
        {renderContent()}
      </div>
    </div>
  )
}

export default MealTypes