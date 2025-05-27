import { Link, useLocation } from 'react-router-dom';

function Menu() {
  const location = useLocation();
  const isStringInterface = location.pathname.endsWith('/string');
  return (
    <nav className="menu">
      Mode:
      <Link to="/" className={!isStringInterface ? 'active' : ''}>
        Dictionary
      </Link>
      <Link to="/string" className={isStringInterface ? 'active' : ''}>
        String
      </Link>
    </nav>
  );
}

export default Menu;
