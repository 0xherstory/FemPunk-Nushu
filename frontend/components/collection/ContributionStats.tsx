'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import type { ContributionStats } from '../../lib/hooks/useContributionStats';
import { formatEther } from 'viem';

interface ContributionStatsProps {
  stats: ContributionStats;
  isLoading?: boolean;
}

function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color = 'purple',
  trend 
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color?: 'purple' | 'green' | 'blue' | 'yellow' | 'red';
  trend?: { value: number; isPositive: boolean };
}) {
  const colorClasses = {
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    red: 'bg-red-50 text-red-600 border-red-200',
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
                {icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{title}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                {subtitle && (
                  <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
                )}
              </div>
            </div>
          </div>
          
          {trend && (
            <div className={`flex items-center text-xs ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              <svg 
                className={`w-4 h-4 mr-1 ${trend.isPositive ? '' : 'rotate-180'}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
              </svg>
              {Math.abs(trend.value)}%
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Chart Skeleton */}
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-32"></div>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    </div>
  );
}

export function ContributionStats({ stats, isLoading }: ContributionStatsProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const formatContribution = (value: number) => {
    return value.toFixed(1) + '%';
  };

  const formatStreak = (days: number) => {
    if (days === 0) return '0 天';
    if (days === 1) return '1 天';
    return `${days} 天`;
  };

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="参与作品"
          value={stats.totalArtworks}
          subtitle="总协作作品数"
          color="purple"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
          trend={{ value: 12, isPositive: true }}
        />
        
        <StatCard
          title="平均贡献度"
          value={formatContribution(stats.averageContribution)}
          subtitle="每个作品的平均贡献"
          color="green"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
          trend={{ value: 5, isPositive: true }}
        />
        
        <StatCard
          title="总收益"
          value={`${formatEther(stats.totalValueEarned)} ETH`}
          subtitle="累计获得收益"
          color="blue"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          trend={{ value: 8, isPositive: true }}
        />
        
        <StatCard
          title="活跃连击"
          value={formatStreak(stats.activeStreaks)}
          subtitle="连续参与天数"
          color="yellow"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            </svg>
          }
          trend={{ value: 2, isPositive: true }}
        />
      </div>

      {/* Detailed Stats Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contribution Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              </svg>
              <span>贡献度分析</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">总贡献度</span>
                <span className="font-semibold">{formatContribution(stats.totalContribution)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">平均贡献度</span>
                <span className="font-semibold">{formatContribution(stats.averageContribution)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">拥有颜色数</span>
                <span className="font-semibold">{stats.totalColors} 个</span>
              </div>
              
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>贡献度等级</span>
                  <span>活跃创作者</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                    style={{ width: `${Math.min((stats.averageContribution / 30) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span>活动摘要</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">最后活动</span>
                <span className="font-semibold">
                  {stats.lastActivity 
                    ? stats.lastActivity.toLocaleDateString('zh-CN')
                    : '暂无记录'
                  }
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">连续活跃</span>
                <span className="font-semibold">{formatStreak(stats.activeStreaks)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">创作等级</span>
                <span className="font-semibold text-purple-600">
                  {stats.totalArtworks >= 10 ? '资深创作者' : 
                   stats.totalArtworks >= 5 ? '活跃创作者' : 
                   stats.totalArtworks >= 1 ? '新手创作者' : '观察者'}
                </span>
              </div>
              
              {/* Achievement Badges */}
              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-2">成就徽章</p>
                <div className="flex flex-wrap gap-2">
                  {stats.totalArtworks >= 1 && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                      首次创作
                    </span>
                  )}
                  {stats.totalArtworks >= 5 && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      活跃创作者
                    </span>
                  )}
                  {stats.averageContribution >= 20 && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      高贡献者
                    </span>
                  )}
                  {stats.activeStreaks >= 7 && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                      连击达人
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>快速操作</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="default" size="sm">
              查看今日主题
            </Button>
            <Button variant="outline" size="sm">
              购买更多颜色
            </Button>
            <Button variant="ghost" size="sm">
              分享我的作品
            </Button>
            <Button variant="ghost" size="sm">
              导出贡献证明
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}