import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  onGetAllCuisines, 
  onCreateCuisine, 
  onUpdateCuisine, 
  onDeleteCuisine, 
  onToggleCuisineState 
} from '../../../redux/cuisine/action';
import { RootState } from '../../../redux/store';
import { Cuisine } from '../../../apiServices/endpoints/cuisine/types';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../../components/ui/table';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '../../../components/ui/dialog';
import { Badge } from '../../../components/ui/badge';
import { Card } from '../../../components/ui/card';
import { 
  Plus, 
  Search, 
  Filter,
  Clock,
  Utensils,
  Users,
  Edit,
  Trash
} from 'lucide-react';
import { Formik, Form, Field } from 'formik';
import { Switch } from "../../../components/ui/switch";

export function CuisineConfig() {
  const dispatch = useDispatch();
  const cuisines = useSelector((state: RootState) => state.cuisine.cuisines);
  const [showForm, setShowForm] = useState(false);
  const [editingCuisine, setEditingCuisine] = useState<Cuisine | null>(null);
  const [cuisineName, setCuisineName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    onGetAllCuisines();
  }, []);

  const handleSubmit = async (values: { name: string; state: string }) => {
    if (!values.name.trim()) {
      return; // Don't submit if name is empty
    }
    
    if (editingCuisine) {
      await onUpdateCuisine(editingCuisine.id, values.name, values.state);
    } else {
      await onCreateCuisine(values.name, values.state);
    }
    setShowForm(false);
    setEditingCuisine(null);
  };

  const filteredCuisines = cuisines.filter(cuisine => 
    cuisine.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleState = (id: string, currentState: string) => {
    onToggleCuisineState(id, currentState);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Cuisines</h1>
        <Button size="sm" className="bg-primary gap-2 font-bold text-sm text-white hover:bg-primary/80" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Cuisine
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search cuisines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>
      </div>

      <Card className="bg-white shadow-none overflow-y-auto border-none rounded-lg">
        <Table className="min-w-full divide-y divide-gray-200 ">
          <TableHeader className="bg-secondary">
            <TableRow>
              <TableHead className="font-bold py-4 px-4 text-white">Name</TableHead>
              <TableHead className="font-bold py-4 px-4 text-center text-white">Status</TableHead>
              <TableHead className="font-bold py-4 px-4 text-center text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCuisines.map((cuisine) => (
              <TableRow key={cuisine.id}>
                <TableCell className="px-4 py-4 text-sm font-semibold text-secondary capitalize">{cuisine.name}</TableCell>
                <TableCell className="text-center">
                  <div className="flex flex-col items-center justify-center space-x-2">
                    <Switch
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors 
                        ${cuisine.state === 'published' ? 'bg-gray' : 'bg-primary'}`}
                      checked={cuisine.state === 'published'}
                      onCheckedChange={() => handleToggleState(cuisine.id, cuisine.state || 'unpublished')}
                    >
                      {/* The toggle circle */}
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                          ${cuisine.state === 'published' ? 'translate-x-6 bg-primary' : 'translate-x-1 bg-gray'}`}
                      />
                    </Switch>
                    <span className="text-sm text-gray-500">
                      {cuisine.state === 'published' ? 'Published' : 'Unpublished'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      className="bg-secondary font-bold text-sm text-white hover:bg-primary/80"
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setEditingCuisine(cuisine);
                        setCuisineName(cuisine.name);
                        setShowForm(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button 
                      className="bg-primary font-bold text-sm text-white hover:bg-primary/80"
                      variant="ghost" 
                      size="sm"
                      onClick={() => onDeleteCuisine(cuisine.id)}
                    >
                      <Trash className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-[500px] bg-white p-6">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="text-xl font-semibold text-gray-800">
              {editingCuisine ? 'Edit Cuisine' : 'Add New Cuisine'}
            </DialogTitle>
          </DialogHeader>
          
          <Formik
            initialValues={{
              name: editingCuisine?.name || '',
              state: editingCuisine?.state || 'unpublished'
            }}
            validate={(values) => {
              const errors: { name?: string } = {};
              if (!values.name.trim()) {
                errors.name = 'Cuisine name is required';
              }
              return errors;
            }}
            onSubmit={handleSubmit}
          >
            {({ values, handleChange, errors, touched }) => (
              <Form className="space-y-6 pt-4">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-700 border-l-2 border-blue-500 pl-2">
                    Basic Information
                  </h3>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Cuisine Name</label>
                    <Input
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      placeholder="Enter cuisine name"
                      className="h-10 w-full rounded-md border border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                    />
                    {errors.name && touched.name && (
                      <div className="text-sm text-red-500 mt-1">{errors.name}</div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <Field
                      as="select"
                      name="state"
                      value={values.state}  // Ensure it's synced with Formik's state
                      className="h-10 w-full rounded-md border border-gray-200 focus:border-blue-300 focus:ring-blue-200 bg-white"
                    >
                      <option value="unpublished">Unpublished</option>
                      <option value="published">Published</option>
                    </Field>
                  </div>
                </div>

                <DialogFooter className="pt-6 border-t gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setShowForm(false);
                      setEditingCuisine(null);
                    }}
                    className="border-gray-200 hover:bg-gray-50 text-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-primary text-white hover:bg-primary/90"
                  >
                    {editingCuisine ? 'Update' : 'Create'} Cuisine
                  </Button>
                </DialogFooter>
              </Form>
            )}
          </Formik>

        </DialogContent>
      </Dialog>
    </div>
  );
}
