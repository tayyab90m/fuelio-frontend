import { FC, useState } from 'react'
import MealTypesHeader from './header'
import { MealTypesListingProps } from './types'
import MealTypeCard from './card'
import EditMealType from '../../components/meals/EditMealType'
import { Table, TableBody } from '../../components/ui/table'
import { Card } from '../../components/ui/card'


const MealTypeListing: FC<MealTypesListingProps> = ({ data }) => {
	const [isEditShow, setIsEditShow] = useState<Boolean>(false)
	return (
		<Card className="bg-white shadow-none border-none rounded-lg">
			<Table className="min-w-full divide-y divide-gray-200">
				<MealTypesHeader />
				<TableBody className="divide-y divide-gray-200">
					{data?.map((item) => <MealTypeCard setIsEdit={setIsEditShow} key={item.id} {...item} />)}
				</TableBody>
			</Table>
		</Card>
	)
}

export default MealTypeListing;