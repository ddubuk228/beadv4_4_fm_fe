const SellerOrderDetailPage = () => {
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', fontFamily: '"Noto Sans KR", sans-serif', paddingBottom: '4rem' }}>

            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem' }}>주문 정보</h1>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.95rem', color: '#64748b' }}>
                    <span style={{ marginRight: '1rem' }}>주문번호 #123456789</span>
                    <span style={{ color: '#cbd5e1' }}>|</span>
                    <span style={{ marginLeft: '1rem' }}>주문일시 22.11.20 13:40</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button style={{ padding: '0.4rem 0.75rem', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', borderRadius: '4px', fontSize: '0.85rem', color: '#475569', fontWeight: 500, cursor: 'pointer' }}>작업일 연장 요청</button>
                    <button style={{ padding: '0.4rem 0.75rem', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', borderRadius: '4px', fontSize: '0.85rem', color: '#475569', fontWeight: 500, cursor: 'pointer' }}>추가 결제 요청</button>
                    <button style={{ padding: '0.4rem 0.75rem', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', borderRadius: '4px', fontSize: '0.85rem', color: '#475569', fontWeight: 500, cursor: 'pointer' }}>거래 취소 요청</button>
                </div>
            </div>

            {/* Red Alert Banner */}
            <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fca5a5',
                borderRadius: '8px',
                padding: '1rem 1.5rem',
                marginBottom: '1.5rem',
                color: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.95rem'
            }}>
                <strong style={{ color: '#ef4444' }}>작업물 발송 지연</strong>
                <span>작업물 발송 기한이 지났습니다. 거래 조건 변경은 의뢰인과 상의 후, 문제 해결 요청 기능을 이용해 주세요.</span>
            </div>

            {/* Card 1: 판매한 상품 */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0, color: '#1e293b' }}>판매한 상품</h3>
                    <span style={{ fontSize: '0.9rem', color: '#64748b' }}>작업물 발송 예정 일시 <strong style={{ color: '#1e293b' }}>22.11.23 13:40</strong></span>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{ width: '100px', height: '100px', backgroundColor: '#f1f5f9', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ fontSize: '2rem' }}>🎨</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>쇼핑몰 상세페이지 및 배너 제작 디자인</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' }}>
                            <span style={{ color: '#64748b' }}>의뢰인</span>
                            <strong style={{ color: '#1e293b' }}>즐거운다람쥐</strong>
                            <button style={{ padding: '0.2rem 0.5rem', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', borderRadius: '4px', fontSize: '0.8rem', color: '#475569', cursor: 'pointer' }}>문의하기</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Card 2: 판매한 항목 */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0, color: '#1e293b' }}>판매한 항목</h3>
                    <span style={{ cursor: 'pointer', color: '#64748b' }}>▼</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 60px 120px', gap: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '1rem', color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>
                    <div>기본 항목</div>
                    <div style={{ textAlign: 'center' }}>수정 횟수</div>
                    <div style={{ textAlign: 'center' }}>작업일</div>
                    <div style={{ textAlign: 'center' }}>수량</div>
                    <div style={{ textAlign: 'right' }}>금액 (VAT 포함)</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 60px 120px', gap: '1rem', color: '#1e293b', fontSize: '1rem', marginBottom: '1rem' }}>
                    <div style={{ fontWeight: 600 }}>쇼핑몰 상세페이지 및 배너 제작 디자인</div>
                    <div style={{ textAlign: 'center' }}>1회</div>
                    <div style={{ textAlign: 'center' }}>3일</div>
                    <div style={{ textAlign: 'center' }}>1</div>
                    <div style={{ textAlign: 'right', fontWeight: 'bold' }}>150,000원</div>
                </div>

                <div style={{ color: '#64748b', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div>└ 보정 작업</div>
                    <div>└ 상업적 이용 가능</div>
                    <div>└ 원본파일 제공</div>
                </div>
            </div>

            {/* Card 3: 결제 정보 */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0, marginBottom: '1.5rem', color: '#1e293b' }}>상세 결제 내역</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '0.95rem', color: '#475569' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>상품 총 금액</span>
                        <span style={{ color: '#1e293b' }}>150,000원</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>쿠폰 할인</span>
                        <span style={{ color: '#ef4444' }}>- 10,000원</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>포인트 사용</span>
                        <span style={{ color: '#ef4444' }}>- 2,000원</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>배송비</span>
                        <span style={{ color: '#1e293b' }}>3,000원</span>
                    </div>
                </div>

                <div style={{ borderTop: '1px solid #e2e8f0', margin: '0 -1.5rem 1.5rem -1.5rem' }}></div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <span style={{ fontSize: '1.1rem', color: '#1e293b', fontWeight: 'bold' }}>최종 결제 금액</span>
                    <strong style={{ fontSize: '1.3rem', color: 'var(--primary-color, #22c55e)' }}>141,000원</strong>
                </div>

                <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>결제 수단</span>
                        <span style={{ color: '#1e293b', fontWeight: 500 }}>신용카드 (현대 1234-****-****)</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>결제 일시</span>
                        <span style={{ color: '#1e293b', fontWeight: 500 }}>2022.11.20 13:40:15</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>승인 번호</span>
                        <span style={{ color: '#1e293b', fontWeight: 500 }}>74839210</span>
                    </div>
                </div>
            </div>

            {/* Card 4: 세금계산서 신청 정보 */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 1px 2px rgba(0,0,0,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 'bold', margin: '0 0 0.25rem 0', color: '#1e293b' }}>세금계산서 신청 정보</h3>
                    <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>신청 내용을 확인하실 수 있습니다.</div>
                </div>
                <span style={{ color: '#cbd5e1', fontSize: '1.2rem' }}>❯</span>
            </div>

        </div>
    );
};

export default SellerOrderDetailPage;
