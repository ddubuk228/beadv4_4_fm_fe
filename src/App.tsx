import { Routes, Route } from 'react-router-dom';
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
import SellerCouponPage from './pages/member/seller/SellerCouponPage';
import SellerOrderPage from './pages/member/seller/SellerOrderPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="market" element={<ProductListPage />} />
        <Route path="market/:id" element={<ProductDetailPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="mypage" element={<MyPage />} />
        <Route path="profile/edit" element={<ProfileEditPage />} />
        <Route path="admin" element={<AdminPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="wallet" element={<WalletPage />} />
        <Route path="seller-request" element={<SellerRequestPage />} />
        <Route path="payment/success" element={<PaymentSuccessPage />} />
        <Route path="payment/fail" element={<PaymentFailPage />} />
        <Route path="auth/callback" element={<AuthCallbackPage />} />
        <Route path="signup/complete" element={<SignupCompletePage />} />
      </Route>

      <Route path="/myshop" element={<SellerLayout />}>
        <Route index element={<SellerDashboardPage />} />
        <Route path="orders" element={<SellerOrderPage />} />
        <Route path="orders/:id" element={<SellerOrderDetailPage />} />
        <Route path="coupons" element={<SellerCouponPage />} />
      </Route>
    </Routes>
  );
}

export default App;
