import React from 'react';
import { Link } from 'react-router-dom';
import { FaLeaf } from 'react-icons/fa';
import type { ProductResponse } from '../api/market';

interface ProductCardProps {
    product: ProductResponse;
    onAddToCart?: (e: React.MouseEvent, productId: number) => void;
}

export const ProductCard = ({ product }: ProductCardProps) => {
    return (
        <Link
            to={`/market/${product.id}`}
            className="group block bg-surface-color rounded-2xl overflow-hidden border border-border-color hover:border-primary-color hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col"
        >
            <div className="relative aspect-[4/5] bg-stone-50 overflow-hidden">
                {product.thumbnail ? (
                    <img
                        src={product.thumbnail}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden'); // Show fallback
                        }}
                    />
                ) : null}

                {/* Fallback for no image or error */}
                <div className={`absolute inset-0 flex flex-col items-center justify-center text-secondary-color bg-stone-50 ${product.thumbnail ? 'hidden' : ''}`}>
                    <FaLeaf className="text-4xl opacity-20 mb-2" />
                    <span className="text-xs font-medium uppercase tracking-widest opacity-40">No Image</span>
                </div>

            </div>

            <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-serif font-medium text-text-main line-clamp-2 group-hover:text-primary-color transition-colors">{product.name}</h3>
                </div>
                <div className="mt-auto flex justify-between items-end">
                    <p className="text-lg font-bold text-primary-color">{product.minPrice?.toLocaleString() || 0}원</p>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-success-color bg-green-50 px-2 py-1 rounded-sm">Free Shipping</span>
                </div>
            </div>
        </Link>
    );
};
