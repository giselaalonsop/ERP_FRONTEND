import Link from 'next/link'
import AuthCard from '@/app/(auth)/AuthCard'
import ApplicationLogo from '@/components/ApplicationLogo'
import Button from '@/components/Button'

export const metadata = {
    title: 'Laravel',
}

const Layout = ({ children }) => {
    return (
        <div>
            <div className="font-sans text-gray-900 antialiased">
                <AuthCard>
                  
                   <div className="hidden fixed top-0 right-0 px-6 py-4 sm:block">
                  
                       <Link
                           href="/"
                           className="ml-4 text-sm text-gray-700 underline px-4"
                       >
                           Home
                       </Link>
                      
                           <Link
                               href="/login"
                               className="text-sm text-gray-700 underline"
                           >
                               Login
                           </Link>
       
                           <Link
                               href="/register"
                               className="ml-4 text-sm text-gray-700 underline"
                           >
                               Register
                           </Link>
                       
                  
                    </div>
            
        
                    {children}
                </AuthCard>
            </div>
        </div>
    )
}

export default Layout
