import type { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import './globals.css';
import { Web3Provider } from '../lib/providers/Web3Provider';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';
import { GlobalErrorDisplay, OfflineIndicator, GlobalLoadingOverlay } from '../components/ui/GlobalErrorDisplay';
import { ClientOnly } from '../components/ui/ClientOnly';

const inter = Inter({ subsets: ['latin'] });
const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FemPunk NüShu - Web3 协作绘画平台',
  description: '基于区块链技术的女书文化传承协作绘画平台',
  keywords: ['Web3', '女书', 'NFT', '协作绘画', '区块链艺术'],
  authors: [{ name: 'FemPunk Team' }],
  openGraph: {
    title: 'FemPunk NüShu - Web3 协作绘画平台',
    description: '传承女书文化的Web3协作绘画平台',
    type: 'website',
    locale: 'zh_CN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FemPunk NüShu - Web3 协作绘画平台',
    description: '传承女书文化的Web3协作绘画平台',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#7a2eff',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.className} ${montserrat.variable}`}>
        <ErrorBoundary>
          <Web3Provider>
            <ClientOnly>
              <OfflineIndicator />
              <GlobalErrorDisplay />
              <GlobalLoadingOverlay />
            </ClientOnly>
            <div id="root">{children}</div>
          </Web3Provider>
        </ErrorBoundary>
      </body>
    </html>
  );
}