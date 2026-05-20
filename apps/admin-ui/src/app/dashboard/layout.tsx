import SidebarWrapper from "../../shared/components/sidebar"

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex h-full bg-slate-50 min-h-screen text-slate-900">
            {/* Sidebar */}
            <aside className="w-[280px] min-w-[250px] max-w-[300px] border-r border-slate-800 bg-[#0b0f19] p-4">
                <div className="sticky top-0">
                    <SidebarWrapper />
                </div>
            </aside>

            {/* Main content area */}
            <main className="flex-1 overflow-x-hidden">
                <div className="overflow-auto h-full p-6">
                    {children}
                </div>
            </main>
        </div>
    )
}

export default Layout;
