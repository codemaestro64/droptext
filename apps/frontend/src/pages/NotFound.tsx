import PageError from "../components/PageError"

const NotFoundPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 overflow-x-hidden">
      <PageError errMsg="Page Not Found" />
    </div>
  )
}

export default NotFoundPage