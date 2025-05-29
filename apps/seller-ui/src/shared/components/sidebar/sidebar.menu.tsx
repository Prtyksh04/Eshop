import React from 'react'

interface Props {
    title: string,
    children: React.ReactNode
}

const SidebarMenu = ({ title, children }: Props) => {
    return (
        <div className='block'>
            <h3 className='text-sm tracking-[0.04rem] pl-1'>
                {title}
            </h3>
            {children}
        </div>
    )
}

export default SidebarMenu