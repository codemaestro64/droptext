import { Outlet } from "react-router-dom"
import AppBar from "../components/AppBar";

const Layout = () => {
  return (
    <div className="min-h-screen bg-base-100">
      <AppBar />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout