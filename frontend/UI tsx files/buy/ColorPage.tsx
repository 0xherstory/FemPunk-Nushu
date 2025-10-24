'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './ColorPage.module.css';
import { ColorPageProps, SelectedColor } from './color-types';

/**
 * FemPunk Nvshu - Color Mint Page Component
 * Design: Mint颜色页 (Color Mint Page)
 * Node ID: 100:1983
 *
 * Features:
 * - Interactive color wheel selector
 * - Mint color NFT functionality
 * - Invitation code for free receive
 * - User color collection display
 * - Price information with discount
 */

const ColorPage: React.FC<ColorPageProps> = ({
  className,
  selectedColor = {
    hex: '#AD4AFF',
    imageUrl: 'https://www.figma.com/api/mcp/asset/a70741bf-8c0e-41d4-964d-4e53d996bd1e',
  },
  userColors = [
    {
      id: '1',
      hex: '#592386',
      imageUrl: 'https://www.figma.com/api/mcp/asset/3be8ec3a-9340-4a2d-b016-b4e5578c25ca',
    },
    {
      id: '2',
      hex: '#592386',
      imageUrl: 'https://www.figma.com/api/mcp/asset/b0fe4ea1-9d89-4b4f-a639-e58c37785105',
    },
    {
      id: '3',
      hex: '#592386',
      imageUrl: 'https://www.figma.com/api/mcp/asset/cd3c8998-08de-4ea9-b60a-429182691272',
    },
    {
      id: '4',
      hex: '#592386',
      imageUrl: 'https://www.figma.com/api/mcp/asset/d7c7e3a6-4753-486a-beb0-871a8469dd5e',
    },
  ],
  walletAddress = '0xF7a1...7BAD',
  price = {
    current: 0.0001,
    original: 0.0006,
    currency: 'ETH',
  },
  onMintColor,
  onColorSelect,
  onInvitationCodeSubmit,
  onFreeReceive,
}) => {
  const [invitationCode, setInvitationCode] = useState('');

  const handleMintClick = () => {
    onMintColor?.(selectedColor);
  };

  const handleFreeReceiveClick = () => {
    if (invitationCode.trim()) {
      onInvitationCodeSubmit?.(invitationCode);
    }
    onFreeReceive?.();
  };

  return (
    <div
      className={`${styles.container} ${className || ''}`}
      data-name="Mint颜色页"
      data-node-id="100:1983"
    >
      {/* Navigation Bar */}
      <nav className={styles.navbar} data-name="导航栏" data-node-id="100:1991">
        <div className={styles.navbarBackdrop} data-node-id="I100:1991;70:1816" />
        <div className={styles.navbarContent}>
          <div className={styles.navbarLeft} data-node-id="I100:1991;70:1822">
            <div className={styles.logo} data-name="fempunk_logo" data-node-id="I100:1991;70:1823">
              <Image
                src="https://www.figma.com/api/mcp/asset/622cce7a-4e71-4086-8741-d8b730ba1fc5"
                alt="FemPunk Logo"
                width={18}
                height={41}
                data-node-id="I100:1991;70:1823;33:2505"
              />
              <Image
                src="https://www.figma.com/api/mcp/asset/749ee3d3-6def-4d3e-819a-a97f6a89ad0f"
                alt="FemPunk Text"
                width={140}
                height={45}
                data-node-id="I100:1991;70:1823;33:2515"
              />
            </div>
            <a href="#" className={styles.navLink} data-node-id="I100:1991;70:1824">
              PAINT
            </a>
            <a
              href="#"
              className={`${styles.navLink} ${styles.navLinkActive}`}
              data-node-id="I100:1991;70:1825"
            >
              COLOR
            </a>
            <a href="#" className={styles.navLink} data-node-id="I100:1991;70:1826">
              GALLERY
            </a>
            <a href="#" className={styles.navLink} data-node-id="I100:1991;70:1827">
              COLLECT
            </a>
          </div>
          <div className={styles.navbarRight} data-node-id="I100:1991;70:1817">
            <button className={styles.connectButton} data-node-id="I100:1991;70:1821">
              <Image
                src="https://www.figma.com/api/mcp/asset/b4771eab-5ce8-4d52-bfd5-aa543a398bc4"
                alt="Wallet Icon"
                width={20}
                height={20}
                data-name="理财 1"
                data-node-id="I100:1991;70:1819"
              />
              <span data-node-id="I100:1991;70:1818">{walletAddress}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Color Wheel Section */}
      <div className={styles.colorWheelSection} data-node-id="101:2144">
        <div
          className={styles.colorWheelWrapper}
          data-name="Mask group"
          data-node-id="101:2142"
        >
          <div
            className={styles.colorWheelImage}
            data-name="图层 165 1"
            data-node-id="101:2145"
          >
            <Image
              src="https://www.figma.com/api/mcp/asset/4ede6f9f-ca64-4bd5-a766-14faa87d4dd6"
              alt="Color Wheel"
              fill
              priority
            />
          </div>
        </div>
      </div>

      {/* Right Panel: Mint Color */}
      <div className={styles.mintPanel}>
        {/* Title */}
        <h1 className={styles.mintTitle} data-node-id="100:2016">
          Mint a Color
        </h1>

        {/* Selected Color Display */}
        <div className={styles.selectedColorGroup} data-node-id="101:2146">
          <div className={styles.selectedColorCircle} data-node-id="101:2154">
            <Image src={selectedColor.imageUrl} alt="Selected Color" fill />
          </div>
          <div className={styles.selectedColorHex} data-node-id="101:2147">
            {selectedColor.hex}
          </div>
          <div className={styles.colorHexInput} data-node-id="101:2148" />
        </div>

        {/* Price Info */}
        <div className={styles.priceInfo}>
          <span className={styles.priceLabel} data-node-id="101:2155">
            Price:
          </span>
          <span className={styles.priceValue} data-node-id="101:2156">
            {price.current} {price.currency}
          </span>
        </div>
        {price.original && (
          <div className={styles.priceOriginal} data-node-id="101:2157">
            {price.original} {price.currency}
          </div>
        )}

        {/* Mint Button */}
        <div className={styles.mintButtonWrapper} data-node-id="101:2149">
          <button
            className={styles.mintButton}
            onClick={handleMintClick}
            data-node-id="101:2150"
          >
            <span data-node-id="101:2151">Mint Color</span>
          </button>
        </div>

        {/* Divider with "or" */}
        <div className={styles.dividerGroup} data-node-id="101:2164">
          <div className={styles.dividerLine} data-node-id="101:2162">
            <Image
              src="https://www.figma.com/api/mcp/asset/3e1fcf5b-6789-4d31-bf3e-354115da5c8a"
              alt=""
              width={120}
              height={1}
            />
          </div>
          <span className={styles.dividerText} data-node-id="101:2161">
            or
          </span>
          <div className={styles.dividerLine} data-node-id="101:2163">
            <Image
              src="https://www.figma.com/api/mcp/asset/14927a93-dc9c-4cd8-b5f4-0b7f6037e2ab"
              alt=""
              width={120}
              height={1}
            />
          </div>
        </div>

        {/* Random Color Hint */}
        <div className={styles.randomHint} data-node-id="100:2130">
          You can get a random color NFT！
        </div>

        {/* Invitation Code Section */}
        <div className={styles.invitationSection} data-node-id="101:2165">
          <div className={styles.invitationInputWrapper} data-node-id="100:2127">
            <input
              type="text"
              placeholder=" "
              className={styles.invitationInput}
              value={invitationCode}
              onChange={(e) => setInvitationCode(e.target.value)}
              data-node-id="100:2129"
            />
            <label className={styles.invitationLabel} data-node-id="100:2128">
              Enter Invitation Code
            </label>
          </div>
          <button
            className={styles.receiveButton}
            onClick={handleFreeReceiveClick}
            data-node-id="100:2132"
          >
            <span data-node-id="100:2134">Free to receive</span>
          </button>
        </div>
      </div>

      {/* Your Color Section */}
      <div className={styles.yourColorSection} data-node-id="101:2187">
        <div className={styles.yourColorBackground} data-node-id="101:2168" />
        <h2 className={styles.yourColorTitle} data-node-id="101:2167">
          Your Color
        </h2>

        <div className={styles.colorList}>
          {userColors.map((color, index) => (
            <div
              key={color.id}
              className={styles.colorItem}
              data-node-id={
                index === 0
                  ? '101:2177'
                  : index === 1
                  ? '101:2178'
                  : index === 2
                  ? '101:2181'
                  : '101:2184'
              }
            >
              <div
                className={styles.colorCircle}
                data-node-id={
                  index === 0
                    ? '101:2170'
                    : index === 1
                    ? '101:2179'
                    : index === 2
                    ? '101:2182'
                    : '101:2185'
                }
              >
                <Image src={color.imageUrl} alt={`Color ${index + 1}`} fill />
              </div>
              <div
                className={styles.colorHex}
                data-node-id={
                  index === 0
                    ? '101:2172'
                    : index === 1
                    ? '101:2180'
                    : index === 2
                    ? '101:2183'
                    : '101:2186'
                }
              >
                {color.hex}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColorPage;
