'use client';

import React from 'react';
import { cn } from '../../lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export function Skeleton({ 
  className, 
  variant = 'rectangular',
  width,
  height,
  lines = 1,
}: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700';
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              baseClasses,
              variantClasses.text,
              'h-4',
              index === lines - 1 ? 'w-3/4' : 'w-full'
            )}
            style={{ width, height }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        variant === 'text' && 'h-4',
        variant === 'circular' && 'w-10 h-10',
        variant === 'rectangular' && 'h-20',
        className
      )}
      style={{ width, height }}
    />
  );
}

// Predefined skeleton components for common use cases

export function ArtworkCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <Skeleton className="w-full h-48" />
      <div className="p-4 space-y-3">
        <Skeleton variant="text" className="h-5 w-3/4" />
        <Skeleton variant="text" className="h-4 w-1/2" />
        <div className="flex items-center justify-between">
          <Skeleton variant="text" className="h-4 w-1/3" />
          <Skeleton className="h-8 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ColorNFTSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3">
      <Skeleton variant="circular" className="w-12 h-12 mx-auto mb-2" />
      <Skeleton variant="text" className="h-3 w-16 mx-auto" />
    </div>
  );
}

export function UserProfileSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-4 mb-6">
        <Skeleton variant="circular" className="w-16 h-16" />
        <div className="flex-1">
          <Skeleton variant="text" className="h-6 w-32 mb-2" />
          <Skeleton variant="text" className="h-4 w-48" />
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="text-center">
            <Skeleton variant="text" className="h-8 w-12 mx-auto mb-1" />
            <Skeleton variant="text" className="h-4 w-16 mx-auto" />
          </div>
        ))}
      </div>
      
      <Skeleton variant="text" lines={3} />
    </div>
  );
}

export function NavigationSkeleton() {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <div className="flex items-center gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-6 w-16" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function CanvasSkeleton() {
  return (
    <div className="flex h-screen">
      {/* Canvas area */}
      <div className="flex-1 p-4">
        <Skeleton className="w-full h-full rounded-lg" />
      </div>
      
      {/* Sidebar */}
      <div className="w-80 bg-white border-l border-gray-200 p-4">
        <div className="space-y-6">
          {/* Theme section */}
          <div>
            <Skeleton variant="text" className="h-6 w-24 mb-3" />
            <Skeleton className="w-full h-32 rounded-lg mb-2" />
            <Skeleton variant="text" lines={2} />
          </div>
          
          {/* Color palette */}
          <div>
            <Skeleton variant="text" className="h-6 w-20 mb-3" />
            <div className="grid grid-cols-6 gap-2">
              {Array.from({ length: 12 }).map((_, index) => (
                <Skeleton key={index} variant="circular" className="w-8 h-8" />
              ))}
            </div>
          </div>
          
          {/* Tools */}
          <div>
            <Skeleton variant="text" className="h-6 w-16 mb-3" />
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="w-10 h-10 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ArtworkGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ArtworkCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function ColorGridSkeleton({ count = 24 }: { count?: number }) {
  return (
    <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-3">
      {Array.from({ length: count }).map((_, index) => (
        <ColorNFTSkeleton key={index} />
      ))}
    </div>
  );
}