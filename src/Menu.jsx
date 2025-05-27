import { Link, useLocation } from 'react-router-dom';

function Menu() {
  const location = useLocation();

  // Helper to check if the current hash matches the route
  const isActive = (path) => {
    // check whether path ends with var path
    return (
      location.pathname === path || location.pathname.startsWith(path + '/')
    );
  };

  return (
    <nav className="menu">
      Mode:
      <Link to="/" className={isActive('/') ? 'active' : ''}>
        Dictionary
      </Link>
      <Link to="/string" className={isActive('/string') ? 'active' : ''}>
        String
      </Link>
      <Link to="/cli" className={isActive('/cli') ? 'active' : ''}>
        CLI
      </Link>
    </nav>
  );
}

export default Menu;
