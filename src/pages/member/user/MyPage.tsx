import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaPen } from 'react-icons/fa';
import { memberApi } from '../../../api/member';
import { walletApi, type UserWalletResponseDto } from '../../../api/wallet';
import ProfileEditPage from '../../product/ProfileEditPage';
import { getProfileImageUrl, isDefaultProfile } from '../../../utils/image';
import { couponApi, type UserCouponResponse } from '../../../api/coupon';
import { donationApi, type DonationSummaryResponse, type DonationMonthlyHistoryResponse } from '../../../api/donation';
import { reviewApi, type WritableReviewResponse, type ReviewResponse } from '../../../api/review';

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
    const [donationSummary, setDonationSummary] = useState<DonationSummaryResponse | null>(null);
    const [donationHistory, setDonationHistory] = useState<DonationMonthlyHistoryResponse[]>([]);
    const [pendingReviews, setPendingReviews] = useState<WritableReviewResponse[]>([]);
    const [myReviews, setMyReviews] = useState<ReviewResponse[]>([]);
    const [myReviewPage, setMyReviewPage] = useState<number>(0);
    const [myReviewTotalPages, setMyReviewTotalPages] = useState<number>(0);
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedOrderItemId, setSelectedOrderItemId] = useState<number | null>(null);
    const [reviewContent, setReviewContent] = useState('');
    const [reviewRating, setReviewRating] = useState(5);
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

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

    // Fetch Donations
    useEffect(() => {
        if (!walletInfo || !walletInfo.user.id) return;
        const fetchDonations = async () => {
            try {
                const summary = await donationApi.getSummary(walletInfo.user.id);
                if (summary && summary.resultCode?.startsWith('200')) {
                    setDonationSummary(summary.data);
                } else {
                    setDonationSummary(null);
                }

                const history = await donationApi.getHistory(walletInfo.user.id);
                if (history && history.resultCode?.startsWith('200')) {
                    setDonationHistory(history.data);
                } else {
                    setDonationHistory([]);
                }
            } catch (err) {
                console.error('Failed to fetch donations:', err);
            }
        };
        fetchDonations();
    }, [walletInfo?.user?.id]);

    // Fetch Reviews
    useEffect(() => {
        if (!walletInfo || activeTab !== 'reviews') return;

        const fetchReviews = async () => {
            try {
                // Fetch Pending Reviews
                const pendingRes = await reviewApi.getPendings();
                if (pendingRes && pendingRes.resultCode?.startsWith('200')) {
                    setPendingReviews(pendingRes.data);
                }

                // Fetch My Reviews
                const myReviewsRes = await reviewApi.getMyReviews(myReviewPage, 10);
                if (myReviewsRes && myReviewsRes.resultCode?.startsWith('200')) {
                    setMyReviews(myReviewsRes.data.content);
                    setMyReviewTotalPages(myReviewsRes.data.totalPages);
                }
            } catch (err) {
                console.error('Failed to fetch reviews:', err);
            }
        };

        fetchReviews();
    }, [walletInfo, activeTab, myReviewPage]);

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

    const handleOpenReviewModal = (orderItemId: number) => {
        setSelectedOrderItemId(orderItemId);
        setReviewContent('');
        setReviewRating(5);
        setReviewModalOpen(true);
    };

    const handleCloseReviewModal = () => {
        setReviewModalOpen(false);
        setSelectedOrderItemId(null);
        setReviewContent('');
        setReviewRating(5);
    };

    const handleSubmitReview = async () => {
        if (!selectedOrderItemId) return;
        if (!reviewContent.trim()) {
            alert('리뷰 내용을 입력해주세요.');
            return;
        }

        setIsSubmittingReview(true);
        try {
            const res = await reviewApi.createReview(selectedOrderItemId, {
                content: reviewContent,
                rating: reviewRating
            });

            if (res.resultCode.startsWith('201')) {
                alert('리뷰가 등록되었습니다!');
                setReviewModalOpen(false);

                // Refresh reviews
                const pendingRes = await reviewApi.getPendings();
                if (pendingRes && pendingRes.resultCode?.startsWith('200')) {
                    setPendingReviews(pendingRes.data);
                }
                const myReviewsRes = await reviewApi.getMyReviews(myReviewPage, 10);
                if (myReviewsRes && myReviewsRes.resultCode?.startsWith('200')) {
                    setMyReviews(myReviewsRes.data.content);
                    setMyReviewTotalPages(myReviewsRes.data.totalPages);
                }
            } else {
                alert('리뷰 등록에 실패했습니다. 다시 시도해주세요.');
            }
        } catch (error: any) {
            console.error('Failed to submit review:', error);
            if (error.response?.status === 409) {
                alert('이미 해당 상품에 리뷰를 작성하셨습니다.');
            } else {
                alert('리뷰 등록 중 오류가 발생했습니다.');
            }
        } finally {
            setIsSubmittingReview(false);
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
                        <h3 style={{ fontSize: '1.25rem', margin: '0 0 1rem 0', fontWeight: 700, color: '#1e293b' }}>내 리뷰 관리</h3>
                        <div style={{ borderBottom: '2px solid #1e293b', marginBottom: '1.5rem' }}></div>

                        {/* 작성 가능한 리뷰 (Pending) */}
                        <div style={{ marginBottom: '3rem' }}>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#334155', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                                작성 가능한 리뷰
                                <span style={{ marginLeft: '0.5rem', backgroundColor: '#e2e8f0', color: '#475569', fontSize: '0.8rem', padding: '0.1rem 0.5rem', borderRadius: '12px' }}>
                                    {pendingReviews.length}
                                </span>
                            </h4>
                            {pendingReviews.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '2rem 0', color: '#94a3b8', backgroundColor: '#f8fafc', borderRadius: '8px', fontSize: '0.95rem' }}>작성 가능한 리뷰가 없습니다.</div>
                            ) : (
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {pendingReviews.map((pending, idx) => (
                                        <li key={`pending-${idx}`} style={{ padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '0.25rem' }}>구매 확정일: {new Date(pending.createdAt).toLocaleDateString()}</div>
                                                <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#1e293b' }}>상품 번호: {pending.productId} (주문 상세: {pending.orderItemId})</div>
                                            </div>
                                            <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', borderRadius: '6px' }} onClick={() => handleOpenReviewModal(pending.orderItemId)}>
                                                리뷰 쓰기
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* 내가 작성한 리뷰 */}
                        <div>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#334155', marginBottom: '1rem' }}>내가 작성한 리뷰</h4>
                            {myReviews.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '2rem 0', color: '#94a3b8', backgroundColor: '#f8fafc', borderRadius: '8px', fontSize: '0.95rem' }}>작성한 리뷰가 없습니다.</div>
                            ) : (
                                <div>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {myReviews.map((review) => (
                                            <li key={review.id} style={{ padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                                    <div>
                                                        <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.25rem' }}>작성일: {new Date(review.createdAt).toLocaleDateString()} · 상품 번호: {review.productId}</div>
                                                        <div style={{ color: '#fbbf24', fontSize: '1.2rem', letterSpacing: '2px', marginBottom: '0.5rem' }}>
                                                            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ fontSize: '1rem', color: '#334155', lineHeight: '1.5' }}>
                                                    {review.content}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Pagination (My Reviews) */}
                                    {myReviewTotalPages > 1 && (
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
                                            <button
                                                onClick={() => setMyReviewPage(p => Math.max(0, p - 1))}
                                                disabled={myReviewPage === 0}
                                                style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: myReviewPage === 0 ? '#f8fafc' : '#ffffff', color: myReviewPage === 0 ? '#94a3b8' : '#1e293b', cursor: myReviewPage === 0 ? 'not-allowed' : 'pointer' }}
                                            >
                                                이전
                                            </button>
                                            <span style={{ color: '#475569', fontWeight: 500 }}>
                                                {myReviewPage + 1} / {myReviewTotalPages}
                                            </span>
                                            <button
                                                onClick={() => setMyReviewPage(p => Math.min(myReviewTotalPages - 1, p + 1))}
                                                disabled={myReviewPage >= myReviewTotalPages - 1}
                                                style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: myReviewPage >= myReviewTotalPages - 1 ? '#f8fafc' : '#ffffff', color: myReviewPage >= myReviewTotalPages - 1 ? '#94a3b8' : '#1e293b', cursor: myReviewPage >= myReviewTotalPages - 1 ? 'not-allowed' : 'pointer' }}
                                            >
                                                다음
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
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

                        {donationSummary && (
                            <div style={{ backgroundColor: '#f0fdf4', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                                <div>
                                    <div style={{ fontSize: '0.9rem', color: '#166534', fontWeight: 600, marginBottom: '0.5rem' }}>이번 달 기부액</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#14532d' }}>{donationSummary.totalAmount?.toLocaleString() || 0}원</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.9rem', color: '#166534', fontWeight: 600, marginBottom: '0.5rem' }}>이번 달 기부 횟수</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#14532d' }}>{donationSummary.donationCount || 0}회</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.9rem', color: '#166534', fontWeight: 600, marginBottom: '0.5rem' }}>총 탄소 절감량</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#14532d' }}>{donationSummary.totalCarbonOffset || 0}kg</div>
                                </div>
                            </div>
                        )}

                        {(!Array.isArray(donationHistory) || donationHistory.length === 0) ? (
                            <div style={{ textAlign: 'center', padding: '4rem 0', color: '#94a3b8' }}>기부 내역이 없습니다.</div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                {donationHistory.map((monthly, idx) => (
                                    <div key={idx}>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #e2e8f0' }}>
                                            {monthly.year}년 {monthly.month}월
                                            <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#64748b', marginLeft: '1rem' }}>
                                                해당 월 총 기부액 {monthly.totalAmount?.toLocaleString() || 0}원 · 절감량 {monthly.totalCarbonOffset || 0}kg
                                            </span>
                                        </div>
                                        {monthly.logs && monthly.logs.length > 0 ? (
                                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                {monthly.logs.map(log => (
                                                    <li key={log.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                                                        <div>
                                                            <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
                                                                {new Date(log.createdAt).toLocaleString()} (주문번호: {log.orderItemId})
                                                            </div>
                                                            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>
                                                                탄소 배출권 기부
                                                            </div>
                                                        </div>
                                                        <div style={{ textAlign: 'right' }}>
                                                            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-color)' }}>
                                                                {log.amount?.toLocaleString() || 0}원
                                                            </div>
                                                            <div style={{ fontSize: '0.85rem', color: '#166534' }}>
                                                                탄소 {log.carbonOffset || 0}kg 절감
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div style={{ textAlign: 'center', padding: '1rem 0', color: '#94a3b8', fontSize: '0.9rem' }}>내역이 없습니다.</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
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
                            {donationSummary?.totalAmount ? donationSummary.totalAmount.toLocaleString() : 0}<span style={{ fontSize: '1rem', fontWeight: 500, marginLeft: '4px' }}>원</span>
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
                                <button onClick={() => setActiveTab('reviews')} style={navItemStyle('reviews')}>
                                    내 리뷰
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

            {/* Review Modal */}
            {reviewModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
                    <div style={{ backgroundColor: '#ffffff', padding: '2.5rem', borderRadius: '16px', width: '100%', maxWidth: '500px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>리뷰 작성하기</h3>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>별점</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setReviewRating(star)}
                                        style={{ fontSize: '2rem', background: 'none', border: 'none', cursor: 'pointer', color: star <= reviewRating ? '#fbbf24' : '#e2e8f0', padding: 0, transition: 'color 0.2s' }}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>리뷰 내용</label>
                            <textarea
                                value={reviewContent}
                                onChange={(e) => setReviewContent(e.target.value)}
                                placeholder="상품에 대한 솔직한 리뷰를 남겨주세요."
                                style={{ width: '100%', minHeight: '120px', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', boxSizing: 'border-box', resize: 'vertical' }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <button
                                onClick={handleCloseReviewModal}
                                disabled={isSubmittingReview}
                                style={{ padding: '0.75rem 1.5rem', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: isSubmittingReview ? 'not-allowed' : 'pointer' }}
                            >
                                취소
                            </button>
                            <button
                                onClick={handleSubmitReview}
                                disabled={isSubmittingReview}
                                className="btn btn-primary"
                                style={{ padding: '0.75rem 1.5rem', border: 'none', borderRadius: '8px', fontWeight: 600, opacity: isSubmittingReview ? 0.7 : 1, cursor: isSubmittingReview ? 'not-allowed' : 'pointer' }}
                            >
                                {isSubmittingReview ? '등록 중...' : '리뷰 등록하기'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyPage;
