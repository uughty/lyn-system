import './globals.css';
import { Inter, Playfair_Display } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', weight: ['400','500','700'] });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', weight: ['400','700'] });

export const metadata = {
  title: 'Swahili Coastal Crunch',
  description: 'Delicious coastal meals and spices',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-[#FCFBF7] text-[#292524] selection:bg-[#E87E44]/30 font-sans">
        {children}
      </body>
    </html>
  );
}
