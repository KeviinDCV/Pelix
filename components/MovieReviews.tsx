"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HiChevronLeft, HiChevronRight, HiStar } from "react-icons/hi";
import type { Review, ReviewsResponse } from "@/types/tmdb";

interface ReviewCardProps {
  review: Review;
  index: number;
}

function ReviewCard({ review, index }: ReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = review.content.length > 500;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-black/50 border border-flame/20 rounded-lg p-4 sm:p-6 backdrop-blur-sm"
    >
      <div className="flex items-start gap-3 sm:gap-4 mb-3">
        <div className="flex-shrink-0">
          {review.author_details.avatar_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w45${review.author_details.avatar_path}`}
              alt={review.author_details.name || review.author}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const placeholder = target.nextElementSibling as HTMLElement;
                if (placeholder) placeholder.classList.remove("hidden");
              }}
            />
          ) : null}
          <div
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-flame to-sunset flex items-center justify-center text-lavenderBlush font-bold text-sm sm:text-base ${
              review.author_details.avatar_path ? "hidden" : ""
            }`}
          >
            {(review.author_details.name || review.author)[0].toUpperCase()}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 mb-1">
            <h3 className="text-lavenderBlush font-semibold text-sm sm:text-base">
              {review.author_details.name || review.author}
            </h3>
            {review.author_details.rating && (
              <div className="flex items-center gap-1 text-sunset">
                <HiStar className="w-4 h-4 fill-current" />
                <span className="text-xs sm:text-sm font-medium">
                  {review.author_details.rating}/10
                </span>
              </div>
            )}
          </div>
          <p className="text-gray text-xs sm:text-sm">
            {new Date(review.created_at).toLocaleDateString("es-MX", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
      <div className="mt-3 sm:mt-4">
        <p className="text-lavenderBlush/80 leading-relaxed text-sm sm:text-base whitespace-pre-wrap">
          {shouldTruncate && !isExpanded ? (
            <>
              {review.content.substring(0, 500)}
              <span className="text-sunset">... </span>
              <button
                onClick={() => setIsExpanded(true)}
                className="text-sunset hover:text-flame transition-colors underline cursor-pointer bg-transparent border-none p-0"
              >
                Leer más
              </button>
            </>
          ) : (
            review.content
          )}
        </p>
        {shouldTruncate && isExpanded && (
          <button
            onClick={() => setIsExpanded(false)}
            className="text-sunset hover:text-flame transition-colors underline mt-2 text-sm sm:text-base cursor-pointer bg-transparent border-none p-0"
          >
            Leer menos
          </button>
        )}
      </div>
      {shouldTruncate && (
        <a
          href={review.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 mt-2 text-gray hover:text-sunset transition-colors text-xs sm:text-sm"
        >
          Ver reseña original en TMDB
        </a>
      )}
    </motion.div>
  );
}

interface MovieReviewsProps {
  movieId: number;
}

export default function MovieReviews({ movieId }: MovieReviewsProps) {
  const [reviewsData, setReviewsData] = useState<ReviewsResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      setLoading(true);
      try {
        const response = await fetch(`/api/reviews?movieId=${movieId}&page=${currentPage}`);
        if (response.ok) {
          const data = await response.json();
          setReviewsData(data);
        }
      } catch (error) {
        console.error("Error al obtener reviews:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, [movieId, currentPage]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-6 h-6 border-2 border-sunset border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!reviewsData || reviewsData.results.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray text-base sm:text-lg">
          No hay reseñas disponibles para esta película aún.
        </p>
      </div>
    );
  }

  const totalPages = Math.min(reviewsData.total_pages, 500);
  const reviews = reviewsData.results;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-semibold text-lavenderBlush">
          Reseñas de usuarios ({reviewsData.total_results.toLocaleString()})
        </h2>
      </div>

      <div className="space-y-4">
        {reviews.map((review, index) => (
          <ReviewCard key={review.id} review={review} index={index} />
        ))}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all ${
                currentPage === 1
                  ? "text-gray/50 cursor-not-allowed bg-black/30"
                  : "text-lavenderBlush hover:text-sunset hover:bg-flame/20 bg-black/50 border border-flame/20"
              }`}
            >
              <HiChevronLeft className="w-5 h-5" />
              <span className="text-sm sm:text-base">Anterior</span>
            </button>

            <div className="flex items-center gap-1 sm:gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`min-w-[40px] sm:min-w-[44px] px-2 sm:px-3 py-2 text-center rounded-lg transition-all text-sm sm:text-base ${
                      currentPage === pageNum
                        ? "bg-gradient-to-r from-flame to-sunset text-black font-bold"
                        : "text-lavenderBlush hover:text-sunset hover:bg-flame/20 bg-black/50 border border-flame/20"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all ${
                currentPage === totalPages
                  ? "text-gray/50 cursor-not-allowed bg-black/30"
                  : "text-lavenderBlush hover:text-sunset hover:bg-flame/20 bg-black/50 border border-flame/20"
              }`}
            >
              <span className="text-sm sm:text-base">Siguiente</span>
              <HiChevronRight className="w-5 h-5" />
            </button>
          </div>
          <p className="text-gray text-sm sm:text-base">
            Página {currentPage} de {totalPages}
          </p>
        </div>
      )}
    </div>
  );
}
