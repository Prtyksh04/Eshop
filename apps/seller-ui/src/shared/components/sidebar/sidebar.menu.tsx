import React from 'react'

interface Props {
    title: string,
    children: React.ReactNode
}

const SidebarMenu = ({ title, children }: Props) => {
    return (
        <div className='block'>
            <h3 className='text-xs font-semibold uppercase tracking-wider text-slate-400 pl-1 my-2'>
                {title}
            </h3>
            {children}
        </div>
    )
}

export default SidebarMenu