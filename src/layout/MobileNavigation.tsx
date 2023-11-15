import { RouterProvider, createBrowserRouter } from "react-router-dom"
import MobileMain from "../pages/MobileMain"
import MobileBottomSheet from "./mobile/MobileBottomSheet"
import MobileTreeLineList from "./mobile/MobileTreeLineList"

// create the routes used on the Mobile version of the app
const router = createBrowserRouter([
    {
        path: '/',
        element: <MobileMain />,
        children: [
            {
                element: <MobileBottomSheet />,
                children: [
                    {index: true, element: <MobileTreeLineList />},
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