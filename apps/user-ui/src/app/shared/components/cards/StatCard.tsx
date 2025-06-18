import React from 'react'

const StatCard = ({ title, count, Icon }: any) => {
    return (
        <div className='bg-white p-5 rounded-md shadow-md border-gray-100 flex items-center justify-between'>
            <div>
                <h3 className='text-sm text-gray-500'>{title}</h3>
                <p className='text-2xl font-bold text-gray-800'>{count}</p>
            </div>
            <Icon className="w-10 h-10 text-blue-500" />
        </div>
    )
}

export default StatCard