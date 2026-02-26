import client, { type RsData } from './client';

export interface PayoutResponseDto {
    id: number;
    status: string; // 'CREDITED' | 'COMPLETED'
    amount: number;
    payoutDate: string;
    creditDate: string;
}

export interface PayoutSummary {
    totalAmount: number;
    creditedAmount: number;
    pendingCreditAmount: number;
}

export interface PayoutListResponseDto {
    summary: PayoutSummary;
    payouts: PayoutResponseDto[];
}

export const payoutApi = {
    // Get monthly payouts for the seller
    getMonthlyPayouts: async (year?: number, month?: number) => {
        const params: any = {};
        if (year) params.year = year;
        if (month) params.month = month;

        // Note: X-User-Id header is implicitly passed if backend relies on JWT instead,
        // or frontend needs to manually set it. Assuming the API might use the token or requires explicit header.
        // I will add the header just in case, using localStorage for userId if available, but usually the backend extracts it from the JWT.
        // Wait, the backend shows @RequestHeader("X-User-Id") Long userId. This usually means the API gateway sets it.
        // If the frontend calls gateway directly, gateway extracts userId from JWT and sets X-User-Id.
        // We will just call the endpoint.
        const response = await client.get<RsData<PayoutListResponseDto>>('/payouts', {
            params,
        });
        
        return response.data;
    }
}
