import PageWrapper from "./PageWrapper"
import { APP_NAME } from "@/config"
import ThemeToggleButton from "./ThemeToggleButton"

const AppBar = () => {
  return (
    <header className="glass-effect border-b border-color">
      <PageWrapper>
        <div className="flex justify-between py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                📋
              </span>
            </div>
            <h1 className="text-2xl font-bold text-primary">
              {APP_NAME}
            </h1>
          </div>
          <ThemeToggleButton />
        </div>
      </PageWrapper>
    </header>
  )
}

export default AppBar