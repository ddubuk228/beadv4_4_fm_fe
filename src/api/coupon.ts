import client, { type RsData } from './client';

export type CouponType = 'PERCENTAGE' | 'FIXED';

export interface UserCouponResponse {
    userCouponId: number;
    couponId: number;
    couponName: string;
    couponType: CouponType;
    discountValue: number;
    maxDiscountAmount: number | null;
    endAt: string;
    status: 'UNUSED' | 'USED' | 'EXPIRED';
}

export interface SellerCouponListResponse {
    couponId: number;
    productItemId: number;
    couponName: string;
    couponType: CouponType;
    discountValue: number;
    maxDiscountAmount: number | null;
    startAt: string;
    endAt: string;
    isActive: boolean;
    createdAt: string;
}

export interface CouponCreateRequest {
    productItemId: number;
    couponName: string;
    couponType: CouponType;
    discountValue: number;
    maxDiscountAmount: number | null;
    startAt: string;
    endAt: string;
}

export interface PageData<T> {
    content: T[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: { empty: boolean; sorted: boolean; unsorted: boolean };
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    last: boolean;
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    sort: { empty: boolean; sorted: boolean; unsorted: boolean };
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}

export const couponApi = {
    getMyCoupons: async (page: number = 0, size: number = 20, status?: 'UNUSED' | 'USED' | 'EXPIRED') => {
        const response = await client.get<RsData<PageData<UserCouponResponse>>>('/coupons/me', {
            params: {
                page,
                size,
                status,
                sort: 'createdAt,desc'
            }
        });
        return response.data;
    },

    // 판매자 쿠폰 생성
    createSellerCoupon: async (sellerId: number, data: CouponCreateRequest) => {
        const response = await client.post<RsData<number>>('/coupons/seller', data, {
            headers: {
                'X-Seller-Id': sellerId.toString()
            }
        });
        return response.data;
    },

    // 판매자 쿠폰 목록 조회
    getSellerCoupons: async (sellerId: number) => {
        const response = await client.get<RsData<SellerCouponListResponse[]>>('/coupons/seller/my', {
            headers: {
                'X-Seller-Id': sellerId.toString()
            }
        });
        return response.data;
    },

    // 판매자 쿠폰 비활성화
    deactivateSellerCoupon: async (sellerId: number, couponId: number) => {
        const response = await client.patch<RsData<void>>(`/coupons/seller/${couponId}/deactivate`, undefined, {
            headers: {
                'X-Seller-Id': sellerId.toString()
            }
        });
        return response.data;
    }
};
