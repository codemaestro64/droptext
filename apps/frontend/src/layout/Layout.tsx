import { Outlet } from "react-router-dom"
import AppBar from "../components/AppBar";
import Footer from "../components/Footer";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-base-100">
      <AppBar />
      <main className="flex-1 py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout