import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { walletApi } from '../api/wallet';
import { memberApi } from '../api/member';

const WalletPage = () => {
    const navigate = useNavigate();
    const [balance, setBalance] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWalletData = async () => {
            try {
                // 1. Get current user
                const meResponse = await memberApi.getMe();
                let userId: number | null = null;

                if (meResponse.resultCode.startsWith('S-200') || meResponse.resultCode.startsWith('200')) {
                    const meData = meResponse.data;
                    if (typeof meData === 'object' && meData !== null) {
                        if ('userId' in meData) userId = (meData as any).userId;
                        else if ('id' in meData) userId = (meData as any).id;
                    } else if (typeof meData === 'number') {
                        userId = meData;
                    }
                }

                if (!userId) {
                    alert('로그인 정보가 유효하지 않습니다.');
                    navigate('/login');
                    return;
                }

                // 2. Fetch Balance
                const balanceResponse = await walletApi.getBalance(userId);
                if (balanceResponse.resultCode.startsWith('S-200') || balanceResponse.resultCode.startsWith('200')) {
                    setBalance(balanceResponse.data);
                }
            } catch (error) {
                console.error('Failed to fetch wallet data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWalletData();
    }, [navigate]);

    if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '6rem' }}>로딩 중...</div>;

    return (
        <div className="container" style={{ maxWidth: '1000px', margin: '4rem auto', marginTop: '140px' }}>
            <h1 style={{ marginBottom: '2rem', fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--primary-color)' }}>내 지갑</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                {/* Balance Card */}
                <div className="card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: '#fafaf9', border: '1px solid #e7e5e4' }}>
                    <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500, marginBottom: '0.5rem' }}>보유 잔액</h3>
                    <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '2rem', color: 'var(--primary-color)' }}>
                        {balance !== null ? balance.toLocaleString() : 0}<span style={{ fontSize: '1.25rem', fontWeight: 400, marginLeft: '0.2rem' }}>원</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button className="btn btn-primary" style={{ flex: 1, padding: '0.8rem', borderRadius: '50px', fontSize: '0.95rem' }}>
                            충전하기
                        </button>
                        <button className="btn btn-outline" style={{ flex: 1, padding: '0.8rem', borderRadius: '50px', fontSize: '0.95rem', backgroundColor: 'white' }}>
                            출금하기
                        </button>
                    </div>
                </div>

                {/* Transaction History Area */}
                <div className="card" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600 }}>최근 거래 내역</h3>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', cursor: 'pointer' }}>전체보기 ›</span>
                    </div>

                    <div style={{
                        height: '200px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#94a3b8',
                        backgroundColor: '#f8fafc',
                        borderRadius: 'var(--radius-md)',
                        border: '1px dashed #cbd5e1'
                    }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🍃</div>
                        <p style={{ fontSize: '0.95rem' }}>최근 거래 내역이 없습니다.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalletPage;
