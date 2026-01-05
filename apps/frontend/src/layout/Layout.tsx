import { Outlet } from "react-router-dom"
import AppBar from "../components/AppBar";

const Layout = () => {
  return (
    <html lang="en">
      <body>
        <AppBar />
        <main>
          <Outlet />
        </main>
      </body>
    </html>
  )
}

export default Layout