import { Zap, CloudLightningIcon, ShieldCheck, Code } from "lucide-react"


const FeaturesSection = () => {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-12">
      <div className="card-bg backdrop-blur-lg rounded-xl p-6 border-color">
        <div className="w-12 h-12 input-bg rounded-lg flex items-center justify-center mb-4">
          <ShieldCheck className="text-green-600 w-6 h-6" />
        </div>
        <h3 className="text-xl font-semibold text-primary mb-2">Secure & Private</h3>
        <p className="text-secondary">Your code is encrypted and stored securely. Choose from public, unlisted, or private visibility options.</p>
      </div>
      <div className="card-bg backdrop-blur-lg rounded-xl p-6 border-color">
        <div className="w-12 h-12 input-bg rounded-lg flex items-center justify-center mb-4">
          <Code className="text-brown-500 w-6 h-6" />
        </div>
        <h3 className="text-xl font-semibold text-primary mb-2">Syntax Highlighting</h3>
        <p className="text-secondary">Beautiful syntax highlighting for 100+ programming languages with multiple themes to choose from.</p>
      </div>
      <div className="card-bg backdrop-blur-lg rounded-xl p-6 border-color">
        <div className="w-12 h-12 input-bg rounded-lg flex items-center justify-center mb-4">
          <Zap className="text-yellow-500 w-6 h-6" />
        </div>
        <h3 className="text-xl font-semibold text-primary mb-2">Lightning Fast</h3>
        <p className="text-secondary">Instant sharing with short URLs, API access, and real-time collaboration features.</p>
    </div>
  </div>
  )
}

export default FeaturesSection