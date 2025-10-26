'use client';

import React from 'react';
import Image from 'next/image';
import styles from './HomePage.module.css';

/**
 * FemPunk Nvshu - Home Page Component
 * Design: 首页 (Homepage)
 * Node ID: 70:1809
 * 
 * 严格按照Figma设计规范实现，包含所有装饰层和精确定位
 */

interface HomePageProps {
  className?: string;
  onStartPainting?: () => void;
  onViewAllArtworks?: () => void;
  onBuyArtwork?: (artworkId: string) => void;
  onMintArtwork?: (artworkId: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({
  className,
  onStartPainting,
  onViewAllArtworks,
  onBuyArtwork,
  onMintArtwork,
}) => {
  return (
    <div
      className={`${styles.container} ${className || ''}`}
      data-name="首页"
      data-node-id="70:1809"
    >
      {/* ============================================
           背景装饰层 - 严格按照Figma规范
           ============================================ */}
      <div className={styles.backgroundLayers}>
        {/* 主背景图片 */}
        <div className={styles.bgMainImage}>
          <Image
            src="/images/homepage/top_bg.png"
            alt=""
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>

        {/* 第二背景层 */}
        <div className={styles.bgSecondLayer}>
          <Image
            src="/images/homepage/second_bg.png"
            alt=""
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>

        {/* 左侧装饰图片 */}
        <div className={styles.leftDecorGroup}>
          <div className={styles.leftImg1}>
            <img
              src="/images/homepage/left_img1.png"
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
          <div className={styles.leftImg2}>
            <img
              src="/images/homepage/left_img2.png"
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
        </div>

        {/* 右侧装饰图片 */}
        <div className={styles.rightDecorGroup}>
          <div className={styles.rightImg1}>
            <img
              src="/images/homepage/right_img1.png"
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
          <div className={styles.rightImg2}>
            <img
              src="/images/homepage/right_img2.png"
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
        </div>

        {/* 边框装饰 */}
        <div className={styles.frameDecor}>
          <Image
            src="/images/homepage/kuang.png"
            alt=""
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>
      </div>

      {/* ============================================
           导航栏
           ============================================ */}
      <nav className={styles.navbar} data-node-id="97:2123">
        <div className={styles.navbarContent}>
          <div className={styles.navbarLeft}>
            <div className={styles.logo}>
              <span style={{ color: '#1ee11f', fontWeight: 'bold', fontSize: '24px' }}>FemPunk</span>
            </div>
            <a href="#" className={styles.navLink}>PAINT</a>
            <a href="#" className={styles.navLink}>COLOR</a>
            <a href="#" className={styles.navLink}>GALLERY</a>
            <a href="#" className={styles.navLink}>COLLECT</a>
          </div>
          <div className={styles.navbarRight}>
            <button className={styles.connectButton}>
              <span>💳</span>
              <span>Connect</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ============================================
           Hero Section
           ============================================ */}
      <section className={styles.heroSection}>
        <div className={styles.heroTitle} data-node-id="127:5649">
          <h1 style={{ 
            fontSize: '4rem', 
            fontWeight: 'bold', 
            textAlign: 'center',
            background: 'linear-gradient(45deg, #1ee11f, #7b2eff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0
          }}>
            Nvshu Reborn<br />Art Co-creation
          </h1>
        </div>

        <div className={styles.heroSubtitles}>
          <p className={styles.heroSubtitle1}>Through decentralized collaboration,</p>
          <p className={styles.heroSubtitle2}>the ancient script becomes the language of the future.</p>
        </div>
      </section>

      {/* ============================================
           Nvshu of Today Section
           ============================================ */}
      <section className={styles.nvshuTodaySection}>
        <div className={styles.sectionTitle} id="nvshu-today-title">
          <h2 style={{ 
            fontSize: '3rem', 
            fontWeight: 'bold', 
            color: '#ffffff',
            margin: 0
          }}>
            Nvshu of Today
          </h2>
        </div>

        <p className={styles.sectionSubtitle}>
          Join today&apos;s theme and paint your part in the evolving story of Nvshu.
        </p>

        {/* Nvshu Character Display */}
        <div className={styles.nvshuCharacter} role="img" aria-label="Today's Nvshu character meaning Spring">
          <div className={styles.characterGlow} />
          <div style={{
            fontSize: '8rem',
            textAlign: 'center',
            color: '#ff66e8',
            fontWeight: 'bold'
          }}>
            女
          </div>
          <div className={styles.characterTranslation}>
            <span>&quot;Spring&quot;</span>
          </div>
        </div>

        {/* Start Painting Button */}
        <div className={styles.ctaButtonWrapper}>
          <button
            className={styles.startPaintingButton}
            onClick={onStartPainting}
            aria-describedby="paint-description"
          >
            <span style={{ fontSize: '1.5rem' }}>🎨</span>
            <span>Start Painting</span>
          </button>
          <p id="paint-description" className={styles.srOnly}>
            Begin collaborative painting on today&apos;s canvas
          </p>
        </div>
      </section>

      {/* ============================================
           Community Artworks Section
           ============================================ */}
      <section className={styles.communitySection} aria-labelledby="community-title">
        <div className={styles.sectionTitle} id="community-title">
          <h2 style={{ 
            fontSize: '3rem', 
            fontWeight: 'bold', 
            color: '#ffffff',
            margin: 0
          }}>
            Community Artworks
          </h2>
        </div>

        <p className={styles.sectionSubtitle}>
          Explore past collaborative artworks and feel the visual power of feminine language.
        </p>

        {/* Artworks Grid */}
        <div className={styles.artworksGrid} role="grid" aria-label="Community artworks gallery">
          {FEATURED_ARTWORKS.map((artwork, index) => (
            <div key={artwork.id} className={styles.artworkItem} role="gridcell">
              <div className={styles.artworkImage}>
                <Image
                  src={artwork.imageUrl}
                  alt={artwork.alt}
                  width={350}
                  height={350}
                  sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 350px"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <button
                className={index === 1 ? styles.mintButton : styles.buyButton}
                onClick={() => index === 1 ? onMintArtwork?.(artwork.id) : onBuyArtwork?.(artwork.id)}
                aria-label={`${index === 1 ? 'Mint' : 'Buy'} ${artwork.alt}`}
              >
                {index === 1 ? 'Mint' : 'Buy'}
              </button>
            </div>
          ))}
        </div>

        {/* View All Link */}
        <div className={styles.viewAllLink}>
          <button onClick={onViewAllArtworks} className={styles.viewAllButton}>
            <span>View all artworks</span>
            <span style={{ fontSize: '1.2rem' }}>→</span>
          </button>
        </div>
      </section>
    </div>
  );
};

// Featured Artworks Data
const FEATURED_ARTWORKS = [
  {
    id: '1',
    imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzUwIiBoZWlnaHQ9IjM1MCIgdmlld0JveD0iMCAwIDM1MCAzNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzNTAiIGhlaWdodD0iMzUwIiBmaWxsPSIjN2IyZWZmIi8+Cjx0ZXh0IHg9IjE3NSIgeT0iMTg1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSI0OCIgZm9udC13ZWlnaHQ9ImJvbGQiPkFydCAxPC90ZXh0Pgo8L3N2Zz4K',
    alt: 'Community Artwork 1'
  },
  {
    id: '2', 
    imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzUwIiBoZWlnaHQ9IjM1MCIgdmlld0JveD0iMCAwIDM1MCAzNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzNTAiIGhlaWdodD0iMzUwIiBmaWxsPSIjMWVlMTFmIi8+Cjx0ZXh0IHg9IjE3NSIgeT0iMTg1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJibGFjayIgZm9udC1zaXplPSI0OCIgZm9udC13ZWlnaHQ9ImJvbGQiPkFydCAyPC90ZXh0Pgo8L3N2Zz4K',
    alt: 'Community Artwork 2'
  },
  {
    id: '3',
    imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzUwIiBoZWlnaHQ9IjM1MCIgdmlld0JveD0iMCAwIDM1MCAzNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzNTAiIGhlaWdodD0iMzUwIiBmaWxsPSIjZmY2NmU4Ii8+Cjx0ZXh0IHg9IjE3NSIgeT0iMTg1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSI0OCIgZm9udC13ZWlnaHQ9ImJvbGQiPkFydCAzPC90ZXh0Pgo8L3N2Zz4K',
    alt: 'Community Artwork 3'
  },
  {
    id: '4',
    imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzUwIiBoZWlnaHQ9IjM1MCIgdmlld0JveD0iMCAwIDM1MCAzNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzNTAiIGhlaWdodD0iMzUwIiBmaWxsPSIjNDQ0NDQ0Ii8+Cjx0ZXh0IHg9IjE3NSIgeT0iMTg1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSI0OCIgZm9udC13ZWlnaHQ9ImJvbGQiPkFydCA0PC90ZXh0Pgo8L3N2Zz4K',
    alt: 'Community Artwork 4'
  },
  {
    id: '5',
    imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzUwIiBoZWlnaHQ9IjM1MCIgdmlld0JveD0iMCAwIDM1MCAzNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzNTAiIGhlaWdodD0iMzUwIiBmaWxsPSIjMDA3N2ZmIi8+Cjx0ZXh0IHg9IjE3NSIgeT0iMTg1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSI0OCIgZm9udC13ZWlnaHQ9ImJvbGQiPkFydCA1PC90ZXh0Pgo8L3N2Zz4K',
    alt: 'Community Artwork 5'
  },
  {
    id: '6',
    imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzUwIiBoZWlnaHQ9IjM1MCIgdmlld0JveD0iMCAwIDM1MCAzNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzNTAiIGhlaWdodD0iMzUwIiBmaWxsPSIjZmZhNTAwIi8+Cjx0ZXh0IHg9IjE3NSIgeT0iMTg1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSI0OCIgZm9udC13ZWlnaHQ9ImJvbGQiPkFydCA2PC90ZXh0Pgo8L3N2Zz4K',
    alt: 'Community Artwork 6'
  }
];

export default HomePage;