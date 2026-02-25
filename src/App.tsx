import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/auth/LoginPage';
import ProductListPage from './pages/product/ProductListPage';
import WalletPage from './pages/payment/WalletPage';
import ProductDetailPage from './pages/product/ProductDetailPage';
import SignupPage from './pages/auth/SignupPage';
import SellerRequestPage from './pages/member/seller/SellerRequestPage';
import CartPage from './pages/cart/CartPage';
import MyPage from './pages/member/user/MyPage';
import OrdersPage from './pages/order/OrdersPage';
import PaymentSuccessPage from './pages/payment/PaymentSuccessPage';
import PaymentFailPage from './pages/payment/PaymentFailPage';

import AuthCallbackPage from './pages/auth/AuthCallbackPage';
import SignupCompletePage from './pages/auth/SignupCompletePage';
import AdminPage from './pages/member/admin/AdminPage';
import ProfileEditPage from './pages/product/ProfileEditPage';
import SellerLayout from './components/layout/SellerLayout';
import SellerDashboardPage from './pages/member/seller/SellerDashboardPage';
import SellerOrderDetailPage from './pages/member/seller/SellerOrderDetailPage';
import SellerPayoutPage from './pages/member/seller/SellerPayoutPage';
import ProtectedRoute from './components/router/ProtectedRoute';
import SellerProtectedRoute from './components/router/SellerProtectedRoute';

function App() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;

    let title = 'Mossy';
    if (path === '/') title = 'Mossy | 홈';
    else if (path.startsWith('/login')) title = 'Mossy | 로그인';
    else if (path.startsWith('/signup/complete')) title = 'Mossy | 회원가입 완료';
    else if (path.startsWith('/signup')) title = 'Mossy | 회원가입';
    else if (path.startsWith('/market/')) title = 'Mossy | 상품 상세';
    else if (path.startsWith('/market')) title = 'Mossy | 마켓';
    else if (path.startsWith('/cart')) title = 'Mossy | 장바구니';
    else if (path.startsWith('/mypage')) title = 'Mossy | 마이페이지';
    else if (path.startsWith('/profile/edit')) title = 'Mossy | 프로필 수정';
    else if (path.startsWith('/admin')) title = 'Mossy | 관리자';
    else if (path.startsWith('/orders')) title = 'Mossy | 주문내역';
    else if (path.startsWith('/wallet')) title = 'Mossy | 지갑';
    else if (path.startsWith('/seller-request')) title = 'Mossy | 판매자 신청';
    else if (path.startsWith('/payment/success')) title = 'Mossy | 결제 완료';
    else if (path.startsWith('/payment/fail')) title = 'Mossy | 결제 실패';
    else if (path.startsWith('/auth/callback')) title = 'Mossy | 로그인 처리중';
    else if (path.startsWith('/myshop/orders/')) title = 'Mossy | 판매자 주문상세';
    else if (path.startsWith('/myshop/payout')) title = 'Mossy | 정산내역';
    else if (path.startsWith('/myshop')) title = 'Mossy | 내 상점';

    document.title = title;
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="market" element={<ProductListPage />} />
        <Route path="market/:id" element={<ProductDetailPage />} />
        <Route path="auth/callback" element={<AuthCallbackPage />} />
        <Route path="signup/complete" element={<SignupCompletePage />} />
      </Route>

      {/* Protected Routes - require login */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Layout />}>
          <Route path="cart" element={<CartPage />} />
          <Route path="mypage" element={<MyPage />} />
          <Route path="profile/edit" element={<ProfileEditPage />} />
          <Route path="admin" element={<AdminPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="wallet" element={<WalletPage />} />
          <Route path="seller-request" element={<SellerRequestPage />} />
          <Route path="payment/success" element={<PaymentSuccessPage />} />
          <Route path="payment/fail" element={<PaymentFailPage />} />
        </Route>

        {/* Seller Protected Routes - require SELLER role */}
        <Route element={<SellerProtectedRoute />}>
          <Route path="/myshop" element={<SellerLayout />}>
            <Route index element={<SellerDashboardPage />} />
            <Route path="orders/:id" element={<SellerOrderDetailPage />} />
            <Route path="payout" element={<SellerPayoutPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
