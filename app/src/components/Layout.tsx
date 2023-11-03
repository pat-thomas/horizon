import styles from "./Layout.module.css"
import { Outlet , Link } from 'react-router-dom'

const Layout = () => {
  return (
    <div className={styles.Layout}>
      <nav>
        <ul>
          <li>
            <Link to="/builder">Prompt Builder</Link>
          </li>
          <li>
            <Link to="/gallery">Gallery</Link>
          </li>
        </ul>
      </nav>

      <Outlet />
    </div>
  )
}

export default Layout
