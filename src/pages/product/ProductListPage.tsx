import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { marketApi, type ProductResponse } from '../../api/market';
import { cartApi } from '../../api/cart';
import { ProductCard } from '../../components/ProductCard';
import { FaLeaf, FaFilter, FaChevronDown, FaHeart } from 'react-icons/fa';

const ProductListPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const categoryQuery = queryParams.get('category') || 'all';
    const searchQuery = queryParams.get('search') || '';

    const [products, setProducts] = useState<ProductResponse[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter states (mocking for UI)
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // We pass searchQuery if it exists. API pagination (0, 20)
                const data = await marketApi.getProducts(0, 20, searchQuery);
                setProducts(data.data.content);
            } catch (error) {
                console.error('Failed to fetch products', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categoryQuery, searchQuery]);

    const addToCart = async (e: React.MouseEvent, productId: number) => {
        e.preventDefault();
        try {
            await cartApi.addToCart(productId, 1);
            if (window.confirm('장바구니에 담겼습니다. 장바구니로 이동하시겠습니까?')) {
                window.location.href = '/cart';
            }
        } catch (err: any) {
            console.error(err);
            if (err.message === "로그인이 필요합니다." || err.response?.status === 401) {
                alert("로그인이 필요합니다.");
                window.location.href = '/login';
            } else {
                alert('장바구니 담기 실패: ' + (err.message || '오류가 발생했습니다.'));
            }
        }
    };

    // Category display name
    const getCategoryName = () => {
        if (searchQuery) return `"${searchQuery}" 검색 결과`;
        const map: Record<string, string> = {
            'all': '전체 상품',
            'food': '친환경 식품',
            'beauty': '클린 뷰티',
            'living': '에코 생활용품',
            'fashion': '서스테이너블 패션',
            'zerowaste': '제로웨이스트',
            'donation': '기부 굿즈'
        };
        return map[categoryQuery] || '전체 상품';
    };

    return (
        <div className="bg-[#FCFBF7] min-h-screen pb-20 font-sans">
            <div className="container mx-auto px-4 max-w-[1200px]">

                {/* 1. Mandatory Top Summary Banner */}
                <div className="mb-10 bg-[#F4F7F4] rounded-2xl p-6 md:p-8 border border-[#E1EADF] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-in-up">
                    <div className="flex-1">
                        <h2 className="text-2xl font-serif font-bold text-slate-800 mb-2">{getCategoryName()}</h2>
                        <p className="text-slate-600 text-sm">지구와 나를 위한 현명한 선택, 모시에서 제안합니다.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 bg-white/60 p-4 rounded-xl border border-white/40">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <FaLeaf />
                            </div>
                            <div>
                                <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Saved CO₂</span>
                                <span className="block text-sm font-bold text-slate-800">1,204kg 절감</span>
                            </div>
                        </div>
                        <div className="w-[1px] h-8 bg-slate-200 hidden md:block"></div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
                                <FaHeart />
                            </div>
                            <div>
                                <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total Donation</span>
                                <span className="block text-sm font-bold text-slate-800">₩2,400,000 누적</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main 2-Column Layout */}
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Mobile Filter Toggle */}
                    <button
                        className="lg:hidden flex items-center justify-center gap-2 w-full py-3 bg-white border border-[#E8E6E1] rounded-xl font-medium text-slate-700 shadow-sm"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <FaFilter className="text-sm" />
                        {showFilters ? '필터 닫기' : '필터 보기'}
                    </button>

                    {/* Left Sidebar (Filters) */}
                    <aside className={`w-full lg:w-[240px] flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                        <div className="bg-white rounded-2xl border border-[#E8E6E1] shadow-sm overflow-hidden sticky top-[150px]">
                            {/* Eco Filters */}
                            <div className="p-5 border-b border-[#E8E6E1]">
                                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <FaLeaf className="text-green-500" /> 친환경 옵션
                                </h3>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[var(--primary-color)] focus:ring-[var(--primary-color)]" />
                                        <span className="text-sm text-slate-600 group-hover:text-[var(--primary-color)] transition-colors">탄소 절감 상품</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[var(--primary-color)] focus:ring-[var(--primary-color)]" />
                                        <span className="text-sm text-slate-600 group-hover:text-[var(--primary-color)] transition-colors">재활용 소재 사용</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[var(--primary-color)] focus:ring-[var(--primary-color)]" />
                                        <span className="text-sm text-slate-600 group-hover:text-[var(--primary-color)] transition-colors">수익금 기부</span>
                                    </label>
                                </div>
                            </div>

                            {/* Delivery & Brand Filters */}
                            <div className="p-5 border-b border-[#E8E6E1]">
                                <h3 className="font-bold text-slate-800 mb-4">배송 혜택</h3>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[var(--primary-color)] focus:ring-[var(--primary-color)]" />
                                        <span className="text-sm text-slate-600 group-hover:text-[var(--primary-color)] transition-colors">에코/종이 포장재</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[var(--primary-color)] focus:ring-[var(--primary-color)]" />
                                        <span className="text-sm text-slate-600 group-hover:text-[var(--primary-color)] transition-colors">무료배송</span>
                                    </label>
                                </div>
                            </div>

                            {/* Price Filter Summary */}
                            <div className="p-5">
                                <h3 className="font-bold text-slate-800 mb-4">가격 (원)</h3>
                                <input type="range" className="w-full accent-[var(--primary-color)]" min="0" max="100" />
                                <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                                    <span>0</span>
                                    <span>100,000+</span>
                                </div>
                                <button className="mt-6 w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-colors">
                                    필터 적용
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Right Content Area (Product Grid) */}
                    <div className="flex-1">
                        {/* Top Control Bar */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                            <p className="text-sm text-slate-500 font-medium">
                                총 <span className="font-bold text-slate-800">{products.length}</span>개의 상품
                            </p>
                            <div className="flex items-center gap-2">
                                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8E6E1] rounded-full text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                                    인기순 <FaChevronDown className="text-[10px] text-slate-400" />
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="aspect-[4/5] bg-white rounded-2xl animate-pulse border border-[#E8E6E1]"></div>
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-32 bg-white rounded-2xl border border-[#E8E6E1] shadow-sm">
                                <FaLeaf className="text-4xl text-slate-200 mx-auto mb-4" />
                                <p className="text-slate-500 text-lg font-medium">상품을 찾을 수 없습니다.</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                                    {products.map((product, index) => (
                                        <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                                            <ProductCard product={product} onAddToCart={addToCart} />
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-16 text-center">
                                    <button className="px-8 py-3 bg-white border border-[#E8E6E1] hover:border-[var(--primary-color)] hover:text-[var(--primary-color)] text-slate-600 font-bold rounded-full transition-all shadow-sm">
                                        상품 더보기
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductListPage;
