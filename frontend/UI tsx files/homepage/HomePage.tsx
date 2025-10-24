'use client';

import React from 'react';
import Image from 'next/image';
import styles from './HomePage.module.css';

/**
 * FemPunk Nvshu - Home Page Component
 * Design: 首页 (Homepage)
 * Node ID: 70:1809
 *
 * Features:
 * - Hero section with animated title
 * - Nvshu of Today showcase
 * - Community artworks gallery
 * - Complex decorative background layers
 * - Call-to-action buttons
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
           COMPLETE BACKGROUND DECORATION LAYERS
           All 60+ decorative elements from Figma
           ============================================ */}
      <div className={styles.backgroundLayersComplete} data-node-id="93:1917">
        {/* Gradient Overlay Top */}
        <div className={styles.gradientOverlayTop} data-node-id="93:1780" />

        {/* Main Background Image (multiply blend) */}
        <div className={styles.bgMainImage} data-node-id="93:1783"  >
          <Image
            src="https://www.figma.com/api/mcp/asset/a10986f5-0f38-43ac-894d-ab94cc5848a8"
            alt=""
            fill
          />
        </div>

        {/* LEFT SIDE DECORATIONS */}
        <div className={styles.decorLeftGroup} data-node-id="93:1875">
          <div className={styles.greenLayerLeftTop} data-node-id="93:1788"  >
            <Image src="https://www.figma.com/api/mcp/asset/0ca3141b-80cd-4dac-940e-d33ee5617ba9" alt="" fill />
          </div>
          <div className={styles.decor01204v} data-node-id="93:1791"  >
            <Image src="https://www.figma.com/api/mcp/asset/a8921ba1-824e-434a-ab77-b15fcb147759" alt="" fill />
          </div>
          <div className={styles.layer1111} data-node-id="93:1792"  >
            <Image src="https://www.figma.com/api/mcp/asset/050d8cad-a370-478f-90be-7e5a3efe4657" alt="" fill />
          </div>
          <div className={styles.layer067} data-node-id="93:1804"  >
            <Image src="https://www.figma.com/api/mcp/asset/0768339f-7453-4e91-9f15-7a7be3b61038" alt="" fill />
          </div>
          <div className={styles.unionLeft} data-node-id="93:1809"  >
            <Image src="https://www.figma.com/api/mcp/asset/272906ad-f356-4041-a901-ecc6cc3f280f" alt="" fill />
          </div>
          <div className={styles.greenLayerLeftMid} data-node-id="93:1817"  >
            <Image src="https://www.figma.com/api/mcp/asset/0ca3141b-80cd-4dac-940e-d33ee5617ba9" alt="" fill />
          </div>
          <div className={styles.groupLeft1} data-node-id="93:1825"  >
            <Image src="https://www.figma.com/api/mcp/asset/438f993b-e24d-4433-8d57-32c5cf12027b" alt="" fill />
          </div>
          <div className={styles.layer1Left} data-node-id="93:1831"  >
            <Image src="https://www.figma.com/api/mcp/asset/2ae8fe78-ebfc-4f2a-8565-e72fd0273c39" alt="" fill />
          </div>
          <div className={styles.groupLeft2} data-node-id="93:1838"  >
            <Image src="https://www.figma.com/api/mcp/asset/0243f2f0-1d92-46c2-8e3e-681aa5c7353c" alt="" fill />
          </div>
          <div className={styles.unionLeftBottom} data-node-id="93:1851"  >
            <Image src="https://www.figma.com/api/mcp/asset/b2f167bc-4df1-44e3-80c8-4ccd7e282109" alt="" fill />
          </div>
          <div className={styles.charLayerLeft} data-node-id="93:1861"  >
            <Image src="https://www.figma.com/api/mcp/asset/c8e3bfbd-e2d6-4ca2-bc3e-16deb571b9cb" alt="" fill />
          </div>
          <div className={styles.vectorLeft} data-node-id="93:1862"  >
            <Image src="https://www.figma.com/api/mcp/asset/faa37060-ff28-45bc-b025-918996eeb9c5" alt="" fill />
          </div>
          <div className={styles.groupLeft3} data-node-id="93:1863"  >
            <Image src="https://www.figma.com/api/mcp/asset/d51559c3-7b49-4818-ab09-fe2bfb684e9e" alt="" fill />
          </div>
          <div className={styles.groupLeft4} data-node-id="93:1867"  >
            <Image src="https://www.figma.com/api/mcp/asset/b83dffd5-7cea-4dd0-a0cf-d831832d047d" alt="" fill />
          </div>
          <div className={styles.group26} data-node-id="93:1871"  >
            <Image src="https://www.figma.com/api/mcp/asset/4589026f-d15b-43c1-9ee2-99b8bcb2fa71" alt="" fill />
          </div>
          <div className={styles.decorImageLeft} data-node-id="93:1873"  >
            <Image src="https://www.figma.com/api/mcp/asset/aacf302d-3c8c-4a18-b0ed-1e46b6ff0e34" alt="" fill />
          </div>
        </div>

        {/* RIGHT SIDE DECORATIONS */}
        <div className={styles.decorRightGroup} data-node-id="93:1880">
          <div className={styles.decor30267v} data-node-id="93:1882"  >
            <Image src="https://www.figma.com/api/mcp/asset/1852609e-2922-4678-bd88-ca7c555f4284" alt="" fill />
          </div>
          <div className={styles.greenLayerRight} data-node-id="93:1883"  >
            <Image src="https://www.figma.com/api/mcp/asset/0ca3141b-80cd-4dac-940e-d33ee5617ba9" alt="" fill />
          </div>
          <div className={styles.decor92f} data-node-id="93:1886"  >
            <Image src="https://www.figma.com/api/mcp/asset/2d4174bc-711d-4731-8dd5-9da2a3f380a1" alt="" fill />
          </div>
        </div>

        {/* TOP RIGHT DECORATIONS */}
        <div className={styles.decorTopRight} data-node-id="93:1891">
          <div className={styles.decorAe51} data-node-id="93:1785"  >
            <Image src="https://www.figma.com/api/mcp/asset/96656ca9-d1b0-4571-87cd-92c3826f376b" alt="" fill />
          </div>
        </div>

        {/* TOP LEFT DECORATIONS */}
        <div className={styles.decorTopLeft} data-node-id="93:1900">
          <div className={styles.decor73c} data-node-id="93:1784"  >
            <Image src="https://www.figma.com/api/mcp/asset/08b4bee6-7f65-4a11-bea2-61c613698793" alt="" fill />
          </div>
        </div>

        {/* HERO DECORATIONS */}
        <div className={styles.heroDecorGroup} data-node-id="93:1807">
          <div className={styles.unionHero} data-node-id="93:1809"  >
            <Image src="https://www.figma.com/api/mcp/asset/272906ad-f356-4041-a901-ecc6cc3f280f" alt="" fill />
          </div>
          <div className={styles.greenLayerHero} data-node-id="93:1817"  >
            <Image src="https://www.figma.com/api/mcp/asset/0ca3141b-80cd-4dac-940e-d33ee5617ba9" alt="" fill />
          </div>
          <div className={styles.groupHero} data-node-id="93:1825"  >
            <Image src="https://www.figma.com/api/mcp/asset/438f993b-e24d-4433-8d57-32c5cf12027b" alt="" fill />
          </div>
          <div className={styles.layer1Hero} data-node-id="93:1831"  >
            <Image src="https://www.figma.com/api/mcp/asset/2ae8fe78-ebfc-4f2a-8565-e72fd0273c39" alt="" fill />
          </div>
          <div className={styles.groupHero2} data-node-id="93:1838"  >
            <Image src="https://www.figma.com/api/mcp/asset/0243f2f0-1d92-46c2-8e3e-681aa5c7353c" alt="" fill />
          </div>
          <div className={styles.decorEb0ca} data-node-id="93:1913"  >
            <Image src="https://www.figma.com/api/mcp/asset/d237c37b-8e64-4490-8fa8-488ca6895639" alt="" fill />
          </div>
        </div>

        {/* MID-RIGHT DECORATIONS */}
        <div className={styles.midRightDecor} data-node-id="127:5657">
          <div className={styles.jimengDecor} data-node-id="127:5655"  >
            <Image src="https://www.figma.com/api/mcp/asset/b72f46d2-ec34-4151-a746-e3c149414d26" alt="" fill />
          </div>
          <div className={styles.layer03} data-node-id="93:1803"  >
            <Image src="https://www.figma.com/api/mcp/asset/f7435fea-b67e-43f3-a133-41861faec3f9" alt="" fill />
          </div>
        </div>
      </div>

      {/* Thorn Decorations */}
      <div className={styles.thornTop} data-node-id="94:1996">
        <Image
          src="https://www.figma.com/api/mcp/asset/c8b3e205-2301-4e88-b3f5-fb62c6b383d3"
          alt=""
          width={724}
          height={103}
        />
      </div>
      <div className={styles.thornTopRight} data-node-id="94:2006">
        <Image
          src="https://www.figma.com/api/mcp/asset/c8b3e205-2301-4e88-b3f5-fb62c6b383d3"
          alt=""
          width={724}
          height={103}
        />
      </div>

      {/* Navigation Bar */}
      <nav className={styles.navbar} data-node-id="97:2123">
        <div className={styles.navbarBackdrop} />
        <div className={styles.navbarContent}>
          <div className={styles.navbarLeft}>
            <div className={styles.logo}>
              <Image
                src="https://www.figma.com/api/mcp/asset/8e85c9df-f1ee-4c18-8a5b-387c6204a747"
                alt="FemPunk Logo"
                width={18}
                height={41}
              />
              <Image
                src="https://www.figma.com/api/mcp/asset/4818dab2-1865-428d-94c1-13ba98d5ba6b"
                alt="FemPunk Text"
                width={140}
                height={45}
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
                src="https://www.figma.com/api/mcp/asset/7fc132c1-a006-4cdf-b052-7fea77cb7252"
                alt=""
                width={20}
                height={20}
              />
              <span>Connect</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroTitle} data-node-id="127:5649">
          <Image
            src="https://www.figma.com/api/mcp/asset/37571abf-bfaf-4531-a440-ce475c8d0b25"
            alt="Nvshu Reborn Art Co-creation"
            width={846}
            height={233}
            priority
          />
        </div>

        <div className={styles.heroSubtitle1} data-node-id="93:1893">
          <p>Through decentralized collaboration,</p>
        </div>
        <div className={styles.heroSubtitle2} data-node-id="93:1894">
          <p>the ancient script becomes the language of the future.</p>
        </div>

        {/* Decorative Polygon Shapes */}
        <div className={styles.polygonLeft} data-node-id="94:2002">
          <Image
            src="https://www.figma.com/api/mcp/asset/d3014bc4-3192-4ef9-bc6c-3ea36a795f3b"
            alt=""
            width={574}
            height={770}
          />
        </div>
        <div className={styles.polygonRight} data-node-id="94:2004">
          <Image
            src="https://www.figma.com/api/mcp/asset/fb114c74-9bd7-4376-9696-ed6549442c8b"
            alt=""
            width={574}
            height={770}
          />
        </div>

        {/* Torn Paper Effects */}
        <div className={styles.tornPaperTop} data-node-id="93:1904">
          <Image
            src="https://www.figma.com/api/mcp/asset/a99dbb1b-de5e-4b1b-a84f-2312139365d5"
            alt=""
            width={1441}
            height={182}
          />
        </div>
      </section>

      {/* Nvshu of Today Section */}
      <section className={styles.nvshuTodaySection}>
        <div className={styles.nvshuTodayTitle} data-node-id="94:1967">
          <div className={styles.titleNvshu}>
            <Image
              src="https://www.figma.com/api/mcp/asset/2a859fdb-b9bb-4acc-aeb5-7e613f49abc3"
              alt="Nvshu"
              width={185}
              height={52}
            />
          </div>
          <div className={styles.titleToday}>
            <Image
              src="https://www.figma.com/api/mcp/asset/c0b33612-8bcb-47e6-a7a2-ef4f5043f1ff"
              alt="of Today"
              width={216}
              height={52}
            />
          </div>
        </div>

        <div className={styles.nvshuTodaySubtitle} data-node-id="94:1986">
          <p>Join today&apos;s theme and paint your part in the evolving story of Nvshu.</p>
        </div>

        {/* Nvshu Character Display */}
        <div className={styles.nvshuCharacterDisplay} data-node-id="94:1960">
          <div className={styles.characterGlow} data-node-id="94:1953" />

          <div className={styles.characterLayers}>
            <div className={styles.characterMask} data-node-id="94:1956">
              <Image
                src="https://www.figma.com/api/mcp/asset/c8e3bfbd-e2d6-4ca2-bc3e-16deb571b9cb"
                alt=""
                fill
              />
            </div>

            <div className={styles.characterOverlay} data-node-id="99:1584">
              <Image
                src="https://www.figma.com/api/mcp/asset/3431327d-92b3-4f60-a9c7-500a148fb4e0"
                alt="Group70"
                width={331}
                height={331}
              />
            </div>

            <div className={styles.characterBase} data-node-id="94:1952">
              <Image
                src="https://www.figma.com/api/mcp/asset/0453d87a-aa8a-4afa-9790-f658a6c7c7dd"
                alt=""
                fill
              />
            </div>

            <div className={styles.characterDecor} data-node-id="94:1932">
              <Image
                src="https://www.figma.com/api/mcp/asset/aedec9ed-10f9-4866-af99-c5d205d8e8e7"
                alt=""
                width={480}
                height={480}
              />
            </div>

            <div className={styles.characterStroke} data-node-id="93:1918">
              <Image
                src="https://www.figma.com/api/mcp/asset/79df074d-b788-4f91-8911-52a551068435"
                alt=""
                width={66}
                height={217}
              />
            </div>
          </div>

          <div className={styles.characterTranslation} data-node-id="94:1959">
            <p>&quot;Spring&quot;</p>
          </div>
        </div>

        {/* Start Painting Button */}
        <div className={styles.ctaButtonWrapper} data-node-id="94:1969">
          <button
            className={styles.startPaintingButton}
            onClick={onStartPainting}
            data-node-id="94:1970"
          >
            <div className={styles.paintIcon} data-node-id="94:1981">
              <Image
                src="https://www.figma.com/api/mcp/asset/87e53dc9-cb97-48a6-b825-b8ad6f1ab046"
                alt=""
                width={28}
                height={28}
              />
            </div>
            <span>Start Painting</span>
          </button>
        </div>

        {/* Decorative White Splashes */}
        <div className={styles.whiteSplashLeft} data-node-id="94:2033">
          <div className={styles.baiLeft} data-node-id="94:2035"  >
            <Image
              src="https://www.figma.com/api/mcp/asset/0ee593a7-43e3-4d0f-890f-004848e45ee6"
              alt=""
              fill
            />
          </div>
        </div>
        <div className={styles.whiteSplashRight} data-node-id="94:2032">
          <div className={styles.baiRight} data-node-id="94:2029"  >
            <Image
              src="https://www.figma.com/api/mcp/asset/0ee593a7-43e3-4d0f-890f-004848e45ee6"
              alt=""
              fill
            />
          </div>
          <div className={styles.bodianRight} data-node-id="95:2037"  >
            <Image
              src="https://www.figma.com/api/mcp/asset/0f1ae056-8e82-486e-abe8-84f26fae95ea"
              alt=""
              fill
            />
          </div>
        </div>

        {/* Torn Paper Bottom */}
        <div className={styles.tornPaperBottom} data-node-id="94:2007">
          <Image
            src="https://www.figma.com/api/mcp/asset/a99dbb1b-de5e-4b1b-a84f-2312139365d5"
            alt=""
            width={1441}
            height={182}
          />
        </div>
      </section>

      {/* Community Artworks Section */}
      <section className={styles.communitySection}>
        <div className={styles.communitySectionTitle} data-node-id="95:2043">
          <div className={styles.titleCommunity}>
            <Image
              src="https://www.figma.com/api/mcp/asset/1d29ed5a-9430-4cf4-908b-232bd1050941"
              alt="Community"
              width={247}
              height={52}
            />
          </div>
          <div className={styles.titleArtworks}>
            <Image
              src="https://www.figma.com/api/mcp/asset/cd4c7ebf-1155-459c-b1ce-298257efb2ec"
              alt="Artworks"
              width={244}
              height={52}
            />
          </div>
        </div>

        <div className={styles.communitySubtitle} data-node-id="95:2044">
          <p>Explore past collaborative artworks and feel the visual power of feminine language.</p>
        </div>

        {/* Artworks Grid */}
        <div className={styles.artworksGrid}>
          {/* Row 1 */}
          <div className={styles.artworkItem} data-node-id="95:2084">
            <div className={styles.artworkImage}>
              <Image
                src="https://www.figma.com/api/mcp/asset/a6373279-6d52-4edf-9218-f6d1b72ba886"
                alt="Artwork 1"
                width={350}
                height={350}
                className={styles.artworkImg}
              />
            </div>
            <button
              className={styles.mintButton}
              onClick={() => onMintArtwork?.('artwork-1')}
            >
              Mint
            </button>
          </div>

          <div className={styles.artworkItem} data-node-id="95:2085">
            <div className={styles.artworkImage}>
              <Image
                src="https://www.figma.com/api/mcp/asset/52fff1ab-659b-4c98-aeee-775f3ef30f63"
                alt="Artwork 2"
                width={350}
                height={350}
                className={styles.artworkImg}
              />
            </div>
            <button
              className={styles.buyButton}
              onClick={() => onBuyArtwork?.('artwork-2')}
            >
              Buy
            </button>
          </div>

          <div className={styles.artworkItem} data-node-id="95:2086">
            <div className={styles.artworkImage}>
              <Image
                src="https://www.figma.com/api/mcp/asset/993ef106-aa75-444c-a6ee-b673a15a8b49"
                alt="Artwork 3"
                width={350}
                height={350}
                className={styles.artworkImg}
              />
            </div>
            <button
              className={styles.buyButton}
              onClick={() => onBuyArtwork?.('artwork-3')}
            >
              Buy
            </button>
          </div>

          {/* Row 2 */}
          <div className={styles.artworkItem} data-node-id="95:2099">
            <div className={styles.artworkImage}>
              <Image
                src="https://www.figma.com/api/mcp/asset/6d329de4-1fa1-4f48-a33b-9342bef9ddc8"
                alt="Artwork 4 - IMG_6407"
                width={350}
                height={350}
                className={styles.artworkImg}
                data-node-id="95:2105"
              />
            </div>
            <button
              className={styles.buyButton}
              onClick={() => onBuyArtwork?.('artwork-4')}
            >
              Buy
            </button>
          </div>

          <div className={styles.artworkItem} data-node-id="95:2087">
            <div className={styles.artworkImage}>
              <Image
                src="https://www.figma.com/api/mcp/asset/ab7991b7-a71a-4415-a109-4cb079f4e25a"
                alt="Artwork 5 - 图层 055 1"
                width={350}
                height={350}
                className={styles.artworkImg}
                data-node-id="95:2092"
              />
            </div>
            <button
              className={styles.buyButton}
              onClick={() => onBuyArtwork?.('artwork-5')}
            >
              Buy
            </button>
          </div>

          <div className={styles.artworkItem} data-node-id="95:2093">
            <div className={styles.artworkImage}>
              <Image
                src="https://www.figma.com/api/mcp/asset/31764469-bdfc-4cd4-93d1-8a64c2d39da9"
                alt="Artwork 6 - IMG_6405"
                width={350}
                height={350}
                className={styles.artworkImg}
                data-node-id="95:2098"
              />
            </div>
            <button
              className={styles.buyButton}
              onClick={() => onBuyArtwork?.('artwork-6')}
            >
              Buy
            </button>
          </div>
        </div>

        {/* View All Link */}
        <div className={styles.viewAllLink} data-node-id="95:2113">
          <button onClick={onViewAllArtworks} className={styles.viewAllButton}>
            <span>View all artworks</span>
            <Image
              src="https://www.figma.com/api/mcp/asset/f40e1eb7-7621-40cb-a9c4-13b0d6778c74"
              alt=""
              width={20}
              height={20}
            />
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
