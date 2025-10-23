'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useAccount } from 'wagmi';
import { WalletStatus } from '../wallet/WalletStatus';

interface NavigationBarProps {
  currentPage?: 'canvas' | 'buy' | 'collection' | 'community';
}

const navigationItems = [
  {
    id: 'canvas',
    label: '画布',
    path: '/canvas',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5H9a2 2 0 00-2 2v12a4 4 0 004 4h6a2 2 0 002-2V7a2 2 0 00-2-2z" />
      </svg>
    ),
  },
  {
    id: 'buy',
    label: '购买',
    path: '/buy',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
      </svg>
    ),
  },
  {
    id: 'collection',
    label: '藏品',
    path: '/collection',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    id: 'community',
    label: '社区',
    path: '/community',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
];

export function NavigationBar({ currentPage }: NavigationBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isConnected } = useAccount();

  // Determine current page from pathname if not provided
  const activePage = currentPage || (() => {
    if (pathname.startsWith('/canvas')) return 'canvas';
    if (pathname.startsWith('/buy')) return 'buy';
    if (pathname.startsWith('/collection')) return 'collection';
    if (pathname.startsWith('/community')) return 'community';
    return 'canvas';
  })();

  const handleNavigation = (path: string, pageId: string) => {
    // Special handling for collection page - require wallet connection
    if (pageId === 'collection' && !isConnected) {
      // Could trigger wallet modal here
      return;
    }
    
    router.push(path);
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <button
              onClick={() => router.push('/')}
              className="flex items-center space-x-2 text-xl font-bold text-gray-800 hover:text-purple-600 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">女</span>
              </div>
              <span>FemPunk NüShu</span>
            </button>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-1">
            {navigationItems.map((item) => {
              const isActive = activePage === item.id;
              const isDisabled = item.id === 'collection' && !isConnected;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path, item.id)}
                  disabled={isDisabled}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                    ${isActive 
                      ? 'bg-purple-100 text-purple-700 shadow-sm' 
                      : isDisabled
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                    }
                  `}
                  title={isDisabled ? '请先连接钱包' : undefined}
                >
                  <span className={isActive ? 'text-purple-600' : ''}>{item.icon}</span>
                  <span>{item.label}</span>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                  )}
                  
                  {/* Disabled indicator */}
                  {isDisabled && (
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>

          {/* Wallet Status */}
          <div className="flex items-center">
            <WalletStatus />
          </div>
        </div>
      </div>

      {/* Mobile Navigation (for smaller screens) */}
      <div className="md:hidden border-t border-gray-200">
        <div className="flex justify-around py-2">
          {navigationItems.map((item) => {
            const isActive = activePage === item.id;
            const isDisabled = item.id === 'collection' && !isConnected;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path, item.id)}
                disabled={isDisabled}
                className={`
                  flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-xs font-medium transition-all
                  ${isActive 
                    ? 'text-purple-700' 
                    : isDisabled
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 hover:text-gray-800'
                  }
                `}
              >
                <span className={`${isActive ? 'text-purple-600' : ''} ${isDisabled ? 'opacity-50' : ''}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {isActive && <div className="w-1 h-1 bg-purple-600 rounded-full"></div>}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}