import { Zap, ShieldCheck, Code } from "lucide-react"

interface Feature {
  icon: React.ReactNode
  title: string 
  content: string
}

const features: Feature[] = [
  {
    icon: <ShieldCheck className="text-green-600 w-6 h-6" />,
    title: "Secure & Private",
    content: "Your code is encrypted and stored securely. Choose from public, unlisted, or private visibility options.",
  },
  {
    icon: <Code className="text-brown-500 w-6 h-6" />,
    title: "Syntax Highlighting",
    content: "Beautiful syntax highlighting for 100+ programming languages with multiple themes to choose from.",
  },
  {
    icon: <Zap className="text-yellow-500 w-6 h-6" />,
    title: "Lightning Fast",
    content: "Instant sharing with short URLs, API access, and real-time collaboration features.",
  },
]

const FeaturesSection = () => {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-12">
      {features.map(({ icon, title, content }) => (
        <div key={title} className="card rounded-xl p-6 border-color">
          <div className="w-12 h-12 input-bg rounded-lg flex items-center justify-center mb-4">
            {icon}
          </div>
          <h3 className="text-xl font-semibold text-primary mb-2">{title}</h3>
          <p className="text-secondary">{content}</p>
        </div>
      ))}
    </div>
  )
}

export default FeaturesSection