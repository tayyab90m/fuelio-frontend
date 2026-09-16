import { TableHead, TableHeader, TableRow } from '../../../components/ui/table';

import { FC } from 'react'

const MealTypesHeader: FC = () => {
	return (
		<TableHeader>
			<TableRow className="bg-secondary">
				<TableHead className="font-bold py-4 px-4 text-white">Name</TableHead>
				<TableHead className="font-bold py-4 px-4 text-center text-white">Macro Split</TableHead>
				<TableHead className="font-bold py-4 px-4 text-center text-white">Min. Protein</TableHead>
				<TableHead className="font-bold py-4 px-4 text-center text-white">Time Window</TableHead>
				<TableHead className="font-bold py-4 px-4 text-center text-white">Status</TableHead>
				<TableHead className="font-bold py-4 px-4 text-center text-white">Actions</TableHead>
			</TableRow>
		</TableHeader>
	)
}

export default MealTypesHeader;