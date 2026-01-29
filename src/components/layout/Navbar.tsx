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
        <nav
            className={`
                fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 
                w-[95%] md:w-[90%] max-w-6xl 
                rounded-full 
                border border-white/40 
                transition-all duration-300 ease-in-out
                ${scrolled
                    ? 'bg-white/90 backdrop-blur-xl shadow-lg py-2 px-4 md:px-6'
                    : 'bg-white/60 backdrop-blur-md shadow-sm py-2 px-4 md:py-3 md:px-8'
                }
            `}
        >
            <div className="flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 text-xl md:text-2xl font-serif font-bold !text-[var(--primary-color)] tracking-tight hover:opacity-80 transition-opacity">
                    Mossy
                </Link>

                <div className="flex gap-2 md:gap-8 items-center">
                    <Link to="/market" className="hidden md:block font-medium text-text-main hover:text-primary-color transition-colors text-sm uppercase tracking-wide">
                        Market
                    </Link>

                    <div className="flex gap-1 md:gap-3 items-center">
                        {isLoggedIn && (
                            <Link to="/wallet" className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white/50 hover:bg-white hover:text-primary-color text-text-muted transition-all border border-transparent hover:border-primary-color/20 hover:shadow-md">
                                <FaWallet className="text-xs md:text-base" />
                            </Link>
                        )}
                        <Link to="/cart" className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white/50 hover:bg-white hover:text-primary-color text-text-muted transition-all border border-transparent hover:border-primary-color/20 hover:shadow-md">
                            <FaShoppingCart className="text-xs md:text-base" />
                        </Link>
                        <Link to="/mypage" className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white/50 hover:bg-white hover:text-primary-color text-text-muted transition-all border border-transparent hover:border-primary-color/20 hover:shadow-md">
                            <FaUser className="text-xs md:text-base" />
                        </Link>

                        {isLoggedIn ? (
                            <button
                                onClick={handleLogout}
                                className="px-3 py-1.5 md:px-5 md:py-2 rounded-full text-xs md:text-sm font-medium bg-black/5 text-text-main hover:bg-black/10 transition-colors ml-1 md:ml-2"
                            >
                                Log out
                            </button>
                        ) : (
                            <Link
                                to="/login"
                                className="px-4 py-1.5 md:px-6 md:py-2.5 rounded-full text-xs md:text-sm font-medium bg-[var(--primary-color)] !text-white shadow-lg shadow-primary-color/20 hover:bg-primary-hover hover:shadow-xl hover:-translate-y-0.5 transition-all ml-1 md:ml-2"
                            >
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
