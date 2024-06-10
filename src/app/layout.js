import '@/app/global.css'
import { ThemeProvider } from '@/context/ThemeProvider'

export const metadata = {
    title: 'Laravel',
}
const RootLayout = ({ children }) => {
    return (
        <html lang="en">
            <body className="antialiased">
                <ThemeProvider>
                {children}
                </ThemeProvider>
                </body>
        </html>
    )
}

export default RootLayout
