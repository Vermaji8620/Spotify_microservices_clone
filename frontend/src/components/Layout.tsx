import type { ReactNode } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Player from './Player'

interface LayoutProps {
    children: ReactNode
}

// React.FC stands for React.Functional_Component. The entire syntax means that -create a function component called Layout, typed with LayoutProps, and destructure children from props.

// const Layout: React.FC<LayoutProps> = ({ children }) => {
//     return (
// the above 2 lines structure is okay, or the below 3 lines structure is okay.
// const Layout = (props: LayoutProps) => {
//     const { children } = props
//     return (
// or the below line structure is also okay. 

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className='h-screen'>
            <div className="h-[90%] flex">
                <Sidebar />
                <div className="w-full m-2 px-6 pt-4 rounded bg-[#121212] text-white overflow-auto lg:w-[75%] lg:ml-0">
                    <Navbar />
                    {children}
                </div>
            </div>
            <Player />
        </div>
    )
}

export default Layout
