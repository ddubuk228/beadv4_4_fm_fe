import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    FaShoppingCart, FaSearch, FaBars, FaUser,
    FaCarrot, FaAppleAlt, FaFish, FaDrumstickBite, FaMugHot, FaLeaf, FaWineBottle, FaRecycle, FaHandHoldingHeart
} from 'react-icons/fa';

const CATEGORIES = [
    { name: '채소', icon: <FaCarrot />, path: '/market?category=vegetables' },
    { name: '과일·견과·쌀', icon: <FaAppleAlt />, path: '/market?category=fruits' },
    { name: '수산·해산·건어물', icon: <FaFish />, path: '/market?category=seafood' },
    { name: '정육·가공육·계란', icon: <FaDrumstickBite />, path: '/market?category=meat' },
    { name: '국·반찬·메인요리', icon: <FaMugHot />, path: '/market?category=sidedish' },
    { name: '샐러드·간편식', icon: <FaLeaf />, path: '/market?category=salad' },
    { name: '면·양념·오일', icon: <FaWineBottle />, path: '/market?category=seasoning' },
    { name: '제로웨이스트', icon: <FaRecycle className="text-green-600" />, path: '/market?category=zerowaste' },
    { name: '기부샵', icon: <FaHandHoldingHeart className="text-orange-500" />, path: '/market?category=donation' },
];

const NAV_LINKS = [
    { name: '베스트', path: '/market?sort=best' },
    { name: '신상', path: '/market?sort=new' },
    { name: '세일', path: '/market?sort=sale' },
    { name: '패션', path: '/market?category=fashion' },
    { name: '리빙', path: '/market?category=living' },
    { name: '특가/혜택', path: '/market?special=true' },
];

const Navbar = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        setIsLoggedIn(!!token && token !== 'undefined' && token !== 'null');
    }, [location]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/market?search=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm('');
        }
    };

    return (
        <div className="flex flex-col w-full z-50 bg-white font-sans text-slate-800">
            {/* 1. Desktop Top Bar: Centered Logo */}
            <div className="hidden md:flex container mx-auto px-4 max-w-[1200px] py-6 justify-center items-center">
                <Link to="/" className="text-4xl font-serif font-bold text-[var(--primary-color)] tracking-tight">
                    Mossy
                </Link>
            </div>

            {/* 2. Sticky Navigation Bar */}
            <div className="sticky top-0 z-50 bg-white shadow-sm">
                <div className="container mx-auto px-4 max-w-[1200px] h-14 md:h-16 flex items-center justify-between">

                    {/* Mobile Left: Hamburger + Logo */}
                    <div className="md:hidden flex items-center gap-4">
                        <button className="text-slate-800 text-xl font-bold">
                            <FaBars />
                        </button>
                        <Link to="/" className="text-2xl font-serif font-bold text-[var(--primary-color)] tracking-tight">
                            Mossy
                        </Link>
                    </div>

                    {/* Desktop Left: Category Hamburger + Nav Links */}
                    <div className="hidden md:flex items-center gap-8 h-full">
                        {/* Category Toggle & Mega Menu */}
                        <div className="group h-full flex items-center relative gap-2 cursor-pointer text-slate-800 hover:text-[var(--primary-color)] transition-colors py-4">
                            <FaBars className="text-lg font-bold" />
                            <span className="font-bold">카테고리</span>

                            {/* Mega Menu Dropdown */}
                            <div className="hidden group-hover:block absolute top-[calc(100%-1px)] left-0 w-64 bg-white border border-slate-100 shadow-xl rounded-b-lg overflow-hidden py-2 animate-fade-in z-50">
                                {CATEGORIES.map((cat, idx) => (
                                    <Link
                                        key={idx}
                                        to={cat.path}
                                        className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 hover:text-[var(--primary-color)] hover:font-bold transition-colors text-sm text-slate-600"
                                    >
                                        <span className="text-lg opacity-70 w-6 flex justify-center">{cat.icon}</span>
                                        {cat.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Nav Links */}
                        <nav className="flex items-center gap-8 h-full">
                            {NAV_LINKS.map(link => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className="text-sm font-medium text-slate-700 hover:text-[var(--primary-color)] hover:font-bold transition-all h-full flex items-center pt-1 border-b-2 border-transparent hover:border-[var(--primary-color)]"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Right: Search + Icons */}
                    <div className="flex items-center gap-4 md:gap-6 h-full">
                        {/* Compact Search Bar */}
                        <form onSubmit={handleSearch} className="relative hidden md:block group">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="검색어를 입력해주세요."
                                className="w-48 focus:w-64 transition-all duration-300 bg-slate-50 border border-slate-200 rounded-full py-2 pl-4 pr-10 text-xs focus:outline-none focus:border-[var(--primary-color)] focus:bg-white"
                            />
                            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[var(--primary-color)]">
                                <FaSearch />
                            </button>
                        </form>

                        {/* Mobile Search Icon */}
                        <button className="md:hidden text-slate-800" onClick={() => navigate('/search')}>
                            <FaSearch className="text-lg" />
                        </button>

                        <div className="flex items-center gap-5 text-slate-800">
                            {/* User Icon (My Page / Login) */}
                            <Link to={isLoggedIn ? "/mypage" : "/login"} className="hover:text-[var(--primary-color)] transition-transform hover:scale-110">
                                <FaUser className="text-[1.4rem]" />
                            </Link>

                            {/* Cart Icon */}
                            <Link to="/cart" className="relative hover:text-[var(--primary-color)] transition-transform hover:scale-110">
                                <FaShoppingCart className="text-[1.4rem]" />
                                {/* Cart Badge */}
                                <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-[var(--primary-color)] text-white text-[10px] font-bold flex items-center justify-center">0</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
