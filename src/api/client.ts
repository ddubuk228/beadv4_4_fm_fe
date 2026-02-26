import axios from 'axios';

const client = axios.create({
    baseURL: '/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// 간단한 JWT 디코드 헬퍼 함수
const parseJwt = (token: string) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
};

// Request interceptor to add token and custom headers
client.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        const isAuthRequest = config.url?.includes('/auth/') || config.url?.includes('/users/signup');

        if (token && !isAuthRequest) {
            config.headers['Authorization'] = `Bearer ${token}`;

            // JWT 토큰을 파싱하여 백엔드가 요구하는 커스텀 헤더(X-User-Id, X-Seller-Id) 주입
            const decodedPayload = parseJwt(token);
            if (decodedPayload) {
                if (decodedPayload.sub) {
                    config.headers['X-User-Id'] = decodedPayload.sub;
                }
                if (decodedPayload.seller_id) {
                    config.headers['X-Seller-Id'] = decodedPayload.seller_id;
                }
            }
        }

        // If data is FormData, let the browser set the Content-Type with boundary
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle auth errors
client.interceptors.response.use(
    (response) => {
        console.log('✅ API Response:', {
            url: response.config.url,
            status: response.status,
            data: response.data
        });
        return response;
    },
    (error) => {
        console.error('❌ API Error:', {
            url: error.config?.url,
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });

        const status = error.response?.status;
        const errorMsg = error.response?.data?.msg || error.response?.data?.message || error.response?.data || error.message || '';

        // 게이트웨이나 멤버 서버가 꺼져있어서 Network Error가 났을 때
        if (!error.response) {
            console.error("Network Error: 서버에 연결할 수 없습니다.");
            return Promise.reject(error);
        }

        const isExpired = typeof errorMsg === 'string' && (errorMsg.includes('JWT expired') || errorMsg.includes('토큰'));

        // 401 Unauthorized 또는 명시적인 토큰 만료 메시지만 로그아웃 처리
        // 403 Forbidden (권한 없음)일 때는 단순히 에러만 반환하고 로그아웃시키지 않음
        if (status === 401 || (status !== 403 && isExpired)) {
            console.warn("Unauthorized error or Token Expired. Token cleared.");
            localStorage.removeItem('accessToken');
            localStorage.removeItem('nickname');
            alert('인증이 만료되었습니다. 다시 로그인해주세요.');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export interface RsData<T> {
    resultCode: string;
    msg: string;
    data: T;
}

export default client;
