'use client'

import { useAtom } from "jotai"
import { activeSideBarItem } from '../configs/constants';


const useSidebar = () => {

    const [activeSidebar, setActiveSidebar] = useAtom(activeSideBarItem);

    return { activeSidebar, setActiveSidebar }
}

export default useSidebar