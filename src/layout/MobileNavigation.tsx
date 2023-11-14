import { RouterProvider, createBrowserRouter } from "react-router-dom"
import MobileMain from "../pages/MobileMain"

// create the routes used on the Mobile version of the app
const router = createBrowserRouter([
    {
        path: '/',
        element: <MobileMain />,
        children: []
    }
])

// the navigation is only a wrapper around the RouterProvider
const MobileNavigation: React.FC = () => {
    return <>
        <RouterProvider router={router} />
    </>
}

export default MobileNavigation