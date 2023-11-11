import { createBrowserRouter, RouterProvider } from "react-router-dom"

import DesktopMain from "../pages/DesktopMain"
import DesktopContentCard from "./desktop/DesktopContentCard"
import TreeLineListCard from "./desktop/TreeLineListCard"
import TreeLineDetailCard from "./desktop/TreeLineDetailCard"
import TreeLineNewCard from "./desktop/TreeLineNewCard"

// create the routes used on the Desktop version of the app
const router = createBrowserRouter([
    {
        path: '/',
        element: <DesktopMain />,
        children: [
            { 
                element: <DesktopContentCard />,
                children: [
                    {index: true, element: <TreeLineListCard />},
                    {path: 'detail/:treeId', element: <TreeLineDetailCard />},
                    {path: 'new', element: <TreeLineNewCard />} 
                ]
            }
        ]
    }
])

// the navigation is only a wrapper around the RouterProvider
const DesktopNavigation: React.FC = () => {
    return <>
        <RouterProvider router={router} />
    </>
}

export default DesktopNavigation