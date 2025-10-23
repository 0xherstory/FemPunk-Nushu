'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';

interface ContactInfoProps {
  contactInfo?: {
    email?: string;
    wechat?: string;
    telegram?: string;
    discord?: string;
  };
}

export function ContactInfo({ 
  contactInfo = {
    email: 'hello@fempunk.art',
    wechat: 'FemPunkNuShu',
    telegram: '@FemPunkNuShu',
    discord: 'FemPunk NüShu#1234'
  }
}: ContactInfoProps) {
  
  const handleContactClick = (type: string, value: string) => {
    switch (type) {
      case 'email':
        window.open(`mailto:${value}`, '_blank');
        break;
      case 'wechat':
        // Copy to clipboard for WeChat
        navigator.clipboard.writeText(value);
        alert('微信号已复制到剪贴板');
        break;
      case 'telegram':
        window.open(`https://t.me/${value.replace('@', '')}`, '_blank');
        break;
      case 'discord':
        // Copy to clipboard for Discord
        navigator.clipboard.writeText(value);
        alert('Discord 用户名已复制到剪贴板');
        break;
      default:
        break;
    }
  };

  const contactMethods = [
    {
      type: 'email',
      label: '邮箱联系',
      value: contactInfo.email,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: '商务合作、技术支持'
    },
    {
      type: 'wechat',
      label: '微信联系',
      value: contactInfo.wechat,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 4.882-1.900 7.60.5.5-3.187-2.75-6.874-8.343-6.874zm-3.375 4.25c.48 0 .875.394.875.875s-.394.875-.875.875-.875-.394-.875-.875.394-.875.875-.875zm6.75 0c.48 0 .875.394.875.875s-.394.875-.875.875-.875-.394-.875-.875.394-.875.875-.875z"/>
        </svg>
      ),
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: '快速咨询、社区交流'
    },
    {
      type: 'telegram',
      label: 'Telegram',
      value: contactInfo.telegram,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      ),
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
      description: '国际用户、技术讨论'
    },
    {
      type: 'discord',
      label: 'Discord',
      value: contactInfo.discord,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
        </svg>
      ),
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      description: '社区讨论、开发者交流'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>联系我们</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-gray-600 text-sm">
            有任何问题或建议？欢迎通过以下方式联系我们
          </p>

          {/* Contact Methods */}
          <div className="space-y-3">
            {contactMethods.map((method) => (
              <div
                key={method.type}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${method.bgColor} rounded-lg flex items-center justify-center`}>
                    <span className={method.color}>
                      {method.icon}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{method.label}</p>
                    <p className="text-sm text-gray-500">{method.description}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleContactClick(method.type, method.value || '')}
                  className="text-gray-600 hover:text-gray-800"
                >
                  联系
                </Button>
              </div>
            ))}
          </div>

          {/* Business Cooperation */}
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <h4 className="font-medium text-purple-800 mb-2 flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
              <span>商务合作</span>
            </h4>
            <ul className="space-y-1 text-sm text-purple-700">
              <li>• 艺术机构合作与展览</li>
              <li>• 女书文化推广项目</li>
              <li>• NFT 平台技术合作</li>
              <li>• 品牌联名与营销合作</li>
            </ul>
            <p className="text-xs text-purple-600 mt-2">
              请通过邮箱联系我们，我们会在 24 小时内回复
            </p>
          </div>

          {/* Community Guidelines */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2 flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>社区指南</span>
            </h4>
            <p className="text-sm text-blue-700">
              我们致力于创建一个包容、友善的社区环境。请遵守社区规则，尊重女书文化，共同维护良好的创作氛围。
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}