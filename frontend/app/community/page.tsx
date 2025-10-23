'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { NavigationBar } from '../../components/navigation/NavigationBar';
import { DevelopmentPlaceholder, QRCodeDisplay, ContactInfo } from '../../components/community';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export default function CommunityPage() {
  const router = useRouter();

  const handleBackToCanvas = () => {
    router.push('/canvas');
  };

  return (
    <>
      <NavigationBar currentPage="community" />
      
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              社区
            </h1>
            <p className="text-gray-600">
              加入 FemPunk NüShu 社区，获取最新活动信息和邀请码
            </p>
          </div>

          {/* Development Status */}
          <div className="mb-8">
            <DevelopmentPlaceholder />
          </div>

          {/* Community Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* QR Code Section */}
            <div>
              <QRCodeDisplay />
            </div>

            {/* Contact Information */}
            <div>
              <ContactInfo />
            </div>
          </div>

          {/* Back to Canvas Action */}
          <div className="text-center">
            <Card className="max-w-md mx-auto">
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5H9a2 2 0 00-2 2v12a4 4 0 004 4h6a2 2 0 002-2V7a2 2 0 00-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    开始创作
                  </h3>
                  <p className="text-gray-600 text-sm">
                    返回画布页面，与其他艺术家一起创作女书主题作品
                  </p>
                </div>
                <Button 
                  variant="default" 
                  onClick={handleBackToCanvas}
                  className="w-full"
                >
                  返回画布
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}