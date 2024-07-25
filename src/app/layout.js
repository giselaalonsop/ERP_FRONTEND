// app/layout.js
import '@/app/global.css'
import { ThemeProvider } from '@/context/ThemeProvider'
import { Suspense } from 'react'
import Loading from './loading'

export const metadata = {
  title: 'ERP System',
}

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body className="antialiased">
        <ThemeProvider>
          <Suspense fallback={<Loading />}>
            {children}
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout
