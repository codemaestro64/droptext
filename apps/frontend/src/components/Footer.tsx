import { APP_NAME } from "@repo/config"

const Footer = () => {
  return (
    <footer className="text-muted-foreground border-t border-secondary/10 text-center py-4 mt-auto">
      &copy; {new Date().getFullYear()} { APP_NAME }
    </footer>
  )
}

export default Footer