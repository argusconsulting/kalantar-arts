// Import the Link component from next/link
import Link from 'next/link';

export const metadata = {
    title: "Admin Dashboard",
    description: "Manage the application settings and data from the Admin dashboard.",
};

export default function AdminLayout({ children }) {
    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 text-white p-4">
                <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
                <nav>
                    <ul className="space-y-4">
                        <li>
                            {/* Use Link component for client-side navigation */}
                            <Link href="/Admin/DashBoard"
                              
                className="block hover:text-blue-400">Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link href="/Admin/MenuBaar"
                                className="block hover:text-blue-400">MenuBaar
                            </Link>
                        </li>
                        <li>
                            <Link href="/Admin/Petals"
                                className="block hover:text-blue-400">6-Petals
                            </Link>
                        </li>
                        <li>
                            <Link href="/Admin/MainMenu"
                                className="block hover:text-blue-400">MainMenu
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
                {/* Header */}
                <header className="bg-gray-100 border-b border-gray-300 p-4">
                    <h1 className="text-xl font-semibold">Admin Dashboard</h1>
                </header>

                {/* Page Content */}
                <main className="p-4">{children}</main>
            </div>
        </div>
    );
}
