import { 
  NavigationBar, 
  HeroSection, 
  DescriptiveTextSections,
  ArtworkGallery,
  ViewAllCTA 
} from '../components/figma-homepage';
import PerformanceMonitor from '../components/figma-homepage/PerformanceMonitor/PerformanceMonitor';

// Performance optimization imports
import { Suspense } from 'react';

export default function HomePage() {
  return (
    <main 
      id="main-content"
      className="figma-homepage"
      role="main"
      aria-label="FemPunk Nvshu collaborative art platform homepage"
      style={{
        width: '1440px',
        minHeight: '2729px',
        margin: '0 auto',
        position: 'relative',
        backgroundColor: '#161616',
        color: '#ffffff',
        overflowX: 'hidden'
      }}
    >
      {/* FemPunk Nvshu Homepage - Exact Figma reproduction */}
      {/* Requirements: 1.1, 6.1, 6.2, 6.3 */}
      
      {/* Navigation Bar - Fixed positioning with exact dimensions (z-index: 10) */}
      <header style={{ position: 'relative', zIndex: 10 }}>
        <NavigationBar />
      </header>
      
      {/* Hero Section - Main visual area with collaborative artworks (z-index: 2) */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <HeroSection 
          themeText="Spring"
          className=""
        />
      </div>
      
      {/* Descriptive Text Sections - Typography with exact Figma specifications (z-index: 3) */}
      <section 
        aria-label="Platform description and mission"
        style={{
          position: 'relative',
          zIndex: 3,
          marginTop: '120px',
          padding: '0 40px',
          maxWidth: '1440px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
      >
        <DescriptiveTextSections className="" />
      </section>
      
      {/* Artwork Gallery - 6 artwork cards with exact positioning (z-index: 4) */}
      <section 
        aria-label="Featured collaborative artworks gallery"
        className="below-fold"
        style={{
          position: 'relative',
          zIndex: 4,
          marginTop: '160px',
          padding: '0 40px',
          maxWidth: '1440px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
      >
        <Suspense fallback={<div style={{ height: '422px', background: 'rgba(255,255,255,0.1)' }}>Loading artworks...</div>}>
          <ArtworkGallery className="" />
        </Suspense>
      </section>
      
      {/* View All CTA - Link with arrow icon (z-index: 5) */}
      <section 
        aria-label="View all artworks call to action"
        style={{
          position: 'relative',
          zIndex: 5,
          marginTop: '80px',
          padding: '0 40px',
          maxWidth: '1440px',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginBottom: '120px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <ViewAllCTA className="" />
      </section>
      
      {/* Performance monitoring and verification */}
      <PerformanceMonitor />
    </main>
  );
}