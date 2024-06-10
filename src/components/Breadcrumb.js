// components/Breadcrumb.js
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { HomeIcon } from '@heroicons/react/solid';

const Breadcrumb = () => {
  const pathname = usePathname();
  const pathArray = useMemo(() => pathname.split('/').filter(Boolean), [pathname]);

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const routeNames = {
    'about': 'About Us',
    'products': 'Our Products',
    'contact': 'Contact Us'
    // Agrega más rutas personalizadas aquí
  };

  return (
    <nav aria-label="breadcrumb" className="p-4 m-6">
      <ol className="list-none flex space-x-2 items-center">
        <li className="flex items-center">
          <Link href="/" className="text-blue-500 hover:underline flex items-center">
            <HomeIcon className="h-5 w-5 text-gray-500 mr-1" />
            Home
          </Link>
        </li>
        {pathArray.map((segment, index) => {
          const href = `/${pathArray.slice(0, index + 1).join('/')}`;
          const name = routeNames[segment] || capitalize(segment);
          const isLast = index === pathArray.length - 1;
          return (
            <li key={index} className="flex items-center">
              <span className="mx-2 text-gray-500">/</span>
              {isLast ? (
                <span className="text-gray-700 font-bold">{name}</span>
              ) : (
                <Link href={href} className="text-blue-500 hover:underline">
                  {name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;