/*import { Link } from 'react-router-dom';
import './Header.css';

function Header({ user }) {
  return (
    <header className="header">
      <h1>KPOP Photocard Exchange</h1>
      <nav>
        {user ? (
          <span>🌸 Hi, {user.name}!</span>
        ) : (
          <>
            <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;*/
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header() {
  const { user, logout} = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="header">
      <h1 onClick={() => navigate('/')}>KPOP Trading</h1>
      <nav>
        {user ? (
          <>
          <span>Hi, {user.username}</span>
          <button onClick={handleLogout}>Logout</button></>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </div>
  );
}

export default Header;

