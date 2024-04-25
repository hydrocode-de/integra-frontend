import { createBrowserRouter, RouterProvider } from "react-router-dom"

import DesktopMain from "../pages/DesktopMain"

// create the routes used on the Desktop version of the app
const router = createBrowserRouter([
    {
        path: '/',
        element: <DesktopMain />,
    }
])

// the navigation is only a wrapper around the RouterProvider
const DesktopNavigation: React.FC = () => {
    return <>
        <RouterProvider router={router} />
    </>
}

export default DesktopNavigation