import React, { FC } from 'react'
import { Star } from 'lucide-react'

type Props = {
    rating: number;
}

const Ratings: FC<Props> = ({ rating }) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars.push(<Star fill='yellow' />)
        } else {
            <Star />
        }
    }

    return (
        <div className='flex gap-1'>
            {stars}
        </div>
    )
}

export default Ratings