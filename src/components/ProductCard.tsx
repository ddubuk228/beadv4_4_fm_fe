import React from 'react';
import { Link } from 'react-router-dom';
import { FaLeaf, FaShoppingBag, FaHeart, FaTruck } from 'react-icons/fa';
import type { ProductResponse } from '../api/market';

interface ProductCardProps {
    product: ProductResponse;
    onAddToCart?: (e: React.MouseEvent, productId: number) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
    // Extended Interface for UI Demo (Badges)
    // In a real app, these would come from the backend `product.badges`
    const isEco = product.id % 2 === 0; // Mock logic
    const isDonation = product.id % 3 === 0; // Mock logic
    const discount = product.id % 5 === 0 ? 10 + (product.id % 3) * 5 : 0; // Mock logic

    return (
        <Link
            to={`/market/${product.id}`}
            className="group block bg-white rounded-2xl overflow-hidden border border-transparent hover:border-[var(--primary-color)] hover:shadow-xl transition-all duration-300 h-full flex flex-col relative"
        >
            {/* Thumbnail Area */}
            <div className="relative aspect-[4/5] bg-[#F9F9F7] overflow-hidden">
                {product.thumbnail ? (
                    <img
                        src={product.thumbnail}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                        }}
                    />
                ) : null}

                {/* Fallback Image */}
                <div className={`absolute inset-0 flex flex-col items-center justify-center text-slate-300 bg-[#F9F9F7] ${product.thumbnail ? 'hidden' : ''}`}>
                    <FaLeaf className="text-4xl opacity-20 mb-2" />
                    <span className="text-xs font-medium uppercase tracking-widest opacity-40">No Image</span>
                </div>

                {/* Hover Action: Add to Cart */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                    <button
                        onClick={(e) => onAddToCart && onAddToCart(e, product.id)}
                        className="bg-white text-[var(--primary-color)] font-bold py-3 px-6 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-2 hover:bg-[var(--primary-color)] hover:text-white"
                    >
                        <FaShoppingBag />
                        장바구니 담기
                    </button>
                </div>

                {/* Top Right Badges (Delivery) */}
                <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
                    <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-slate-600 shadow-sm border border-slate-100 flex items-center gap-1">
                        <FaTruck className="text-[10px]" /> 당일배송
                    </span>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-5 flex-1 flex flex-col">
                {/* Eco & Donation Badges - Prominent placement */}
                <div className="flex flex-wrap gap-2 mb-3">
                    {isEco && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-wide border border-green-100">
                            <FaLeaf className="text-[9px]" /> CO₂ -30%
                        </span>
                    )}
                    {isDonation && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-orange-50 text-orange-600 text-[10px] font-bold uppercase tracking-wide border border-orange-100">
                            <FaHeart className="text-[9px]" /> 10% Donated
                        </span>
                    )}
                </div>

                {/* Seller / Brand Name */}
                <div className="mb-1 text-xs font-bold text-slate-400 uppercase tracking-wider truncate">
                    {product.brand || 'Eco Seller'}
                </div>

                {/* Product Name */}
                <h3 className="text-base font-medium text-slate-800 leading-snug line-clamp-2 mb-1 group-hover:text-[var(--primary-color)] transition-colors">
                    {product.name}
                </h3>

                {/* Description (Optional) */}
                <p className="text-xs text-slate-400 line-clamp-1 mb-4 font-light">
                    {product.description || '지속 가능한 일상을 위한 선택'}
                </p>

                {/* Price Area */}
                <div className="mt-auto flex items-end gap-2">
                    <span className="text-lg font-bold text-slate-900">
                        {product.minPrice?.toLocaleString() || 0}원
                    </span>
                    {discount > 0 && (
                        <>
                            <span className="text-sm text-slate-400 line-through">
                                {Math.round(product.minPrice * (1 + discount / 100)).toLocaleString()}
                            </span>
                            <span className="text-sm font-bold text-red-500 mb-[2px]">
                                {discount}%
                            </span>
                        </>
                    )}
                </div>
            </div>
        </Link>
    );
};
