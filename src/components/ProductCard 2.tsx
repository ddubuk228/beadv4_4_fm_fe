import React from 'react';
import { Link } from 'react-router-dom';
import { FaLeaf } from 'react-icons/fa';
import type { ProductResponse } from '../api/market';

interface ProductCardProps {
    product: ProductResponse;
    onAddToCart: (e: React.MouseEvent, productId: number) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
    return (
        <Link
            to={`/market/${product.productId}`}
            className="group block bg-surface-color rounded-2xl overflow-hidden border border-border-color hover:border-primary-color hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col"
        >
            <div className="relative aspect-[4/5] bg-stone-50 overflow-hidden">
                {product.imageUrls && product.imageUrls.length > 0 ? (
                    <img
                        src={product.imageUrls[0]}
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
                <div className={`absolute inset-0 flex flex-col items-center justify-center text-secondary-color bg-stone-50 ${product.imageUrls && product.imageUrls.length > 0 ? 'hidden' : ''}`}>
                    <FaLeaf className="text-4xl opacity-20 mb-2" />
                    <span className="text-xs font-medium uppercase tracking-widest opacity-40">No Image</span>
                </div>

                {/* Quick Action Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/50 to-transparent flex justify-center">
                    <button
                        onClick={(e) => onAddToCart(e, product.productId)}
                        className="bg-white text-text-main text-sm font-bold px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-transform active:scale-95 flex items-center gap-2 cursor-pointer"
                    >
                        <span>+ Add to Cart</span>
                    </button>
                </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-serif font-medium text-text-main line-clamp-2 group-hover:text-primary-color transition-colors">{product.name}</h3>
                </div>
                <div className="mt-auto flex justify-between items-end">
                    <p className="text-lg font-bold text-primary-color">{product.price.toLocaleString()}원</p>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-success-color bg-green-50 px-2 py-1 rounded-sm">Free Shipping</span>
                </div>
            </div>
        </Link>
    );
};
