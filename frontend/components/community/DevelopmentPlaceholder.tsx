'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

export function DevelopmentPlaceholder() {
  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-amber-800">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span>功能开发中</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-amber-700">
            社区功能正在积极开发中，敬请期待！
          </p>
          
          <div className="bg-white rounded-lg p-4 border border-amber-200">
            <h4 className="font-medium text-amber-800 mb-2">即将推出的功能：</h4>
            <ul className="space-y-2 text-sm text-amber-700">
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                <span>社区作品展示和投票</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                <span>艺术家排行榜和成就系统</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                <span>女书文化学习资源</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                <span>创作挑战和活动</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                <span>社区讨论和交流</span>
              </li>
            </ul>
          </div>

          <div className="flex items-center space-x-2 text-sm text-amber-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>关注我们的公众号获取最新开发进展</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}