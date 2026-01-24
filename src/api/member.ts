import client, { type RsData } from './client';

export interface SellerRequestCreateRequest {
    sellerType: "INDIVIDUAL" | "BUSINESS";
    storeName: string;
    businessNum: string;
    representativeName: string;
    contactEmail: string;
    contactPhone: string;
    address1: string;
    address2: string;
    latitude: number;
    longitude: number;
}

export interface UserProfile {
    id: number;
    email: string;
    username: string; // login id
    name: string; // real name
    nickname: string;
    profileImage: string | null;
    createdAt: string;
}

export interface MeResponse {
    userId: number;
    nickname: string;
    username: string;
    status?: string; // "PENDING", "APPROVED", etc. Maps to SellerRequestStatus
}

export const memberApi = {
    getMe: async () => {
        // Supports both legacy (number) and new (MeResponse) format
        const response = await client.get<RsData<number | MeResponse>>('/users/me');
        return response.data;
    },
    requestSeller: async (data: SellerRequestCreateRequest) => {
        const response = await client.post<RsData<number>>('/users/seller-request', data);
        return response.data;
    }
};
