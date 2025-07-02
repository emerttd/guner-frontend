import Header from "./Header"

const Layout = ({ children }) => {
  return (
    <div className="app-container">
      <Header />
      <main className="page-wrapper">{children}</main>
    </div>
  )
}

export default Layout
