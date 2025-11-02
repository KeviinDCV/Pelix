"use client";

import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function MovieCardSkeleton() {
  return (
    <SkeletonTheme baseColor="#1a1a1a" highlightColor="#2a2a2a">
      <div className="bg-black/50 border border-flame/10 rounded-xl overflow-hidden">
        <Skeleton height={450} className="aspect-[2/3]" />
        <div className="p-4 space-y-2">
          <Skeleton height={20} width="80%" />
          <div className="flex items-center justify-between">
            <Skeleton height={16} width={60} />
            <Skeleton height={16} width={80} />
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
}

