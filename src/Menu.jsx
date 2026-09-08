import { Link, useMatch } from 'react-router-dom';
import styles from './App.module.css';

export default function Menu() {
  const isString = useMatch('/string');
  return (
    <nav className={styles.menu} aria-label="Generator mode">
      <Link to="/" aria-current={!isString ? 'page' : undefined}>
        Dictionary
      </Link>
      <Link to="/string" aria-current={isString ? 'page' : undefined}>
        String
      </Link>
    </nav>
  );
}
