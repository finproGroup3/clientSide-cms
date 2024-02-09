"use client"
import { usePathname } from 'next/navigation'
import Link from 'next/link';

function Sidebar() {
    const pathname = usePathname()

    // Define menu items with their corresponding routes
    const menuItems = [
        { name: 'Home', route: '/' },
        { name: 'About', route: '/about' },
        { name: 'Services', route: '/services' },
        { name: 'Products', route: '/products' },
        { name: 'Contact', route: '/contact' },
    ];

    return (
        <div className="bg-gray-100 h-screen w-1/5 flex flex-col justify-center items-center">
            {menuItems.map((item, index) => (
                <Link key={index} href={item.route}>
                    <div className={`py-2 px-4 ${pathname === item.route ? 'bg-blue-500 text-white' : 'bg-white'}`}>
                        {item.name}
                    </div>
                </Link>
            ))}
        </div>
    );
}

export default Sidebar;
