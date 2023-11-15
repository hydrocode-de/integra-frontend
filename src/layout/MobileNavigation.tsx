import { RouterProvider, createBrowserRouter } from "react-router-dom"
import MobileMain from "../pages/MobileMain"
import MobileBottomSheet from "./mobile/MobileBottomSheet"

// create the routes used on the Mobile version of the app
const router = createBrowserRouter([
    {
        path: '/',
        element: <MobileMain />,
        children: [
            {
                element: <MobileBottomSheet />,
                children: [
                    {index: true, element: <h1>LIST</h1>},
                    {path: 'detail/:treeId', element: <h1>DETAIL</h1>},
                ]
            }
        ]
    }
])

// the navigation is only a wrapper around the RouterProvider
const MobileNavigation: React.FC = () => {
    return <>
        <RouterProvider router={router} />
    </>
}

export default MobileNavigation