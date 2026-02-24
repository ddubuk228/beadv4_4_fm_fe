import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import { memberApi } from '../api/member';
import Modal from '../components/Modal';

const SignupCompletePage = () => {
    const navigate = useNavigate();
    const openPostcode = useDaumPostcodePopup('https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js');

    const [formData, setFormData] = useState({
        nickname: '',
        phoneNum: '',
        address: '',
        rrn: '',
        latitude: 0,
        longitude: 0,
    });
    const [error, setError] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Map SDK State
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [mapError, setMapError] = useState(false);

    useEffect(() => {
        // Load Kakao Map SDK check (Similar to SignupPage)
        let attempts = 0;
        const maxAttempts = 50;

        const checkMapLoaded = () => {
            if ((window as any).kakao && (window as any).kakao.maps) {
                (window as any).kakao.maps.load(() => {
                    setIsMapLoaded(true);
                    setMapError(false);
                });
            } else {
                attempts++;
                if (attempts < maxAttempts) {
                    setTimeout(checkMapLoaded, 200);
                } else {
                    setMapError(true);
                }
            }
        };
        checkMapLoaded();
    }, []);

    const handleAddressComplete = (data: any) => {
        const basicAddress = data.roadAddress || data.address;

        if (isMapLoaded && (window as any).kakao) {
            const geocoder = new (window as any).kakao.maps.services.Geocoder();
            geocoder.addressSearch(basicAddress, (result: any, status: any) => {
                if (status === (window as any).kakao.maps.services.Status.OK) {
                    const coords = new (window as any).kakao.maps.LatLng(result[0].y, result[0].x);
                    setFormData(prev => ({
                        ...prev,
                        address: basicAddress,
                        latitude: coords.getLat(),
                        longitude: coords.getLng()
                    }));
                } else {
                    // Fallback
                    setFormData(prev => ({ ...prev, address: basicAddress, latitude: 0, longitude: 0 }));
                }
            });
        } else {
            setFormData(prev => ({ ...prev, address: basicAddress }));
        }
    };

    const handleSearchAddress = () => {
        if (mapError) {
            document.getElementsByName('address')[0]?.focus();
            return;
        }
        openPostcode({ onComplete: handleAddressComplete });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Coordinates fallback if map failed/skipped
        let finalLat = formData.latitude;
        let finalLng = formData.longitude;
        if (finalLat === 0 && finalLng === 0) {
            // Default to Seoul City Hall if geocoding failed/skipped
            finalLat = 37.5665;
            finalLng = 126.9780;
        }

        try {
            await memberApi.updateProfile({
                nickname: formData.nickname,
                phoneNum: formData.phoneNum,
                address: formData.address,
                rrn: formData.rrn,
                latitude: finalLat,
                longitude: finalLng
            });
            setShowSuccessModal(true);
        } catch (err: any) {
            console.error(err);
            const errorMsg = err.response?.data?.msg || err.message || '정보 업데이트 중 오류가 발생했습니다.';
            setError(errorMsg);
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '4rem auto', marginTop: '140px' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>추가 정보 입력</h1>
            <p style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-muted)' }}>
                원활한 서비스 이용을 위해 추가 정보를 입력해주세요.
            </p>

            <div className="card">
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>닉네임</label>
                        <input
                            name="nickname"
                            type="text"
                            value={formData.nickname}
                            onChange={handleChange}
                            placeholder="닉네임을 입력하세요"
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>전화번호</label>
                        <input
                            name="phoneNum"
                            type="tel"
                            value={formData.phoneNum}
                            onChange={handleChange}
                            placeholder="010-0000-0000"
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>주소</label>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <input
                                name="address"
                                type="text"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                readOnly={!mapError}
                                placeholder="주소 검색 버튼을 눌러주세요"
                                style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: mapError ? 'white' : '#f1f5f9' }}
                            />
                            <button
                                type="button"
                                onClick={handleSearchAddress}
                                className="btn btn-outline"
                                style={{ whiteSpace: 'nowrap' }}
                            >
                                주소 검색
                            </button>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>주민번호 (7자리)</label>
                        <input
                            name="rrn"
                            type="text"
                            value={formData.rrn}
                            onChange={handleChange}
                            placeholder="900101-1"
                            maxLength={8}
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                        />
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>* 실명 인증 및 정산용</span>
                    </div>

                    {error && <div style={{ color: 'var(--danger-color)', fontSize: '0.9rem' }}>{error}</div>}

                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', borderRadius: '50px' }}>
                        가입 완료
                    </button>
                </form>
            </div>

            <Modal
                isOpen={showSuccessModal}
                title="가입 완료"
                message="회원가입이 모두 완료되었습니다!"
                onConfirm={() => {
                    setShowSuccessModal(false);
                    navigate('/', { replace: true });
                }}
            />
        </div>
    );
};

export default SignupCompletePage;
