import {RouterProvider} from "react-router";
import {AppRoutes} from "./app.routes.jsx";
import {AuthProvider} from "./context/AuthContext.jsx";

function App() {

  return (
    <AuthProvider>
      <RouterProvider router={AppRoutes}/>
    </AuthProvider>
  )
}

export default App
