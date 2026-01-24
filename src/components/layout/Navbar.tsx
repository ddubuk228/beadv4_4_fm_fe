import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaWallet } from 'react-icons/fa';
import { authApi } from '../../api/auth';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        setIsLoggedIn(!!token);

        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [location]);

    const handleLogout = async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
            try {
                await authApi.logout(refreshToken);
            } catch (e) {
                console.error("Logout failed", e);
            }
        }
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setIsLoggedIn(false);
        navigate('/login');
    };

    return (
        <nav style={{
            position: 'fixed',
            top: '1.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            width: '90%',
            maxWidth: '1200px',
            backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: '9999px',
            padding: scrolled ? '0.5rem 2rem' : '0.75rem 2rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            transition: 'all 0.3s ease'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{
                    fontSize: '1.5rem',
                    fontFamily: 'Playfair Display, serif',
                    fontWeight: 'bold',
                    color: 'var(--primary-color)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    letterSpacing: '-0.02em'
                }}>
                    Mossy
                </Link>

                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <Link to="/market" style={{ fontWeight: 500, fontSize: '0.95rem' }}>Market</Link>

                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        {isLoggedIn && (
                            <Link to="/wallet" className="btn btn-outline" style={{
                                padding: '0.5rem',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                border: 'none',
                                backgroundColor: 'rgba(255,255,255,0.5)'
                            }}>
                                <FaWallet size={16} />
                            </Link>
                        )}
                        <Link to="/cart" className="btn btn-outline" style={{
                            padding: '0.5rem',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            border: 'none',
                            backgroundColor: 'rgba(255,255,255,0.5)'
                        }}>
                            <FaShoppingCart size={16} />
                        </Link>
                        <Link to="/mypage" className="btn btn-outline" style={{
                            padding: '0.5rem',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            border: 'none',
                            backgroundColor: 'rgba(255,255,255,0.5)'
                        }}>
                            <FaUser size={16} />
                        </Link>
                        {isLoggedIn ? (
                            <button onClick={handleLogout} className="btn" style={{
                                fontSize: '0.9rem',
                                padding: '0.5rem 1.25rem',
                                backgroundColor: 'rgba(0,0,0,0.05)',
                                color: 'var(--text-main)',
                                fontWeight: 500
                            }}>
                                Log out
                            </button>
                        ) : (
                            <Link to="/login" className="btn btn-primary" style={{
                                padding: '0.6rem 1.5rem',
                                fontSize: '0.9rem'
                            }}>
                                Log in
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
