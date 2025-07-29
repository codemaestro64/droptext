import PageWrapper from "./PageWrapper"
import { APP_NAME } from "@/config"
import { Clipboard } from "lucide-react"
import ThemeToggleButton from "./ThemeToggleButton"

const AppBar = () => {
  return (
    <header>
      <nav className="navbar">
        <PageWrapper>
          <div className="flex justify-between py-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">
                  <Clipboard size={20} />
                </span>
              </div>
              <h1 className="text-2xl font-bold text-primary">
                {APP_NAME}
              </h1>
            </div>
            <ThemeToggleButton />
          </div>
        </PageWrapper>
      </nav>
    </header>
  )
}

export default AppBar