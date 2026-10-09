import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Pencil, Trash } from 'lucide-react';
import {
  deleteSavedPlanApi,
  getSavedPlanApi,
  listSavedPlansApi,
  renameSavedPlanApi,
} from '../../../apiServices/endpoints/dietPlans';
import { SavedPlan, SavedPlanSummary } from '../../../apiServices/endpoints/dietPlans/types';
import { toDietPlanData } from '../../../apiServices/endpoints/question';
import { DietPlanView } from '../mealGenerator/result';
import { Button } from '../../../components/ui/button';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

// Asks for a new name; returns null if cancelled or unchanged/blank.
const askForName = (current: string): string | null => {
  const next = window.prompt('Rename plan', current)?.trim();
  return next && next !== current ? next.slice(0, 100) : null;
};

export const MyPlans = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<SavedPlanSummary[] | null>(null);

  const load = useCallback(async () => {
    try {
      setPlans(await listSavedPlansApi());
    } catch {
      setPlans([]);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleRename = async (plan: SavedPlanSummary) => {
    const name = askForName(plan.name);
    if (!name) return;
    try {
      await renameSavedPlanApi(plan.id, name);
      toast.success('Plan renamed');
      await load();
    } catch {
      // Error toast shown by the request layer.
    }
  };

  const handleDelete = async (plan: SavedPlanSummary) => {
    if (!window.confirm(`Delete "${plan.name}"? This can't be undone.`)) return;
    try {
      await deleteSavedPlanApi(plan.id);
      toast.success('Plan deleted');
      await load();
    } catch {
      // Error toast shown by the request layer.
    }
  };

  return (
    <div className="mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Plans</h2>
        <Button
          size="sm"
          className="bg-primary font-bold text-sm text-white hover:bg-primary/80"
          onClick={() => navigate('/dashboard/meal-generator')}
        >
          New plan
        </Button>
      </div>

      {plans === null ? (
        <p className="mt-6 text-gray-500">Loading...</p>
      ) : plans.length === 0 ? (
        <div className="mt-6 rounded-xl bg-white p-8 text-center">
          <p className="text-gray-500 mb-4">You haven&apos;t saved any plans yet. Generate one and press &ldquo;Save plan&rdquo;.</p>
          <Link
            to="/dashboard/meal-generator"
            className="inline-block bg-primary text-white font-bold px-4 py-2 rounded-lg hover:opacity-90"
          >
            Go to Meal Plan Generator
          </Link>
        </div>
      ) : (
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {plans.map((plan) => (
            <li key={plan.id} className="rounded-xl bg-white p-5 shadow-sm border">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    to={`/dashboard/my-plans/${plan.id}`}
                    className="block truncate text-lg font-semibold text-gray-900 hover:text-primary"
                  >
                    {plan.name}
                  </Link>
                  <p className="text-sm text-gray-500">Saved {formatDate(plan.createdAt)}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    aria-label={`Rename ${plan.name}`}
                    onClick={() => handleRename(plan)}
                    className="rounded p-2 text-gray-500 hover:bg-gray-100"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete ${plan.name}`}
                    onClick={() => handleDelete(plan)}
                    className="rounded p-2 text-primary hover:bg-rose-50"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {plan.macros && (
                <dl className="mt-4 grid grid-cols-4 gap-2 text-center text-sm">
                  <div className="rounded-lg bg-gray-50 p-2">
                    <dt className="text-gray-500">Calories</dt>
                    <dd className="font-bold">{plan.macros.calories}</dd>
                  </div>
                  <div className="rounded-lg bg-blue-50 p-2">
                    <dt className="text-blue-600">Protein</dt>
                    <dd className="font-bold">{plan.macros.protein}g</dd>
                  </div>
                  <div className="rounded-lg bg-green-50 p-2">
                    <dt className="text-green-600">Carbs</dt>
                    <dd className="font-bold">{plan.macros.carbs}g</dd>
                  </div>
                  <div className="rounded-lg bg-yellow-50 p-2">
                    <dt className="text-yellow-600">Fat</dt>
                    <dd className="font-bold">{plan.macros.fat}g</dd>
                  </div>
                </dl>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const MyPlanDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<SavedPlan | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    getSavedPlanApi(id)
      .then((loaded) => !cancelled && setPlan(loaded))
      .catch(() => !cancelled && setNotFound(true));
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (notFound) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-md text-center">
        <h2 className="text-2xl font-bold mb-2">Plan not found</h2>
        <p className="text-gray-500 mb-4">It may have been deleted.</p>
        <Link to="/dashboard/my-plans" className="font-semibold text-primary hover:underline">
          Back to My Plans
        </Link>
      </div>
    );
  }
  if (!plan) return <p className="text-gray-500">Loading...</p>;

  const handleRename = async () => {
    const name = askForName(plan.name);
    if (!name) return;
    try {
      setPlan(await renameSavedPlanApi(plan.id, name));
      toast.success('Plan renamed');
    } catch {
      // Error toast shown by the request layer.
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${plan.name}"? This can't be undone.`)) return;
    try {
      await deleteSavedPlanApi(plan.id);
      toast.success('Plan deleted');
      navigate('/dashboard/my-plans');
    } catch {
      // Error toast shown by the request layer.
    }
  };

  return (
    <div>
      <Link to="/dashboard/my-plans" className="mb-3 inline-block text-sm font-semibold text-primary hover:underline">
        &larr; My Plans
      </Link>
      <DietPlanView
        data={toDietPlanData(plan.result)}
        title={plan.name}
        actions={
          <>
            <button type="button" onClick={handleRename} className="flex h-10 items-center gap-2 rounded-lg border px-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">
              <Pencil className="h-4 w-4" /> Rename
            </button>
            <button type="button" onClick={handleDelete} className="flex h-10 items-center gap-2 rounded-lg bg-primary px-3 text-sm font-semibold text-white hover:opacity-90">
              <Trash className="h-4 w-4" /> Delete
            </button>
          </>
        }
      />
    </div>
  );
};
