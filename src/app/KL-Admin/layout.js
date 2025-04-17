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


    const logout = () => {
        localStorage.removeItem('userdata'); // Remove stored user data
       
        router.push('/Login'); // Redirect to login page
    };

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 text-white p-4">
                <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
                <nav>
                    <ul className="space-y-4">
                        <li>
                            <Link href="/KL-Admin/DashBoard" className="block hover:text-blue-400">
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link href="/KL-Admin/Users" className="block hover:text-blue-400">
                            Users
                            </Link>
                        </li>
                    
                        
                        <li>
                            <Link href="/KL-Admin/Menu" className="block hover:text-blue-400">
                           Header Main Menu
                            </Link>
                            <Link href="/KL-Admin/Menu/SubMenu" className="block hover:text-blue-400">
                           Header Sub Menu
                            </Link>
                            <Link href="/KL-Admin/Menu/SubMenu/MenuLinks" className="block hover:text-blue-400">
                           Header Links Menu
                            </Link>
                        </li>
                        <li>
                            <Link href="/KL-Admin/DynamicPages" className="block hover:text-blue-400">
                            Dynamic -Pages
                            </Link>
                        </li>
                        <li>
                            <Link href="/KL-Admin/Petals" className="block hover:text-blue-400">
                                6-Petals
                            </Link>
                        </li>
                        <li>
                            <Link href="/KL-Admin/HeroSlider" className="block hover:text-blue-400">
                            Hero_Slider
                            </Link>
                        </li>
                     
                        {/* <li>
                            <Link href="/KL-Admin/Socialupload" className="block hover:text-blue-400">
                            Socialupload
                            </Link>
                        </li> */}
                        <li>
                            <Link href="/KL-Admin/SocialMedia" className="block hover:text-blue-400">
                            SocialMedia
                            </Link>
                        </li>

                        <li>
                            <Link href="/KL-Admin/Highlits" className="block hover:text-blue-400">
                            Highlits
                            </Link>
                        </li>
                        <li>
                            <Link href="/KL-Admin/Donation" className="block hover:text-blue-400">
                            Donation
                            </Link>
                        </li>
                        <li>
                            <Link href="/KL-Admin/FooterLinks" className="block hover:text-blue-400">
                             FooterLinks
                            </Link>
                        </li>
                        <li>
                            <Link href="/KL-Admin/ArtInitiatives" className="block hover:text-blue-400">
                             ArtInitiatives
                            </Link>
                        </li>
                       
                        <li>
                            <Link href="/KL-Admin/Contact-US" className="block hover:text-blue-400">
                            Contact Us 
                            </Link>
                        </li>

                    </ul>
                   
                </nav>
                
            </aside>

            {/* Main Content */}
            <div className="flex-1">
                {/* Header */}
                <header className="bg-gray-100 flex justify-between border-b border-gray-300 p-4">
                    <h1 className="text-xl font-semibold">Admin Dashboard</h1>
                    <button onClick={() => logout()} className=' py-2 px-3  bg-red-500 text-white rounded-md  '>
                    Logout
                </button>
                </header>

                {/* Page Content */}
                <main className="p-4">{children}</main>
            </div>
        </div>
    );
}
