import React from 'react'

const SectionTitle = ({ title }: { title: string }) => {
    return (
        <div className='relative'>
            <h1 className='md:text-3xl text-xl relative z-10 font-semibold'>
                {title}
            </h1>
        </div>
    )
}

export default SectionTitle;