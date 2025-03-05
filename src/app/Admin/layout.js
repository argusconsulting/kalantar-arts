// metadata should be in a separate server component

// Now the actual layout
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }) {
    const router = useRouter();

    useEffect(() => {
        const userData = localStorage.getItem('userdata');
        if (!userData) {
            router.push('/Login');
        }
     
    }, []);

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 text-white p-4">
                <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
                <nav>
                    <ul className="space-y-4">
                        <li>
                            <Link href="/Admin/DashBoard" className="block hover:text-blue-400">
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link href="/Admin/Users" className="block hover:text-blue-400">
                            Users
                            </Link>
                        </li>
                        <li>
                            <Link href="/Admin/Menu" className="block hover:text-blue-400">
                           Header Main Menu
                            </Link>
                            <Link href="/Admin/Menu/SubMenu" className="block hover:text-blue-400">
                           Header Sub Menu
                            </Link>
                            <Link href="/Admin/Menu/SubMenu/MenuLinks" className="block hover:text-blue-400">
                           Header Links Menu
                            </Link>
                        </li>
                        <li>
                            <Link href="/Admin/DynamicPages" className="block hover:text-blue-400">
                            Dynamic -Pages
                            </Link>
                        </li>
                        <li>
                            <Link href="/Admin/Petals" className="block hover:text-blue-400">
                                6-Petals
                            </Link>
                        </li>
                        <li>
                            <Link href="/Admin/HeroSlider" className="block hover:text-blue-400">
                            Hero_Slider
                            </Link>
                        </li>
                     
                        <li>
                            <Link href="/Admin/Socialupload" className="block hover:text-blue-400">
                            Socialupload
                            </Link>
                        </li>
                        <li>
                            <Link href="/Admin/SocialMedia" className="block hover:text-blue-400">
                            SocialMedia
                            </Link>
                        </li>

                    </ul>
                   
                </nav>
                <button className=' py-2 px-3  bg-red-500 text-white rounded-md absolute bottom-2 '>
                    Logout
                </button>
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
