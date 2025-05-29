'use client'
import useSeller from 'apps/seller-ui/src/hooks/useSeller';
import useSidebar from 'apps/seller-ui/src/hooks/useSidebar'
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react'
import Box from '../box';
import { Sidebar } from './sidebar.styles';
import Link from 'next/link';
import { BellPlus, BellRing, CalendarPlus, Home, LayoutDashboard, ListOrdered, LogOut, Mail, PackageSearch, Settings, SquarePlus, TicketPercent, WalletCards } from 'lucide-react';
import SidebarItem from './sidebar.item';
import SidebarMenu from './sidebar.menu';

const SideBarWrapper = () => {

  const { activeSidebar, setActiveSidebar } = useSidebar();
  const pathName = usePathname();
  const { seller } = useSeller();

  useEffect(() => {
    setActiveSidebar(pathName);
  }, [pathName, setActiveSidebar])

  const getIconColor = (route: string) => activeSidebar === route ? '#0085ff' : '#969696'

  return (
    <Box
      css={{
        height: '100vh',
        zIndex: 202,
        position: 'sticky',
        padding: '8px',
        top: '0',
        overflowY: 'scroll',
        scrollbarWidth: 'none'
      }}
      className='sidebar-wrapper'
    >
      <Sidebar.Header>
        <Box>
          <Link href={'/'} className='flex justify-center text-center gap-2'>
            <LayoutDashboard />
            <Box>
              <h3 className='text-[#ecedee] text-xl font-medium'>
                {seller?.Shop?.name}
              </h3>
              <h5 className='text-xs font-medium text-[#ecedeecf] whitespace-nowrap overflow-hidden text-ellipsis max-w-[170px] pl-2'>
                {seller?.Shop?.address}
              </h5>
            </Box>
          </Link>
        </Box>
      </Sidebar.Header>
      <div className='block my-3 h-full'>
        <Sidebar.Body className='body sidebar'>
          <SidebarItem
            title='Dashboard'
            href='/dashboard'
            icon={<Home fill={getIconColor('/dashboard')} />}
            isActive={activeSidebar === '/dashboard'}
          />
          <div className='mt-2 block'>
            <SidebarMenu
              title='Main Menu'
            >
              <SidebarItem
                isActive={activeSidebar === '/dashboard/orders'}
                title='Orders'
                href='/dashboard/orders'
                icon={<ListOrdered size={26} color={getIconColor("/dashboard/accounts")} />}
              />
              <SidebarItem
                isActive={activeSidebar === '/payments'}
                title='Payments'
                href='/dashboard/payments'
                icon={<WalletCards size={26} color={getIconColor("/dashboard/payments")} />}
              />
            </SidebarMenu>
            <SidebarMenu
              title='Products'
            >
              <SidebarItem
                isActive={activeSidebar === '/dashboard/create-product'}
                title='Create Product'
                href='/dashboard/create-product'
                icon={<SquarePlus size={26} color={getIconColor("/dashboard/create-product")} />}
              />
              <SidebarItem
                isActive={activeSidebar === '/dashboard/all-product'}
                title='All Product'
                href='/dashboard/all-product'
                icon={<PackageSearch size={26} color={getIconColor("/dashboard/all-product")} />}
              />
            </SidebarMenu>
            <SidebarMenu
              title='Events'
            >
              <SidebarItem
                isActive={activeSidebar === '/dashboard/create-event'}
                title='Create Event'
                href='/dashboard/create-event'
                icon={<CalendarPlus size={26} color={getIconColor("/dashboard/create-event")} />}
              />
              <SidebarItem
                isActive={activeSidebar === '/dashboard/all-events'}
                title='All Events'
                href='/dashboard/all-events'
                icon={<BellPlus size={26} color={getIconColor("/dashboard/all-events")} />}
              />
            </SidebarMenu>
            <SidebarMenu
              title='Controllers'
            >
              <SidebarItem
                isActive={activeSidebar === '/dashboard/Inbox'}
                title='Inbox'
                href='/dashboard/Inbox'
                icon={<Mail size={26} color={getIconColor("/dashboard/Inbox")} />}
              />
              <SidebarItem
                isActive={activeSidebar === '/dashboard/settings'}
                title='Settings'
                href='/dashboard/settings'
                icon={<Settings size={26} color={getIconColor("/dashboard/settings")} />}
              />
              <SidebarItem
                isActive={activeSidebar === '/dashboard/Notifications'}
                title='Notifications'
                href='/dashboard/notifications'
                icon={<BellRing size={26} color={getIconColor("/dashboard/notifications")} />}
              />
            </SidebarMenu>
            <SidebarMenu
              title='Extras'
            >
              <SidebarItem
                isActive={activeSidebar === '/dashboard/discount-codes'}
                title='Discount Codes'
                href='/dashboard/discount-codes'
                icon={<TicketPercent size={26} color={getIconColor("/dashboard/discount-codes")} />}
              />
              <SidebarItem
                isActive={activeSidebar === '/logout'}
                title='Logout'
                href='/logout'
                icon={<LogOut size={26} color={getIconColor("/logout")} />}
              />
            </SidebarMenu>
          </div>
        </Sidebar.Body>
      </div>
    </Box>
  )
}

export default SideBarWrapper