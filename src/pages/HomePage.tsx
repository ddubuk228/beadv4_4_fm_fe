import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaLeaf, FaRecycle, FaTree, FaWineBottle, FaShoppingBag } from 'react-icons/fa';

const HomePage = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const dummyProducts = [
        { id: 1, name: '몬스테라 델리시오사', price: 45000, desc: '공기정화 식물의 베스트셀러', image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=600&auto=format&fit=crop' },
        { id: 2, name: '제주 유기농 녹차 세트', price: 32000, desc: '프리미엄 잎차 선물 세트', image: 'https://images.unsplash.com/photo-1509937528035-ad76254b0356?q=80&w=600&auto=format&fit=crop' },
        { id: 3, name: '친환경 대나무 텀블러', price: 18900, desc: '지구를 생각하는 선택', image: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?q=80&w=600&auto=format&fit=crop' },
        { id: 4, name: '천연 아로마 디퓨저', price: 27500, desc: '심신 안정을 위한 라벤더 향', image: 'https://images.unsplash.com/photo-1610725664338-23c6f86dd430?q=80&w=600&auto=format&fit=crop' },
        { id: 5, name: '수제 천연 비누 세트', price: 12000, desc: '피부에 순한 100% 천연 재료', image: 'https://images.unsplash.com/photo-1592659762303-90081d34b277?q=80&w=600&auto=format&fit=crop' },
        { id: 6, name: '미니 다육이 화분', price: 8500, desc: '책상 위의 작은 정원', image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=600&auto=format&fit=crop' },
        { id: 7, name: '오가닉 코튼 에코백', price: 15000, desc: '실용적인 데일리 백', image: 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?q=80&w=600&auto=format&fit=crop' },
        { id: 8, name: '올리브 나무 샐러드 볼', price: 38000, desc: '주방의 품격을 높여주는 우드 식기', image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=600&auto=format&fit=crop' }
    ];

    const filteredProducts = dummyProducts.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.desc.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const categories = [
        { name: '친환경 생활용품', icon: <FaLeaf /> },
        { name: '제로웨이스트', icon: <FaRecycle /> },
        { name: '로컬푸드', icon: <FaTree /> },
        { name: '업사이클링', icon: <FaWineBottle /> },
        { name: '리필용품', icon: <FaShoppingBag /> }
    ];

    return (
        <div style={{ paddingBottom: '0' }}>
            {/* 1. Hero Banner */}
            <div style={{
                position: 'relative', height: '600px', width: '100%',
                backgroundImage: 'url(https://images.unsplash.com/photo-1470058869958-2a77ade41c02?q=80&w=2070&auto=format&fit=crop)',
                backgroundSize: 'cover', backgroundPosition: 'center',
                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                color: 'white', textAlign: 'center', marginBottom: '4rem'
            }}>
                <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)' }}></div>
                <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '800px', padding: '0 1rem' }}>
                    <h1 style={{ fontSize: '5rem', fontFamily: 'Playfair Display, serif', marginBottom: '1rem', color: '#ffffff', textShadow: '0 4px 20px rgba(0,0,0,0.5)', fontWeight: 700 }}>Mossy</h1>
                    <p style={{ fontSize: '1.5rem', fontWeight: 300, marginBottom: '3rem', opacity: 0.9 }}>Nature-Inspired Lifestyle Market</p>

                    <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: '50px', padding: '0.8rem 1.5rem', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
                            <FaSearch style={{ color: '#64748b', fontSize: '1.2rem', marginRight: '1rem' }} />
                            <input
                                type="text"
                                placeholder="Search for eco-friendly products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '1.1rem', color: '#334155' }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container" style={{ maxWidth: '95%', margin: '0 auto', padding: '0 1rem' }}>

                {/* Search Results (Conditional) */}
                {searchTerm ? (
                    <div style={{ minHeight: '500px' }}>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '2rem' }}>'{searchTerm}' 검색 결과</h2>
                        {filteredProducts.length > 0 ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
                                {filteredProducts.map(product => (
                                    <Link to={`/market/${product.id}`} key={product.id} className="card" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                                        <div style={{ height: '220px', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '1rem' }}>
                                            <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} />
                                        </div>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.3rem' }}>{product.name}</h3>
                                        <p style={{ color: 'var(--primary-color)', fontWeight: 700 }}>{product.price.toLocaleString()} 원</p>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>검색 결과가 없습니다.</div>
                        )}
                    </div>
                ) : (
                    <>
                        {/* 2. Categories */}
                        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '5rem' }}>
                            {categories.map((cat, idx) => (
                                <div key={idx} style={{
                                    padding: '0.8rem 1.5rem', borderRadius: '50px', backgroundColor: 'white', border: '1px solid #e2e8f0',
                                    display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'all 0.2s',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)', color: '#475569'
                                }}
                                    onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--primary-color)'; e.currentTarget.style.color = 'var(--primary-color)'; }}
                                    onMouseOut={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#475569'; }}
                                >
                                    {cat.icon}
                                    <span style={{ fontWeight: 500 }}>{cat.name}</span>
                                </div>
                            ))}
                        </div>

                        {/* 3. Recommended Products */}
                        <div style={{ marginBottom: '6rem' }}>
                            <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#334155', fontFamily: 'Noto Sans KR, sans-serif' }}>추천 상품</h2>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                                {dummyProducts.map(product => (
                                    <Link to={`/market/${product.id}`} key={product.id} className="card" style={{ textDecoration: 'none', color: 'inherit', transition: 'transform 0.2s' }}>
                                        <div style={{ height: '260px', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '1.2rem', backgroundColor: '#f1f5f9' }}>
                                            <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.4rem', color: '#1e293b' }}>{product.name}</h3>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <p style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--primary-color)' }}>{product.price.toLocaleString()} 원</p>
                                            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>무료배송</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* 4. Brand Highlight */}
                        <div style={{
                            marginBottom: '6rem', padding: '4rem', borderRadius: '20px',
                            backgroundColor: '#e6f4ea', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                        }}>
                            <div style={{ maxWidth: '500px' }}>
                                <span style={{ display: 'inline-block', padding: '0.4rem 1rem', backgroundColor: 'var(--primary-color)', color: 'white', borderRadius: '20px', fontSize: '0.8rem', marginBottom: '1rem', fontWeight: 600 }}>Brand Focus</span>
                                <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem', lineHeight: 1.2, color: '#0f172a' }}>제로웨이스트를 실천하는<br />GreenMate 브랜드</h2>
                                <p style={{ fontSize: '1.1rem', color: '#475569', marginBottom: '2rem', lineHeight: 1.6 }}>
                                    지속 가능한 내일을 위해 노력하는 그린메이트의 이야기를 만나보세요.
                                    포장재 없는 가게, 리필 스테이션 등 다양한 친환경 활동을 응원합니다.
                                </p>
                                <button className="btn btn-primary" style={{ padding: '0.8rem 2rem', fontSize: '1rem', border: 'none' }}>브랜드 스토리 보기</button>
                            </div>
                            <div style={{ width: '400px', height: '300px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                                <img src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=1000&auto=format&fit=crop" alt="Green Brand" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        </div>

                        {/* 5. Popular Search Terms */}
                        <div style={{ marginBottom: '6rem', textAlign: 'center', marginTop: '4rem' }}>
                            <h3 style={{ fontSize: '1.2rem', color: '#64748b', marginBottom: '1.5rem', fontWeight: 500 }}>지금 인기있는 검색어</h3>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                                {['#텀블러', '#친환경주방', '#업사이클', '#대나무칫솔', '#플라스틱프리'].map(tag => (
                                    <span key={tag} style={{
                                        padding: '0.6rem 1.2rem', borderRadius: '30px', backgroundColor: '#f1f5f9', color: '#475569',
                                        cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.95rem', fontWeight: 500
                                    }}
                                        onClick={() => setSearchTerm(tag.replace('#', ''))}
                                        onMouseOver={e => { e.currentTarget.style.backgroundColor = '#e2e8f0'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                                        onMouseOut={e => { e.currentTarget.style.backgroundColor = '#f1f5f9'; e.currentTarget.style.transform = 'translateY(0)' }}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* 6. Footer */}
            <footer style={{ backgroundColor: '#354f41', color: '#e2e8f0', padding: '4rem 0', marginTop: 'auto' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                        <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem', fontFamily: 'Playfair Display, serif' }}>Mossy</h2>
                        <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>서초구 반포대로 45 명정빌딩 3층</p>
                        <p style={{ fontSize: '0.9rem' }}>사업자등록번호: 123-45-67890</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ marginBottom: '1rem', display: 'flex', gap: '1.5rem', justifyContent: 'flex-end', fontSize: '0.9rem' }}>
                            <span style={{ cursor: 'pointer', color: '#cbd5e1' }}>이용약관</span>
                            <span style={{ cursor: 'pointer', color: '#cbd5e1' }}>개인정보처리방침</span>
                            <span style={{ cursor: 'pointer', color: '#cbd5e1' }}>고객센터</span>
                        </div>
                        <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>© 2026 Mossy Store. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
