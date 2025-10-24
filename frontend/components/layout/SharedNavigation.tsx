'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAccount } from 'wagmi';
import Image from 'next/image';
import { WalletModal } from '../wallet/WalletModal';
import { useWalletModal } from '../../lib/hooks/useWalletModal';
import styles from './SharedNavigation.module.css';

interface NavigationItem {
  label: string;
  path: string;
  key: string;
}

interface SharedNavigationProps {
  className?: string;
  variant?: 'default' | 'transparent';
}

const navigationItems: NavigationItem[] = [
  { label: 'PAINT', path: '/canvas', key: 'paint' },
  { label: 'COLOR', path: '/buy', key: 'color' },
  { label: 'GALLERY', path: '/gallery', key: 'gallery' },
];

export function SharedNavigation({ className, variant = 'default' }: SharedNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { address, isConnected } = useAccount();
  const { modalState, openModal: openWalletModal, closeModal: closeWalletModal } = useWalletModal();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const getActiveKey = () => {
    if (pathname === '/canvas') return 'paint';
    if (pathname === '/buy') return 'color';
    if (pathname === '/gallery') return 'gallery';
    return '';
  };

  const activeKey = getActiveKey();

  return (
    <>
      <nav className={`${styles.navbar} ${styles[variant]} ${className || ''}`}>
        <div className={styles.navbarBackdrop} />
        <div className={styles.navbarContent}>
          <div className={styles.navbarLeft}>
            <button 
              onClick={() => handleNavigation('/')} 
              className={styles.logo}
              aria-label="Go to homepage"
            >
              <Image
                src="https://www.figma.com/api/mcp/asset/622cce7a-4e71-4086-8741-d8b730ba1fc5"
                alt="FemPunk Logo"
                width={18}
                height={41}
                priority
              />
              <Image
                src="https://www.figma.com/api/mcp/asset/749ee3d3-6def-4d3e-819a-a97f6a89ad0f"
                alt="FemPunk Text"
                width={140}
                height={45}
                priority
              />
            </button>
            
            <nav className={styles.navLinks} role="navigation" aria-label="Main navigation">
              {navigationItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleNavigation(item.path)}
                  className={`${styles.navLink} ${activeKey === item.key ? styles.navLinkActive : ''}`}
                  aria-current={activeKey === item.key ? 'page' : undefined}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
          
          <div className={styles.navbarRight}>
            <button 
              className={styles.connectButton}
              onClick={isConnected ? () => {} : () => openWalletModal()}
              aria-label={isConnected ? `Connected: ${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Connect wallet'}
            >
              <Image
                src="https://www.figma.com/api/mcp/asset/b4771eab-5ce8-4d52-bfd5-aa543a398bc4"
                alt=""
                width={20}
                height={20}
                aria-hidden="true"
              />
              <span>
                {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Connect'}
              </span>
            </button>
          </div>
        </div>
      </nav>

      <WalletModal 
        isOpen={modalState.isOpen}
        onClose={closeWalletModal}
      />
    </>
  );
}