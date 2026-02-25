import client, { type RsData } from './client';

export interface UserCouponResponse {
    userCouponId: number;
    couponId: number;
    couponName: string;
    couponType: 'PERCENTAGE' | 'FIXED';
    discountValue: number;
    maxDiscountAmount: number | null;
    endAt: string;
    status: 'UNUSED' | 'USED' | 'EXPIRED';
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
    }
};
