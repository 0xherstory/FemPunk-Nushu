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
            <Image
              src="/images/homepage/left_img1.png"
              alt=""
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div className={styles.leftImg2}>
            <Image
              src="/images/homepage/left_img2.png"
              alt=""
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>

        {/* 右侧装饰图片 */}
        <div className={styles.rightDecorGroup}>
          <div className={styles.rightImg1}>
            <Image
              src="/images/homepage/right_img1.png"
              alt=""
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div className={styles.rightImg2}>
            <Image
              src="/images/homepage/right_img2.png"
              alt=""
              fill
              style={{ objectFit: 'contain' }}
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
              <Image
                src="/images/logo/fempunk-logo.svg"
                alt="FemPunk Logo"
                width={18}
                height={41}
                priority
              />
              <Image
                src="/images/logo/fempunk-text.svg"
                alt="FemPunk Text"
                width={140}
                height={45}
                priority
              />
            </div>
            <a href="#" className={styles.navLink}>PAINT</a>
            <a href="#" className={styles.navLink}>COLOR</a>
            <a href="#" className={styles.navLink}>GALLERY</a>
            <a href="#" className={styles.navLink}>COLLECT</a>
          </div>
          <div className={styles.navbarRight}>
            <button className={styles.connectButton}>
              <Image
                src="/images/icons/wallet.svg"
                alt=""
                width={20}
                height={20}
                aria-hidden="true"
              />
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
          <Image
            src="/images/text/hero-title.svg"
            alt="Nvshu Reborn Art Co-creation"
            width={846}
            height={233}
            priority
            sizes="(max-width: 768px) 90vw, 846px"
          />
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
          <Image
            src="/images/text/nvshu-text.svg"
            alt="Nvshu"
            width={185}
            height={52}
          />
          <Image
            src="/images/text/of-today-text.svg"
            alt="of Today"
            width={216}
            height={52}
          />
        </div>

        <p className={styles.sectionSubtitle}>
          Join today&apos;s theme and paint your part in the evolving story of Nvshu.
        </p>

        {/* Nvshu Character Display */}
        <div className={styles.nvshuCharacter} role="img" aria-label="Today's Nvshu character meaning Spring">
          <div className={styles.characterGlow} />
          <div className={styles.characterLayers}>
            <div className={styles.characterMask}>
              <Image
                src="/images/text/nvshu-character-mask.svg"
                alt=""
                fill
                sizes="480px"
              />
            </div>
            <div className={styles.characterOverlay}>
              <Image
                src="/images/text/nvshu-character-overlay.svg"
                alt=""
                width={331}
                height={331}
              />
            </div>
            <div className={styles.characterBase}>
              <Image
                src="/images/text/nvshu-character-base.svg"
                alt=""
                fill
                sizes="480px"
              />
            </div>
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
            <Image
              src="/images/icons/paint-brush.svg"
              alt=""
              width={28}
              height={28}
              aria-hidden="true"
            />
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
          <Image
            src="/images/text/community-text.svg"
            alt="Community"
            width={247}
            height={52}
          />
          <Image
            src="/images/text/artworks-text.svg"
            alt="Artworks"
            width={244}
            height={52}
          />
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
                className={index === 0 ? styles.mintButton : styles.buyButton}
                onClick={() => index === 0 ? onMintArtwork?.(artwork.id) : onBuyArtwork?.(artwork.id)}
                aria-label={`${index === 0 ? 'Mint' : 'Buy'} ${artwork.alt}`}
              >
                {index === 0 ? 'Mint' : 'Buy'}
              </button>
            </div>
          ))}
        </div>

        {/* View All Link */}
        <div className={styles.viewAllLink}>
          <button onClick={onViewAllArtworks} className={styles.viewAllButton}>
            <span>View all artworks</span>
            <Image
              src="/images/icons/arrow-right.svg"
              alt=""
              width={20}
              height={20}
              aria-hidden="true"
            />
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
    imageUrl: '/images/artworks/community-artwork-1.svg',
    alt: 'Community Artwork 1'
  },
  {
    id: '2', 
    imageUrl: '/images/artworks/community-artwork-2.svg',
    alt: 'Community Artwork 2'
  },
  {
    id: '3',
    imageUrl: '/images/artworks/community-artwork-3.svg',
    alt: 'Community Artwork 3'
  },
  {
    id: '4',
    imageUrl: '/images/artworks/community-artwork-4.svg',
    alt: 'Community Artwork 4'
  },
  {
    id: '5',
    imageUrl: '/images/artworks/community-artwork-5.svg',
    alt: 'Community Artwork 5'
  },
  {
    id: '6',
    imageUrl: '/images/artworks/community-artwork-6.svg',
    alt: 'Community Artwork 6'
  }
];

export default HomePage;