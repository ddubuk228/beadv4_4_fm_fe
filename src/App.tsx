import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProductListPage from './pages/ProductListPage';
import WalletPage from './pages/WalletPage';
import ProductDetailPage from './pages/ProductDetailPage';
import SignupPage from './pages/auth/SignupPage';
import SellerRequestPage from './pages/SellerRequestPage';
import CartPage from './pages/cart/CartPage';
import MyPage from './pages/member/user/MyPage';
import OrdersPage from './pages/order/OrdersPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailPage from './pages/payment/PaymentFailPage';

import AuthCallbackPage from './pages/AuthCallbackPage';
import SignupCompletePage from './pages/SignupCompletePage';
import AdminPage from './pages/AdminPage';
import ProfileEditPage from './pages/ProfileEditPage';
import SellerLayout from './components/layout/SellerLayout';
import SellerDashboardPage from './pages/member/seller/SellerDashboardPage';
import SellerOrderDetailPage from './pages/member/seller/SellerOrderDetailPage';

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
        <Route path="orders/:id" element={<SellerOrderDetailPage />} />
      </Route>
    </Routes>
  );
}

export default App;
