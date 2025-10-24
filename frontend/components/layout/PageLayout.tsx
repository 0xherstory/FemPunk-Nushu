'use client';

import React from 'react';
import { SharedNavigation } from './SharedNavigation';
import styles from './PageLayout.module.css';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  navigationVariant?: 'default' | 'transparent';
  showNavigation?: boolean;
  fullHeight?: boolean;
}

export function PageLayout({ 
  children, 
  className, 
  navigationVariant = 'default',
  showNavigation = true,
  fullHeight = true 
}: PageLayoutProps) {
  return (
    <div className={`${styles.pageLayout} ${fullHeight ? styles.fullHeight : ''} ${className || ''}`}>
      {showNavigation && (
        <SharedNavigation variant={navigationVariant} />
      )}
      <main className={styles.mainContent} role="main">
        {children}
      </main>
    </div>
  );
}