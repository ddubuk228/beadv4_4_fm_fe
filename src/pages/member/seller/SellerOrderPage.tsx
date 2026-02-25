import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderApi, type OrderListSellerResponse } from '../../../api/order';

const SellerOrderPage = () => {
    const [orders, setOrders] = useState<OrderListSellerResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const size = 10;

    const fetchOrders = async (pageNum: number) => {
        setLoading(true);
        try {
            const res = await orderApi.getSellerOrders(pageNum, size);
            if (res.data && res.data.content) {
                setOrders(res.data.content);
                setTotalPages(res.data.totalPages || 1);
            }
        } catch (error) {
            console.error('Failed to fetch seller orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(page);
    }, [page]);

    const navigate = useNavigate();

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', fontFamily: '"Noto Sans KR", sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' }}>
                    주문 관리
                </h1>
            </div>

            {/* Top Dashboard Banner Area */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '2rem', marginBottom: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', gap: '2rem' }}>
                <div style={{ flex: 1, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ color: '#64748b', fontWeight: '600', marginBottom: '0.5rem' }}>전체 주문 건수</div>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b' }}>{orders.length}</div>
                </div>
                <div style={{ flex: 1, backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ color: '#3b82f6', fontWeight: '600', marginBottom: '0.5rem' }}>결제 완료</div>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: '#1d4ed8' }}>{orders.filter(o => o.state === 'PAYMENT_COMPLETED' || o.state === 'ORDER_COMPLETED').length}</div>
                </div>
                <div style={{ flex: 1, backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ color: '#ef4444', fontWeight: '600', marginBottom: '0.5rem' }}>취소/환불</div>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: '#b91c1c' }}>{orders.filter(o => o.state === 'CANCEL_COMPLETED' || o.state === 'REFUND_COMPLETED').length}</div>
                </div>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 2fr 1fr 1fr 1.5fr 1fr',
                    borderBottom: '1px solid #e2e8f0',
                    padding: '1rem 1.5rem',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    color: '#64748b',
                    backgroundColor: '#f8fafc'
                }}>
                    <div>상태</div>
                    <div>주문상세번호 / 상품 ID </div>
                    <div>수량</div>
                    <div>총 주문 금액</div>
                    <div>주문일시</div>
                    <div>관리</div>
                </div>

                {loading ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>주문 내역을 불러오는 중...</div>
                ) : orders.length === 0 ? (
                    <div style={{ padding: '4rem 0', textAlign: 'center', color: '#94a3b8', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ fontSize: '3rem', opacity: 0.5 }}>📦</div>
                        <div>아직 등록된 주문 내역이 없습니다.</div>
                    </div>
                ) : (
                    orders.map(order => (
                        <div key={order.orderDetailId} style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 2fr 1fr 1fr 1.5fr 1fr',
                            borderBottom: '1px solid #f1f5f9',
                            padding: '1rem 1.5rem',
                            fontSize: '0.95rem',
                            color: '#1e293b',
                            alignItems: 'center',
                            transition: 'background-color 0.2s'
                        }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <div>
                                <span style={{
                                    padding: '0.2rem 0.6rem',
                                    backgroundColor: order.state.includes('CANCEL') || order.state.includes('REFUND') ? '#fef2f2' : '#e0f2fe',
                                    color: order.state.includes('CANCEL') || order.state.includes('REFUND') ? '#ef4444' : '#0369a1',
                                    borderRadius: '12px',
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold'
                                }}>
                                    {order.state.replace('_COMPLETED', '').replace('PAYMENT', '결제완료').replace('ORDER', '주문완료').replace('CANCEL', '취소').replace('REFUND', '환불')}
                                </span>
                            </div>
                            <div>
                                <div style={{ fontWeight: 600 }}>주문번호: {order.orderDetailId}</div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
                                    상품 ID: {order.productId}
                                </div>
                            </div>
                            <div style={{ fontWeight: '500' }}>{order.quantity} 개</div>
                            <div style={{ fontWeight: 'bold', color: '#1e293b' }}>
                                {order.orderPrice.toLocaleString()}원
                            </div>
                            <div style={{ fontSize: '0.85rem', color: '#475569' }}>
                                <div>{new Date(order.createdAt).toLocaleDateString()}</div>
                                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{new Date(order.createdAt).toLocaleTimeString()}</div>
                            </div>
                            <div>
                                <button
                                    onClick={() => navigate(`/myshop/orders/${order.orderDetailId}`)}
                                    style={{
                                        padding: '0.4rem 0.8rem',
                                        backgroundColor: 'transparent',
                                        border: '1px solid #cbd5e1',
                                        borderRadius: '6px',
                                        color: '#64748b',
                                        fontSize: '0.85rem',
                                        cursor: 'pointer',
                                        fontWeight: 500
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.backgroundColor = '#f1f5f9';
                                        e.currentTarget.style.color = '#0f172a';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                        e.currentTarget.style.color = '#64748b';
                                    }}
                                >
                                    상세보기
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
                    <button
                        onClick={() => setPage(p => Math.max(0, p - 1))}
                        disabled={page === 0}
                        style={{
                            padding: '0.5rem 1rem',
                            border: '1px solid #cbd5e1',
                            backgroundColor: page === 0 ? '#f8fafc' : '#ffffff',
                            color: page === 0 ? '#94a3b8' : '#1e293b',
                            borderRadius: '8px',
                            cursor: page === 0 ? 'not-allowed' : 'pointer'
                        }}
                    >
                        이전
                    </button>
                    <span style={{ padding: '0.5rem 1rem', fontWeight: 'bold', color: '#1e293b' }}>
                        {page + 1} / {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                        disabled={page === totalPages - 1}
                        style={{
                            padding: '0.5rem 1rem',
                            border: '1px solid #cbd5e1',
                            backgroundColor: page === totalPages - 1 ? '#f8fafc' : '#ffffff',
                            color: page === totalPages - 1 ? '#94a3b8' : '#1e293b',
                            borderRadius: '8px',
                            cursor: page === totalPages - 1 ? 'not-allowed' : 'pointer'
                        }}
                    >
                        다음
                    </button>
                </div>
            )}
        </div>
    );
};

export default SellerOrderPage;
