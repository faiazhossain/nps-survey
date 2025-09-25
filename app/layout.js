import './globals.css';
import ReduxProvider from './components/ReduxProvider';

export const metadata = {
  title: 'NPS Survey App',
  description: 'Mobile survey application for NPS data collection',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang='bn'>
      <head>
        <link
          rel='preload'
          href='/fonts/Tiro_Bangla/TiroBangla-Regular.ttf'
          as='font'
          type='font/truetype'
          crossOrigin='anonymous'
        />
      </head>
      <body className='bg-gray-50' style={{ fontFamily: 'Tiro Bangla, serif' }}>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
