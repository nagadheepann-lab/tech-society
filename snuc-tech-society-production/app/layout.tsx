import './globals.css'
import AppShell from './components/AppShell'

export const metadata={title:'SNUC Tech Society',description:'Discover, apply, track and showcase opportunities at SNU Chennai.'}
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><AppShell>{children}</AppShell></body></html>}
