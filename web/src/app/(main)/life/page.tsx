import { Metadata } from 'next';
import LifeClient from './LifeClient';

export const metadata: Metadata = {
  title: 'Life at PCM | Campus Life, Events & Clubs',
  description: 'A typical day on campus, facilities, events, tours, workshops, seminars and the close-knit student community at Pokhara College of Management.',
  openGraph: {
    title: 'Life at PCM | Campus Life, Events & Clubs',
    description: 'A typical day on campus, facilities, events, tours, workshops, seminars and the close-knit student community at Pokhara College of Management.',
    url: 'https://www.pcm.edu.np/life',
    type: 'website',
    images: [
      {
        url: 'https://www.pcm.edu.np/assets/img/hero-5.jpg',
        width: 1200,
        height: 630,
        alt: 'Life at PCM',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Life at PCM | Campus Life, Events & Clubs',
    description: 'A typical day on campus, facilities, events, tours, workshops, seminars and the close-knit student community at Pokhara College of Management.',
    images: ['https://www.pcm.edu.np/assets/img/hero-5.jpg'],
  },
};

export default function LifePage() {
  return <LifeClient />;
}
