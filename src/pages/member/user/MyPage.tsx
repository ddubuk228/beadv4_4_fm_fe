import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaPen } from 'react-icons/fa';
import { memberApi } from '../../../api/member';
import { walletApi, type UserWalletResponseDto } from '../../../api/wallet';
import ProfileEditPage from './ProfileEditPage';
import { getProfileImageUrl, isDefaultProfile } from '../../../utils/image';
import { couponApi, type UserCouponResponse } from '../../../api/coupon';

type TabType = 'orders' | 'profile' | 'likes' | 'reviews' | 'wallet' | 'coupon' | 'donation';

const MyPage = () => {
    const navigate = useNavigate();
    const [walletInfo, setWalletInfo] = useState<UserWalletResponseDto | null>(null);
    const [coupons, setCoupons] = useState<UserCouponResponse[]>([]);
    const [totalCoupons, setTotalCoupons] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabType>('orders'); // Default tab is order history
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [couponStatusFilter, setCouponStatusFilter] = useState<'ALL' | 'UNUSED' | 'USED' | 'EXPIRED'>('ALL');
    const [couponPage, setCouponPage] = useState<number>(0);
    const [couponTotalPages, setCouponTotalPages] = useState<number>(0);

    const alertShown = useRef(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchInfo = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                if (!alertShown.current) {
                    alert('로그인이 필요합니다.');
                    alertShown.current = true;
                    navigate('/login');
                }
                return;
            }

            try {
                const meResponse = await memberApi.getMe();
                if (meResponse.resultCode.startsWith('S-200') || meResponse.resultCode.startsWith('200')) {
                    const meData = meResponse.data;
                    let userInfoFromMe: any = null;

                    if (typeof meData === 'object' && meData !== null) {
                        userInfoFromMe = meData;
                    } else if (typeof meData === 'number') {
                        userInfoFromMe = { userId: meData };
                    }

                    let walletData = {
                        walletId: 0,
                        balance: 0,
                        user: {
                            id: (userInfoFromMe as any).userId || (userInfoFromMe as any).id || 0,
                            email: (userInfoFromMe as any).email || '정보 없음',
                            name: (userInfoFromMe as any).name || (userInfoFromMe as any).username || '사용자',
                            nickname: (userInfoFromMe as any).nickname || localStorage.getItem('nickname') || 'User',
                            profileImage: (userInfoFromMe as any).profileImage || null,
                            createdAt: (userInfoFromMe as any).createdAt || new Date().toISOString(),
                            sellerStatus: (userInfoFromMe as any).status
                        }
                    };

                    try {
                        try {
                            const balanceResponse = await walletApi.getBalance();
                            if (balanceResponse.resultCode.startsWith('S-200') || balanceResponse.resultCode.startsWith('200')) {
                                walletData.balance = balanceResponse.data;
                            }
                        } catch (walletError) {
                            console.warn('Wallet balance fetch failed (using default 0):', walletError);
                        }
                    } catch (walletError) {
                        console.warn('Wallet info fetch failed (using default):', walletError);
                    }

                    setWalletInfo(walletData as any);

                }
            } catch (e) {
                console.error('Failed to fetch me info', e);
            } finally {
                setLoading(false);
            }
        };

        fetchInfo();
    }, [navigate]);

    useEffect(() => {
        if (!walletInfo) return;
        const fetchCoupons = async () => {
            try {
                const statusParam = couponStatusFilter === 'ALL' ? undefined : couponStatusFilter;
                const couponRes = await couponApi.getMyCoupons(couponPage, 10, statusParam);
                if (couponRes && couponRes.data && couponRes.data.content) {
                    setCoupons(couponRes.data.content);
                    setCouponTotalPages(couponRes.data.totalPages);
                    if (couponStatusFilter === 'ALL') {
                        setTotalCoupons(couponRes.data.totalElements);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch coupons', err);
            }
        };
        fetchCoupons();
    }, [walletInfo, couponStatusFilter, couponPage]);

    // Reset page when filter changes
    useEffect(() => {
        setCouponPage(0);
    }, [couponStatusFilter]);

    if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '6rem' }}>로딩 중...</div>;

    if (!walletInfo) return (
        <div className="container" style={{ textAlign: 'center', marginTop: '6rem' }}>
            <p>정보를 불러올 수 없습니다. 다시 로그인해주세요.</p>
            <button onClick={() => navigate('/login')} className="btn btn-primary">로그인 페이지로</button>
        </div>
    );

    const { user, balance } = walletInfo;

    const navItemStyle = (tabId: TabType) => ({
        display: 'block',
        padding: '0.75rem 1rem',
        color: activeTab === tabId ? 'var(--primary-color)' : '#475569',
        backgroundColor: activeTab === tabId ? '#f0fdf4' : 'transparent',
        textDecoration: 'none',
        fontWeight: activeTab === tabId ? 700 : 500,
        borderRadius: '6px',
        transition: 'all 0.2s',
        cursor: 'pointer',
        border: 'none',
        width: '100%',
        textAlign: 'left' as const
    });

    const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingImage(true);
        try {
            const res = await memberApi.changeProfileImage(file);
            if (res.resultCode.startsWith('S-')) {
                // Update local state to reflect new image instantly
                setWalletInfo(prev => {
                    if (!prev) return null;
                    return {
                        ...prev,
                        user: {
                            ...prev.user,
                            profileImage: res.data // Use URL from backend
                        }
                    };
                });
                alert('프로필 이미지가 변경되었습니다.');
            }
        } catch (error) {
            console.error('Failed to update profile image', error);
            alert('프로필 이미지 변경 중 오류가 발생했습니다.');
        } finally {
            setIsUploadingImage(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; // Reset input
            }
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'orders':
                return (
                    <div className="card" style={{ padding: '2.5rem 2rem', backgroundColor: '#ffffff', border: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', borderRadius: '12px', minHeight: '600px' }}>
                        <h3 style={{ fontSize: '1.25rem', margin: '0 0 1rem 0', fontWeight: 700, color: '#1e293b' }}>주문 내역</h3>
                        <div style={{ borderBottom: '2px solid #1e293b', marginBottom: '1.5rem' }}></div>

                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
                            <select className="form-select" style={{ width: '120px', padding: '0.6rem 1rem', borderRadius: '6px', border: '1px solid #e2e8f0', color: '#475569', fontSize: '0.95rem' }}>
                                <option>3개월</option>
                                <option>6개월</option>
                                <option>1년</option>
                            </select>
                            <div style={{ position: 'relative', flex: 1 }}>
                                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>🔍</span>
                                <input
                                    type="text"
                                    placeholder="상품명으로 검색해보세요"
                                    style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', borderRadius: '6px', border: 'none', backgroundColor: '#f1f5f9', fontSize: '0.95rem', color: '#1e293b', outline: 'none' }}
                                />
                            </div>
                        </div>

                        {/* Order List Empty State */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 0', color: '#94a3b8' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>📄</div>
                            <div style={{ fontSize: '1rem', fontWeight: 500 }}>조회된 주문 내역이 없습니다.</div>
                        </div>
                    </div>
                );
            case 'profile':
                return (
                    <div className="card" style={{ padding: '2.5rem 2rem', backgroundColor: '#ffffff', border: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', borderRadius: '12px', minHeight: '600px' }}>
                        <ProfileEditPage initialEmail={user.email} />
                    </div>
                );
            case 'likes':
                return (
                    <div className="card" style={{ padding: '2.5rem 2rem', backgroundColor: '#ffffff', border: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', borderRadius: '12px', minHeight: '600px' }}>
                        <h3 style={{ fontSize: '1.25rem', margin: '0 0 1rem 0', fontWeight: 700, color: '#1e293b' }}>찜 한 상품</h3>
                        <div style={{ borderBottom: '2px solid #1e293b', marginBottom: '1.5rem' }}></div>
                        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#94a3b8' }}>찜 한 상품이 없습니다.</div>
                    </div>
                );
            case 'reviews':
                return (
                    <div className="card" style={{ padding: '2.5rem 2rem', backgroundColor: '#ffffff', border: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', borderRadius: '12px', minHeight: '600px' }}>
                        <h3 style={{ fontSize: '1.25rem', margin: '0 0 1rem 0', fontWeight: 700, color: '#1e293b' }}>내 리뷰</h3>
                        <div style={{ borderBottom: '2px solid #1e293b', marginBottom: '1.5rem' }}></div>
                        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#94a3b8' }}>작성한 리뷰가 없습니다.</div>
                    </div>
                );
            case 'wallet':
                return (
                    <div className="card" style={{ padding: '2.5rem 2rem', backgroundColor: '#ffffff', border: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', borderRadius: '12px', minHeight: '600px' }}>
                        <h3 style={{ fontSize: '1.25rem', margin: '0 0 1rem 0', fontWeight: 700, color: '#1e293b' }}>예치금 관리</h3>
                        <div style={{ borderBottom: '2px solid #1e293b', marginBottom: '1.5rem' }}></div>
                        <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary-color)', marginBottom: '1rem', textAlign: 'center', padding: '2rem 0' }}>
                            {balance.toLocaleString()}원
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <Link to="/wallet/history" className="btn btn-primary" style={{ padding: '0.8rem 2rem', borderRadius: '50px' }}>내역 상세 보기</Link>
                        </div>
                    </div>
                );
            case 'donation':
                return (
                    <div className="card" style={{ padding: '2.5rem 2rem', backgroundColor: '#ffffff', border: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', borderRadius: '12px', minHeight: '600px' }}>
                        <h3 style={{ fontSize: '1.25rem', margin: '0 0 1rem 0', fontWeight: 700, color: '#1e293b' }}>나의 기부 내역</h3>
                        <div style={{ borderBottom: '2px solid #1e293b', marginBottom: '1.5rem' }}></div>
                        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#94a3b8' }}>이번 달 기부 내역이 없습니다.</div>
                    </div>
                );
            case 'coupon':
                return (
                    <div className="card" style={{ padding: '2.5rem 2rem', backgroundColor: '#ffffff', border: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', borderRadius: '12px', minHeight: '600px' }}>
                        <h3 style={{ fontSize: '1.25rem', margin: '0 0 1rem 0', fontWeight: 700, color: '#1e293b' }}>보유 쿠폰</h3>
                        <div style={{ borderBottom: '2px solid #1e293b', marginBottom: '1.5rem' }}></div>

                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
                            <select
                                className="form-select"
                                value={couponStatusFilter}
                                onChange={(e) => setCouponStatusFilter(e.target.value as any)}
                                style={{ width: '150px', padding: '0.6rem 1rem', borderRadius: '6px', border: '1px solid #e2e8f0', color: '#475569', fontSize: '0.95rem' }}
                            >
                                <option value="ALL">전체</option>
                                <option value="UNUSED">사용 가능</option>
                                <option value="USED">사용 완료</option>
                                <option value="EXPIRED">기간 만료</option>
                            </select>
                        </div>

                        {coupons.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '4rem 0', color: '#94a3b8' }}>보유 중인 쿠폰이 없습니다.</div>
                        ) : (
                            <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem', margin: '0 -0.5rem', padding: '0 0.5rem' }}>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '0.5rem' }}>
                                    {coupons.map((coupon) => (
                                        <li key={coupon.userCouponId} style={{ padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>
                                                    {coupon.couponName}
                                                </div>
                                                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-color)' }}>
                                                    {coupon.couponType === 'PERCENTAGE'
                                                        ? `${coupon.discountValue}% 할인`
                                                        : `${coupon.discountValue.toLocaleString()}원 할인`}
                                                </div>
                                                {coupon.maxDiscountAmount && coupon.couponType === 'PERCENTAGE' && (
                                                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>
                                                        최대 {coupon.maxDiscountAmount.toLocaleString()}원 할인
                                                    </div>
                                                )}
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ display: 'inline-block', padding: '0.4rem 0.8rem', backgroundColor: coupon.status === 'UNUSED' ? '#dcfce7' : '#f1f5f9', color: coupon.status === 'UNUSED' ? '#166534' : '#64748b', fontSize: '0.8rem', borderRadius: '50px', fontWeight: 600, marginBottom: '0.5rem' }}>
                                                    {coupon.status === 'UNUSED' ? '사용 가능' : coupon.status === 'USED' ? '사용 완료' : '만료됨'}
                                                </div>
                                                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                                                    {coupon.endAt ? `${new Date(coupon.endAt).toLocaleDateString()} 까지` : '기한 없음'}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Pagination Controls */}
                        {couponTotalPages > 1 && (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
                                <button
                                    onClick={() => setCouponPage(p => Math.max(0, p - 1))}
                                    disabled={couponPage === 0}
                                    style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: couponPage === 0 ? '#f8fafc' : '#ffffff', color: couponPage === 0 ? '#94a3b8' : '#1e293b', cursor: couponPage === 0 ? 'not-allowed' : 'pointer' }}
                                >
                                    이전
                                </button>
                                <span style={{ color: '#475569', fontWeight: 500 }}>
                                    {couponPage + 1} / {couponTotalPages}
                                </span>
                                <button
                                    onClick={() => setCouponPage(p => Math.min(couponTotalPages - 1, p + 1))}
                                    disabled={couponPage >= couponTotalPages - 1}
                                    style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: couponPage >= couponTotalPages - 1 ? '#f8fafc' : '#ffffff', color: couponPage >= couponTotalPages - 1 ? '#94a3b8' : '#1e293b', cursor: couponPage >= couponTotalPages - 1 ? 'not-allowed' : 'pointer' }}
                                >
                                    다음
                                </button>
                            </div>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div style={{ backgroundColor: '#fafaf9', minHeight: '100vh', paddingTop: '140px', paddingBottom: '4rem' }}>
            <div className="container" style={{ maxWidth: '1024px', margin: '0 auto', padding: '0 1rem' }}>

                {/* 1. Top Section - 3 Metrics Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>

                    {/* 예치금 */}
                    <div
                        className="card"
                        onClick={() => setActiveTab('wallet')}
                        style={{ padding: '2rem 1.75rem', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: activeTab === 'wallet' ? '2px solid var(--primary-color)' : '2px solid transparent', borderRadius: '24px', cursor: 'pointer', transition: 'all 0.2s', minHeight: '160px' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'auto' }}>
                            <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700, color: '#1e293b' }}>예치금</h3>
                            <span style={{ fontSize: '0.75rem', marginLeft: '0.5rem', color: 'var(--primary-color)', fontWeight: 600 }}>MossyCash</span>
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: '800', textAlign: 'right', color: '#0f172a' }}>
                            {balance.toLocaleString()}<span style={{ fontSize: '1rem', fontWeight: 500, marginLeft: '4px' }}>원</span>
                        </div>
                    </div>

                    {/* 보유 쿠폰 */}
                    <div
                        className="card"
                        onClick={() => setActiveTab('coupon')}
                        style={{ padding: '2rem 1.75rem', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: activeTab === 'coupon' ? '2px solid var(--primary-color)' : '2px solid transparent', borderRadius: '24px', cursor: 'pointer', transition: 'all 0.2s', minHeight: '160px' }}
                    >
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', margin: 0, marginBottom: 'auto' }}>보유 쿠폰</h3>
                        <div style={{ fontSize: '2rem', fontWeight: '800', textAlign: 'right', color: '#0f172a' }}>
                            {totalCoupons}<span style={{ fontSize: '1rem', fontWeight: 500, marginLeft: '4px' }}>개</span>
                        </div>
                    </div>

                    {/* 이번달 기부금 */}
                    <div
                        className="card"
                        onClick={() => setActiveTab('donation')}
                        style={{ padding: '2rem 1.75rem', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: activeTab === 'donation' ? '2px solid var(--primary-color)' : '2px solid transparent', borderRadius: '24px', cursor: 'pointer', transition: 'all 0.2s', minHeight: '160px' }}
                    >
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', margin: 0, marginBottom: 'auto' }}>이번달 기부금</h3>
                        <div style={{ fontSize: '2rem', fontWeight: '800', textAlign: 'right', color: '#0f172a' }}>
                            0<span style={{ fontSize: '1rem', fontWeight: 500, marginLeft: '4px' }}>원</span>
                        </div>
                    </div>
                </div>

                {/* 2. Main 2-Column Section */}
                <div style={{ display: 'flex', gap: '2rem' }}>

                    {/* Left Sidebar (White Background) */}
                    <aside style={{ width: '260px', flexShrink: 0 }}>
                        <div className="card" style={{ backgroundColor: '#ffffff', padding: '1.5rem 0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: 'none', borderRadius: '12px', minHeight: '600px', display: 'flex', flexDirection: 'column' }}>

                            {/* Profile Header */}
                            <div style={{ padding: '0 1.5rem', marginBottom: '1.5rem', textAlign: 'left' }}>
                                <div style={{ fontSize: '1rem', color: '#64748b', fontWeight: 500, marginBottom: '0.5rem' }}>반가워요!</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        style={{ position: 'relative', cursor: isUploadingImage ? 'not-allowed' : 'pointer', opacity: isUploadingImage ? 0.5 : 1 }}
                                        title="프로필 이미지 변경"
                                    >
                                        <img
                                            src={getProfileImageUrl(user.profileImage)}
                                            alt="Profile"
                                            style={{
                                                width: '48px',
                                                height: '48px',
                                                borderRadius: isDefaultProfile(user.profileImage) ? '0' : '50%',
                                                objectFit: isDefaultProfile(user.profileImage) ? 'contain' : 'cover'
                                            }}
                                        />
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleProfileImageChange}
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                        />
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '-4px',
                                            right: '-4px',
                                            backgroundColor: '#ffffff',
                                            borderRadius: '50%',
                                            width: '18px',
                                            height: '18px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                                        }}>
                                            <FaPen size={10} color="#64748b" />
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: 700, fontSize: '1.25rem', color: '#1e293b' }}>{user.nickname || user.name}님</div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '0.5rem' }}>
                                    <button onClick={() => setActiveTab('reviews')} style={{ fontSize: '0.85rem', color: activeTab === 'reviews' ? 'var(--primary-color)' : '#475569', backgroundColor: activeTab === 'reviews' ? '#f0fdf4' : '#f1f5f9', border: 'none', padding: '0.5rem 0.9rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>내 리뷰</button>
                                    <button onClick={() => setActiveTab('profile')} style={{ fontSize: '0.85rem', color: activeTab === 'profile' ? 'var(--primary-color)' : '#475569', backgroundColor: activeTab === 'profile' ? '#f0fdf4' : '#f1f5f9', border: 'none', padding: '0.5rem 0.9rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>내 정보 설정</button>
                                </div>
                            </div>

                            <hr style={{ border: 0, borderTop: '1px solid #e2e8f0', margin: '0 0 1rem 0' }} />

                            {/* Main Menus */}
                            <nav style={{ display: 'flex', flexDirection: 'column', padding: '0 1rem', gap: '0.25rem', marginBottom: 'auto' }}>
                                <button onClick={() => setActiveTab('orders')} style={navItemStyle('orders')}>
                                    주문 내역
                                </button>
                                <button onClick={() => setActiveTab('likes')} style={navItemStyle('likes')}>
                                    찜 한 상품
                                </button>
                            </nav>

                            {/* Bottom Seller Menus */}
                            <nav style={{ padding: '0 1rem', marginTop: '2rem' }}>
                                {(user as any).sellerStatus === 'APPROVED' ? (
                                    <Link to="/myshop" style={{ display: 'block', padding: '0.75rem 1rem', color: '#ffffff', textDecoration: 'none', fontWeight: 600, borderRadius: '50px', backgroundColor: 'var(--primary-color)', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                        나의 상점 관리 (판매자)
                                    </Link>
                                ) : (user as any).sellerStatus === 'PENDING' ? (
                                    <span style={{ display: 'block', padding: '0.75rem 1rem', color: '#94a3b8', textDecoration: 'none', fontWeight: 500, cursor: 'not-allowed', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
                                        판매자 승인 대기중
                                    </span>
                                ) : (
                                    <Link to="/seller-request" style={{ display: 'block', padding: '0.75rem 1rem', color: '#475569', textDecoration: 'none', fontWeight: 500, borderRadius: '6px', transition: 'background-color 0.2s' }}>
                                        판매자 신청
                                    </Link>
                                )}
                            </nav>
                        </div>
                    </aside>

                    {/* Right Main Content */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyPage;
