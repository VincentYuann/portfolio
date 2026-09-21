import React from 'react';
import { Skeleton } from '../ui/skeleton';
import { CornerBrackets } from './CornerBrackets';

/**
 * Skeleton Loader for the All Projects Archive View (/portfolio#projects)
 */
export const ProjectsPageSkeleton: React.FC = () => {
  return (
    <div className="relative w-full min-h-screen overflow-x-clip">
      <div className="w-full pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-in fade-in duration-300">
        {/* Back navigation skeleton */}
        <div className="mb-6 sm:mb-8">
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>

        {/* Page Header */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="h-4 w-32 rounded" />
          </div>
          <Skeleton className="h-10 sm:h-12 w-64 sm:w-80 rounded-lg mb-3" />
          <Skeleton className="h-4 sm:h-5 w-full max-w-xl rounded" />
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-8 sm:mb-10 max-w-md">
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>

        {/* Projects Grid: 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-light-surface-card/90 dark:bg-dark-surface/90 border border-light-border dark:border-dark-border rounded-xl p-5 sm:p-6 classical-card-frame relative flex flex-col justify-between"
            >
              <CornerBrackets size="sm" />
              <div>
                {/* Image Aspect Box */}
                <Skeleton className="aspect-[16/9] w-full rounded-lg mb-4" />

                {/* Timeline Strip */}
                <div className="flex items-center justify-between mb-2">
                  <Skeleton className="h-3.5 w-24 rounded" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>

                {/* Title & Kanji */}
                <div className="flex items-center justify-between mb-2">
                  <Skeleton className="h-6 w-3/4 rounded" />
                  <Skeleton className="h-6 w-6 rounded" />
                </div>

                {/* Description lines */}
                <div className="space-y-1.5 mb-4">
                  <Skeleton className="h-3.5 w-full rounded" />
                  <Skeleton className="h-3.5 w-5/6 rounded" />
                </div>
              </div>

              {/* Tech Tags & Bottom Actions */}
              <div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  <Skeleton className="h-5 w-14 rounded" />
                  <Skeleton className="h-5 w-16 rounded" />
                  <Skeleton className="h-5 w-12 rounded" />
                </div>
                <div className="pt-3 border-t border-light-border/40 dark:border-dark-border/40 flex items-center justify-between">
                  <Skeleton className="h-4 w-28 rounded" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-6 rounded" />
                    <Skeleton className="h-6 w-6 rounded" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton Loader for the Hobbies & Interests Archive View (/portfolio#hobbies)
 */
export const HobbiesPageSkeleton: React.FC = () => {
  return (
    <div className="relative w-full min-h-screen overflow-x-clip">
      <div className="w-full pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-in fade-in duration-300">
        {/* Back navigation */}
        <div className="mb-6 sm:mb-8">
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>

        {/* Page Header */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="h-4 w-36 rounded" />
          </div>
          <Skeleton className="h-10 sm:h-12 w-72 rounded-lg mb-3" />
          <Skeleton className="h-4 sm:h-5 w-full max-w-lg rounded" />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8 sm:mb-10">
          <Skeleton className="h-8 w-20 rounded-lg" />
          <Skeleton className="h-8 w-24 rounded-lg" />
          <Skeleton className="h-8 w-24 rounded-lg" />
          <Skeleton className="h-8 w-28 rounded-lg" />
        </div>

        {/* Hobby Cards Grid: 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-light-surface-card/90 dark:bg-dark-surface/90 border border-light-border dark:border-dark-border rounded-xl p-5 sm:p-7 classical-card-frame relative flex flex-col justify-between"
            >
              <CornerBrackets size="md" />
              <div>
                {/* Header Strip */}
                <div className="flex items-start justify-between pb-3 mb-4 border-b border-light-border/60 dark:border-dark-border/60">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Skeleton className="h-3 w-16 rounded" />
                      <Skeleton className="h-4 w-20 rounded" />
                    </div>
                    <Skeleton className="h-7 w-44 rounded" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded" />
                </div>

                {/* Photo Gallery Grid */}
                <div className="grid grid-cols-12 gap-2 h-44 sm:h-52 mb-4">
                  <Skeleton className="col-span-8 sm:col-span-9 h-full rounded-lg" />
                  <div className="col-span-4 sm:col-span-3 flex flex-col gap-1.5 h-full">
                    <Skeleton className="flex-1 rounded-md" />
                    <Skeleton className="flex-1 rounded-md" />
                  </div>
                </div>

                {/* Narrative */}
                <div className="space-y-1.5 mb-4">
                  <Skeleton className="h-3.5 w-full rounded" />
                  <Skeleton className="h-3.5 w-4/5 rounded" />
                </div>
              </div>

              {/* Metadata Pills */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-light-border/40 dark:border-dark-border/40">
                <Skeleton className="h-6 w-32 rounded-lg" />
                <Skeleton className="h-6 w-28 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton Loader for the Resume & CV View (/portfolio#resume)
 */
export const ResumePageSkeleton: React.FC = () => {
  return (
    <div className="relative w-full min-h-screen overflow-x-clip">
      <div className="w-full pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto animate-in fade-in duration-300">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <Skeleton className="h-9 w-28 rounded-lg" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-28 rounded-lg" />
            <Skeleton className="h-9 w-28 rounded-lg" />
          </div>
        </div>

        {/* View Mode Toggle Tabs */}
        <div className="flex justify-center mb-6">
          <Skeleton className="h-10 w-56 rounded-lg" />
        </div>

        {/* Document Silhouette Card */}
        <div className="bg-light-surface-card/90 dark:bg-dark-surface/90 border border-light-border dark:border-dark-border rounded-xl p-6 sm:p-10 classical-card-frame relative min-h-[600px] flex flex-col gap-6">
          <CornerBrackets size="lg" />

          {/* Resume Header Area */}
          <div className="flex flex-col items-center gap-2 pb-6 border-b border-light-border/60 dark:border-dark-border/60">
            <Skeleton className="h-8 w-48 rounded" />
            <Skeleton className="h-4 w-72 rounded" />
            <Skeleton className="h-3.5 w-96 rounded" />
          </div>

          {/* Resume Section Blocks */}
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-5 w-36 rounded" />
              <div className="space-y-2 pl-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-40 rounded" />
                  <Skeleton className="h-4 w-24 rounded" />
                </div>
                <Skeleton className="h-3.5 w-full rounded" />
                <Skeleton className="h-3.5 w-5/6 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton Loader for the Admin Studio View (/portfolio#edit)
 */
export const AdminStudioSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-light-canvas dark:bg-dark-canvas text-light-ink dark:text-dark-ink pt-20 animate-in fade-in duration-300">
      {/* Top Header Bar */}
      <div className="border-b border-light-border dark:border-dark-border bg-light-surface/80 dark:bg-dark-surface/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-24 rounded-lg" />
          <Skeleton className="h-6 w-32 rounded" />
        </div>
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>

      {/* Main Layout: Sidebar + Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-3 space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-11 w-full rounded-lg" />
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9 space-y-6">
          <div className="bg-light-surface-card dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xl p-6 relative">
            <CornerBrackets size="md" />
            <div className="space-y-4">
              <Skeleton className="h-7 w-48 rounded" />
              <Skeleton className="h-4 w-72 rounded mb-6" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
              <Skeleton className="h-28 w-full rounded-lg" />
              <div className="flex justify-end gap-2 pt-4">
                <Skeleton className="h-9 w-24 rounded-lg" />
                <Skeleton className="h-9 w-28 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton Loader for the Login Modal / View (/portfolio#login)
 */
export const LoginPageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-24 pb-12 animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-light-surface-card dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-2xl p-8 relative">
        <CornerBrackets size="lg" />
        <div className="flex flex-col items-center gap-4 text-center">
          <Skeleton className="w-16 h-16 rounded-full mb-2" />
          <Skeleton className="h-7 w-48 rounded" />
          <Skeleton className="h-4 w-64 rounded mb-4" />
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
};
