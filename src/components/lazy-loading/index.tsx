import { FC, Suspense } from 'react'
import { LazyLoadingProps } from './types'

const LazyLoading: FC<LazyLoadingProps> = ({ children }) => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            {children}
        </Suspense>
    )
}

export default LazyLoading;