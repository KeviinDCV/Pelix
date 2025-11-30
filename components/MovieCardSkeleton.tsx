"use client";

import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function MovieCardSkeleton() {
  return (
    <SkeletonTheme baseColor="hsl(220 5% 15%)" highlightColor="hsl(220 5% 20%)">
      <div className="aspect-[2/3] bg-secondary/20">
        <Skeleton height="100%" className="!rounded-none" />
      </div>
    </SkeletonTheme>
  );
}

