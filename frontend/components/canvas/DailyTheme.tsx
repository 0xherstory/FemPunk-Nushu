'use client';

import { Card } from '../ui/Card';
import type { DailyTheme as DailyThemeType } from '../../types';

interface DailyThemeProps {
  theme: DailyThemeType;
}

export function DailyTheme({ theme }: DailyThemeProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  return (
    <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
      <div className="text-center">
        {/* Date */}
        <div className="text-sm text-purple-600 font-medium mb-2">
          {formatDate(theme.date)}
        </div>

        {/* Theme Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          {theme.title}
        </h2>
        
        {/* English Title */}
        <p className="text-lg text-gray-600 mb-4 italic">
          {theme.titleEn}
        </p>

        {/* Decorative Line */}
        <div className="flex items-center justify-center mb-4">
          <div className="h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent w-full max-w-32"></div>
          <div className="mx-3">
            <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent w-full max-w-32"></div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-700 leading-relaxed">
          {theme.description}
        </p>

        {/* Theme Badge */}
        <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm font-medium">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5H9a2 2 0 00-2 2v12a4 4 0 004 4h6a2 2 0 002-2V7a2 2 0 00-2-2z" />
          </svg>
          今日主题
        </div>
      </div>
    </Card>
  );
}