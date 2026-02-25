import { useState, useEffect } from 'react';
import { couponApi, type SellerCouponListResponse, type CouponCreateRequest } from '../../../api/coupon';

const SellerCouponPage = () => {
    // 1을 임시 셀러 ID로 사용합니다 (실제 구현에서는 전역 상태나 Auth에서 가져옴)
    const SELLER_ID = 1;

    const [coupons, setCoupons] = useState<SellerCouponListResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Form State
    const [couponName, setCouponName] = useState('');
    const [couponType, setCouponType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
    const [discountValue, setDiscountValue] = useState<number | ''>('');
    const [maxDiscountAmount, setMaxDiscountAmount] = useState<number | ''>('');
    const [productItemId, setProductItemId] = useState<number | ''>('');
    const [startAt, setStartAt] = useState('');
    const [endAt, setEndAt] = useState('');

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const res = await couponApi.getSellerCoupons(SELLER_ID);
            if (res.data) {
                setCoupons(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch coupons:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleCreateCoupon = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!couponName || !discountValue || !startAt || !endAt || !productItemId) {
            alert('필수 값을 모두 입력해주세요.');
            return;
        }

        const requestData: CouponCreateRequest = {
            productItemId: Number(productItemId),
            couponName,
            couponType,
            discountValue: Number(discountValue),
            maxDiscountAmount: couponType === 'PERCENTAGE' && maxDiscountAmount ? Number(maxDiscountAmount) : null,
            startAt: new Date(startAt).toISOString().split('.')[0], // Basic ISO string format compatible with Java LocalDateTime
            endAt: new Date(endAt).toISOString().split('.')[0],
        };

        try {
            await couponApi.createSellerCoupon(SELLER_ID, requestData);
            alert('쿠폰이 성공적으로 생성되었습니다.');
            setIsCreateModalOpen(false);
            fetchCoupons(); // Refresh the list

            // Reset form
            setCouponName('');
            setDiscountValue('');
            setMaxDiscountAmount('');
            setProductItemId('');
            setStartAt('');
            setEndAt('');
        } catch (error) {
            console.error('Failed to create coupon:', error);
            alert('쿠폰 생성에 실패했습니다.');
        }
    };

    const handleDeactivate = async (couponId: number) => {
        if (!window.confirm('정말로 이 쿠폰을 비활성화하시겠습니까?')) return;

        try {
            await couponApi.deactivateSellerCoupon(SELLER_ID, couponId);
            alert('쿠폰이 비활성화되었습니다.');
            fetchCoupons();
        } catch (error) {
            console.error('Failed to deactivate coupon:', error);
            alert('쿠폰 비활성화에 실패했습니다.');
        }
    };

    const activeCount = coupons.filter(c => c.isActive).length;

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', fontFamily: '"Noto Sans KR", sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' }}>쿠폰 관리</h1>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    style={{ padding: '0.6rem 1.2rem', backgroundColor: 'var(--primary-color, #22c55e)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                >
                    + 새 쿠폰 생성
                </button>
            </div>

            {/* Top Dashboard Banner Area */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '2rem', marginBottom: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', gap: '2rem' }}>
                <div style={{ flex: 1, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ color: '#64748b', fontWeight: '600', marginBottom: '0.5rem' }}>총 발급 쿠폰</div>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b' }}>{coupons.length}</div>
                </div>
                <div style={{ flex: 1, backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ color: '#3b82f6', fontWeight: '600', marginBottom: '0.5rem' }}>활성 쿠폰</div>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: '#1d4ed8' }}>{activeCount}</div>
                </div>
                <div style={{ flex: 1, backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ color: '#ef4444', fontWeight: '600', marginBottom: '0.5rem' }}>종료/비활성 쿠폰</div>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: '#b91c1c' }}>{coupons.length - activeCount}</div>
                </div>
            </div>

            {/* Coupons List */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1fr 1.5fr 1fr', borderBottom: '1px solid #e2e8f0', padding: '1rem 1.5rem', fontSize: '0.9rem', fontWeight: 'bold', color: '#64748b', backgroundColor: '#f8fafc' }}>
                    <div>상태</div>
                    <div>쿠폰명 / 대상 상품 ID</div>
                    <div>할인 혜택</div>
                    <div>할인 타입</div>
                    <div>유효 기간</div>
                    <div>관리</div>
                </div>

                {loading ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>불러오는 중...</div>
                ) : coupons.length === 0 ? (
                    <div style={{ padding: '4rem 0', textAlign: 'center', color: '#94a3b8', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ fontSize: '3rem', opacity: 0.5 }}>🎫</div>
                        <div>발급된 쿠폰이 없습니다. 새로운 쿠폰을 생성해보세요!</div>
                    </div>
                ) : (
                    coupons.map(coupon => (
                        <div key={coupon.couponId} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1fr 1.5fr 1fr', borderBottom: '1px solid #f1f5f9', padding: '1rem 1.5rem', fontSize: '0.95rem', color: '#1e293b', alignItems: 'center', transition: 'background-color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                            <div>
                                {coupon.isActive ? (
                                    <span style={{ padding: '0.2rem 0.6rem', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>활성</span>
                                ) : (
                                    <span style={{ padding: '0.2rem 0.6rem', backgroundColor: '#f1f5f9', color: '#475569', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>비활성</span>
                                )}
                            </div>
                            <div>
                                <div style={{ fontWeight: 600 }}>{coupon.couponName}</div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>상품 ID: {coupon.productItemId}</div>
                            </div>
                            <div style={{ fontWeight: 'bold', color: '#ef4444' }}>
                                {coupon.couponType === 'PERCENTAGE' ? `${coupon.discountValue}%` : `${coupon.discountValue.toLocaleString()}원`}
                            </div>
                            <div>
                                {coupon.couponType === 'PERCENTAGE' ? '정률할인' : '정액할인'}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: '#475569' }}>
                                <div>{new Date(coupon.startAt).toLocaleDateString()} ~</div>
                                <div>{new Date(coupon.endAt).toLocaleDateString()}</div>
                            </div>
                            <div>
                                {coupon.isActive && (
                                    <button
                                        onClick={() => handleDeactivate(coupon.couponId)}
                                        style={{ padding: '0.4rem 0.8rem', backgroundColor: 'transparent', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#ef4444', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 500 }}
                                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        비활성화
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Create Coupon Modal */}
            {isCreateModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                    <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '600px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>새 쿠폰 생성</h2>
                            <button onClick={() => setIsCreateModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: '#94a3b8', cursor: 'pointer' }}>&times;</button>
                        </div>

                        <form onSubmit={handleCreateCoupon} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>쿠폰 이름 *</label>
                                <input type="text" value={couponName} onChange={(e) => setCouponName(e.target.value)} required placeholder="예: 봄맞이 10% 할인" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>대상 상품 ID *</label>
                                <input type="number" value={productItemId} onChange={(e) => setProductItemId(e.target.value ? Number(e.target.value) : '')} required placeholder="상품 ID 입력" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>할인 타입 *</label>
                                    <select value={couponType} onChange={(e) => setCouponType(e.target.value as 'PERCENTAGE' | 'FIXED')} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: '#fff' }}>
                                        <option value="PERCENTAGE">정률 할인 (%)</option>
                                        <option value="FIXED">정액 할인 (원)</option>
                                    </select>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>할인 값 *</label>
                                    <input type="number" value={discountValue} onChange={(e) => setDiscountValue(e.target.value ? Number(e.target.value) : '')} required placeholder={couponType === 'PERCENTAGE' ? "예: 10" : "예: 5000"} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                                </div>
                            </div>

                            {couponType === 'PERCENTAGE' && (
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>최대 할인 금액 (선택)</label>
                                    <input type="number" value={maxDiscountAmount} onChange={(e) => setMaxDiscountAmount(e.target.value ? Number(e.target.value) : '')} placeholder="입력하지 않으면 제한 없음" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>시작 일시 *</label>
                                    <input type="datetime-local" min={new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)} value={startAt} onChange={(e) => setStartAt(e.target.value)} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>종료 일시 *</label>
                                    <input type="datetime-local" min={startAt || new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)} value={endAt} onChange={(e) => setEndAt(e.target.value)} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setIsCreateModalOpen(false)} style={{ flex: 1, padding: '0.75rem', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                                    취소
                                </button>
                                <button type="submit" style={{ flex: 1, padding: '0.75rem', backgroundColor: 'var(--primary-color, #22c55e)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                                    생성하기
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerCouponPage;
