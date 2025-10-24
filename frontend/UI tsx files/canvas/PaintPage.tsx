'use client';

import React from 'react';
import styles from './PaintPage.module.css';

/**
 * FemPunk Nvshu - Paint Page Component
 * Design: FemFunk-Nvshu - 绘画页-有颜色
 * Node ID: 101:2188
 * Dimensions: 1440px × 1024px
 *
 * Technology Stack:
 * - Next.js 14 (App Router)
 * - React 18
 * - CSS Modules for styling
 *
 * Future Integration Points:
 * - Canvas drawing: Fabric.js or Canvas API
 * - Real-time collaboration: Liveblocks/Yjs
 * - Wallet connection: wagmi v2 + viem + RainbowKit
 */

interface PaintPageProps {
  className?: string;
}

const PaintPage: React.FC<PaintPageProps> = ({ className }) => {
  return (
    <div className={`${styles.container} ${className || ''}`} data-name="绘画页-有颜色" data-node-id="101:2188">

      {/* Canvas Background with Mask */}
      <div className={styles.canvasBackground} data-name="Mask group" data-node-id="101:2189">
        <div className={styles.canvasImage} data-node-id="101:2191">
          <img
            src="https://www.figma.com/api/mcp/asset/2ccb6198-a3e8-418b-b296-55208a71f578"
            alt="Canvas Background"
          />
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className={styles.navbar} data-name="导航栏" data-node-id="101:2196">
        <div className={styles.navbarBackdrop} data-node-id="I101:2196;70:1816" />

        <div className={styles.navbarContent}>
          {/* Left Side: Logo and Menu */}
          <div className={styles.navbarLeft} data-node-id="I101:2196;70:1822">
            <div className={styles.logo} data-name="fempunk_logo" data-node-id="I101:2196;70:1823">
              <img
                src="https://www.figma.com/api/mcp/asset/0999c80e-150b-47bd-b16a-2b9945623dbc"
                alt="FemPunk Logo Layer 1"
              />
              <img
                src="https://www.figma.com/api/mcp/asset/f27a3ac7-2bf4-4b40-9215-2c2b2bf87093"
                alt="FemPunk Logo Layer 2"
              />
            </div>
            <a href="#" className={`${styles.navLink} ${styles.active}`}>PAINT</a>
            <a href="#" className={styles.navLink}>COLOR</a>
            <a href="#" className={styles.navLink}>GALLERY</a>
            <a href="#" className={styles.navLink}>COLLECT</a>
          </div>

          {/* Right Side: Connect Button */}
          <div className={styles.navbarRight} data-node-id="I101:2196;70:1817">
            <button className={styles.connectButton} data-node-id="I101:2196;70:1821">
              <img
                src="https://www.figma.com/api/mcp/asset/17dd0880-4f79-474b-9b15-1a7dd17fdaf4"
                alt="Wallet Icon"
                className={styles.walletIcon}
              />
              <span>Connect</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Tool Panel (Left Side) */}
      <div className={styles.toolPanel} data-node-id="101:2238">
        {/* Move Tool */}
        <div className={styles.toolItem} data-node-id="101:2246">
          <img
            src="https://www.figma.com/api/mcp/asset/bd4a117f-3d44-42a2-b862-2d10331ce82e"
            alt="Move Tool"
          />
        </div>

        {/* Hand Tool */}
        <div className={styles.toolItem} data-node-id="101:2239">
          <img
            src="https://www.figma.com/api/mcp/asset/42efefc3-fe5e-4549-8472-65ad556fd2e9"
            alt="Hand Tool"
          />
        </div>

        <div className={styles.divider} data-node-id="101:2241" />

        {/* Zoom Out */}
        <div className={styles.toolItem} data-node-id="101:2282">
          <img
            src="https://www.figma.com/api/mcp/asset/3eecc0bb-ddbb-4beb-8e19-a745c16d3dd4"
            alt="Zoom Out"
          />
        </div>

        {/* Zoom In */}
        <div className={styles.toolItem} data-node-id="101:2286">
          <img
            src="https://www.figma.com/api/mcp/asset/4494b5d6-4d46-4f8d-92f5-144bc57afb61"
            alt="Zoom In"
          />
        </div>

        <div className={styles.divider} data-node-id="101:2242" />

        {/* Brush Size Decrease */}
        <div className={styles.toolItem} data-node-id="101:2290">
          <img
            src="https://www.figma.com/api/mcp/asset/4e5412d2-1450-4f49-a19d-6e5bcd05fd8a"
            alt="Decrease Brush"
          />
        </div>

        <div className={styles.brushSizeIndicator} data-node-id="101:2245">1px</div>

        {/* Brush Size Increase */}
        <div className={styles.toolItem} data-node-id="101:2293">
          <img
            src="https://www.figma.com/api/mcp/asset/d43b361b-c817-483c-8927-dce4a1ffe75a"
            alt="Increase Brush"
          />
        </div>

        <div className={styles.divider} data-node-id="101:2243" />

        {/* Color Section */}
        <div className={styles.colorSection}>
          <div className={styles.colorLabel} data-node-id="101:2279">My Color</div>

          {/* Color Swatches */}
          <div className={styles.colorSwatches}>
            <div
              className={`${styles.colorSwatch} ${styles.active}`}
              data-node-id="101:2259"
              style={{ background: '#592386' }}
            />
            <div
              className={styles.colorSwatch}
              data-node-id="101:2333"
              style={{ background: '#237286' }}
            />
          </div>

          {/* Mint Color Button */}
          <button className={styles.mintColorButton} data-node-id="101:2251">
            <span>Mint Color</span>
          </button>
        </div>

        <div className={styles.divider} data-node-id="101:2244" />

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          {/* Undo */}
          <button className={styles.actionButton} data-node-id="101:2272">
            <img
              src="https://www.figma.com/api/mcp/asset/26836a04-b252-4f76-84a0-4569b6667f48"
              alt="Undo"
            />
          </button>

          {/* Redo */}
          <button className={styles.actionButton} data-node-id="101:2276">
            <img
              src="https://www.figma.com/api/mcp/asset/4976f618-136d-4008-9516-25ecf19136db"
              alt="Redo"
            />
          </button>

          {/* Import Image */}
          <button className={styles.actionButton} data-node-id="101:2268">
            <img
              src="https://www.figma.com/api/mcp/asset/e5c3d2f0-3764-462e-bcc3-d796a921a14d"
              alt="Import Image"
            />
          </button>

          {/* Clear Canvas */}
          <button className={styles.actionButton} data-node-id="101:2264">
            <img
              src="https://www.figma.com/api/mcp/asset/0409163b-d49c-4a1a-9e71-191a6843dcf7"
              alt="Clear"
            />
          </button>

          {/* Save Button */}
          <button className={styles.saveButton} data-node-id="101:2254">
            <img
              src="https://www.figma.com/api/mcp/asset/aef4a79c-5051-45db-a154-60c42dd838ad"
              alt="Save Icon"
            />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Right Info Panel */}
      <div className={styles.infoPanel} data-node-id="101:2197">

        {/* Nvshu of Today Section */}
        <div className={`${styles.infoSection} ${styles.nvshuToday}`}>
          <div className={styles.sectionHeader}>
            <h3>Nvshu of Today</h3>
            <div className={styles.countdownBadge} data-node-id="101:2222">
              Canvas locks in 13:13:34
            </div>
          </div>

          {/* Nvshu Character Display */}
          <div className={styles.nvshuCharacter} data-node-id="101:2198">
            <div className={styles.characterMask} data-node-id="101:2200">
              <img
                src="https://www.figma.com/api/mcp/asset/dcf0d13f-9ade-4973-9921-18bccb92ef36"
                alt="Nvshu Character Background"
              />
            </div>
            <div className={styles.characterOverlay} data-node-id="101:2204">
              <img
                src="https://www.figma.com/api/mcp/asset/0a7e46ce-4998-4fd1-a9ef-2274cd0e0aef"
                alt="Nvshu Character"
              />
            </div>
            <div className={styles.characterElements} data-node-id="101:2211">
              <img
                src="https://www.figma.com/api/mcp/asset/cf6bc0c4-6a58-421a-85fd-bcd098215db0"
                alt="Element 1"
                className={styles.element1}
              />
              <img
                src="https://www.figma.com/api/mcp/asset/61facb6b-4a5a-4cb0-ae49-90a162e8990e"
                alt="Element 2"
                className={styles.element2}
              />
            </div>
          </div>

          <div className={styles.nvshuTranslation} data-node-id="101:2218">
            <span className={styles.translationLabel}>Nvshu Translate：</span>
            <span className={styles.translationText}>Spring</span>
          </div>
        </div>

        {/* Theme of Today Section */}
        <div className={`${styles.infoSection} ${styles.themeSection}`} data-node-id="101:2231">
          <div className={styles.dividerLine} data-node-id="101:2232" />

          <div className={styles.sectionHeader}>
            <h3>Theme of Today</h3>
            <div className={styles.dayBadge} data-node-id="101:2234">Day 24</div>
          </div>

          <div className={styles.themeContent} data-node-id="101:2236">
            <p>Spring Garden</p>
          </div>
        </div>

        {/* What is Nvshu Section */}
        <div className={`${styles.infoSection} ${styles.whatNvshuSection}`} data-node-id="101:2224">
          <div className={styles.dividerLine} data-node-id="101:2225" />

          <div className={styles.sectionHeader}>
            <h3>What is Nvshu</h3>
          </div>

          <div className={styles.nvshuDescription} data-node-id="101:2227">
            <p>
              Nvshu is a unique script created <strong>by women</strong> in <strong>Jiangyong</strong> County, Hunan, China. Developed as a way for women to <strong>express their emotions</strong>, write poems, and <strong>communicate</strong> with one another in a patriarchal society, its <strong>elegant</strong>, slender strokes embody grace and resilience. Today, Nvshu stands as a powerful symbol of <strong>women&apos;s creativity,</strong> connection, and cultural heritage.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default PaintPage;
