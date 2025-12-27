
import React from 'react';
import { Facebook, Instagram, Twitter, Music2, Youtube, Smartphone, Wallet, CreditCard, Send, Ghost } from 'lucide-react';
import { PlatformPrice, BlogPost } from './types';

export const PLATFORMS = [
  { id: 'fb', name: 'Facebook', icon: <Facebook className="w-5 h-5 text-blue-600" /> },
  { id: 'ig', name: 'Instagram', icon: <Instagram className="w-5 h-5 text-pink-600" /> },
  { id: 'tiktok', name: 'TikTok', icon: <Music2 className="w-5 h-5 text-slate-900" /> },
  { id: 'yt', name: 'YouTube', icon: <Youtube className="w-5 h-5 text-red-600" /> },
  { id: 'tw', name: 'Twitter (X)', icon: <Twitter className="w-5 h-5 text-sky-500" /> },
  { id: 'tg', name: 'Telegram', icon: <Send className="w-5 h-5 text-sky-600" /> },
  { id: 'sc', name: 'Snapchat', icon: <Ghost className="w-5 h-5 text-yellow-500" /> },
];

export const INITIAL_PRICES: PlatformPrice[] = [
  { id: 'fb', name: 'Facebook', todayPrice: 12.5, regularPrice: 15.0, status: 'buying', updatedAt: Date.now() },
  { id: 'ig', name: 'Instagram', todayPrice: 8.0, regularPrice: 10.0, status: 'buying', updatedAt: Date.now() },
  { id: 'tiktok', name: 'TikTok', todayPrice: 22.0, regularPrice: 20.0, status: 'buying', updatedAt: Date.now() },
  { id: 'yt', name: 'YouTube', todayPrice: 45.0, regularPrice: 50.0, status: 'closed', updatedAt: Date.now() },
  { id: 'tg', name: 'Telegram', todayPrice: 35.0, regularPrice: 40.0, status: 'buying', updatedAt: Date.now() },
  { id: 'sc', name: 'Snapchat', todayPrice: 15.0, regularPrice: 18.0, status: 'buying', updatedAt: Date.now() },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    title: 'How to Maximize Your Earnings in 2024',
    excerpt: 'Learn the best practices for creating high-quality accounts that fetch premium rates on our marketplace.',
    content: [
      "In the rapidly evolving world of digital assets, staying ahead of the curve is essential for maintaining a high income stream. As we move through 2024, Time Task BD has observed several key trends that directly impact how much merchants can earn.",
      "First and foremost, account 'aging' remains the most critical factor. An account that has been active for six months is worth significantly more than a week-old profile. Our verification team looks for consistent activity patterns that suggest a real user, rather than a bot.",
      "Secondly, geographic relevance is surging. Accounts with regional settings correctly aligned with global demand (like the US, UK, or EU markets) are currently seeing a 20% price surge. We recommend focusing your efforts on these high-demand segments to maximize your payout per unit.",
      "Lastly, always use the 'Live Market Board' on our dashboard. Prices fluctuate based on global merchant requirements. Selling when the 'Surge' indicator is active can increase your daily earnings by up to 15% with the exact same amount of effort."
    ],
    author: 'Adnan Sami',
    authorRole: 'Market Analyst',
    date: 'Oct 24, 2024',
    category: 'Tutorial',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 2,
    title: 'Common Mistakes to Avoid While Submitting',
    excerpt: 'Ensure your work gets approved instantly by avoiding these common verification errors.',
    content: [
      "Efficiency is the name of the game at Time Task BD. While our verification team works around the clock, submissions that contain errors can lead to delays or rejections. To ensure your payout is processed instantly, avoid these common pitfalls.",
      "One major error is providing broken or private Google Sheet links. Always double-check that your sharing settings are set to 'Anyone with the link can view.' If our automated system cannot access your data, your submission will be flagged for manual review, adding 24-48 hours to your payout time.",
      "Another frequent issue is quantity mismatch. If your submission says '500 units' but your sheet only contains '480', the entire batch may be rejected to maintain data integrity. Always perform a quick count before hitting the submit button.",
      "Finally, remember that security is paramount. Never include your personal payment PIN or sensitive account passwords inside the submission sheets. Our team will never ask for this information."
    ],
    author: 'Admin Team',
    authorRole: 'Platform Integrity',
    date: 'Oct 22, 2024',
    category: 'Safety',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 3,
    title: 'Why Facebook Market Rates are Rising',
    excerpt: 'Market analysis on the current surge in demand for verified Facebook profiles across global markets.',
    content: [
      "Have you noticed the green indicators on our Facebook asset board lately? There is a significant global shift occurring in the social media advertising space, and it is driving up the value of your digital assets.",
      "Global advertisers are currently facing stricter verification requirements for business accounts. This has created a massive bottleneck in the supply of 'warm' profiles that can reliably run ad campaigns. As a result, the demand for verified assets has hit a three-year high.",
      "At Time Task BD, we have responded by increasing our base payout for Facebook assets by 12%. This is a direct pass-through of the market value we are seeing from our international partners. We expect this trend to continue through the holiday season.",
      "For sellers, this is the perfect time to clear out your inventory. We are currently processing Facebook batches with 98% faster approval times than usual to meet this demand."
    ],
    author: 'Market Analyst',
    authorRole: 'Lead Strategist',
    date: 'Oct 19, 2024',
    category: 'News',
    image: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=800&auto=format&fit=crop'
  }
];

export const PAYOUT_CONFIG = [
  { id: 'bkash', name: 'bKash', color: '#D82D6D', icon: <Smartphone className="w-5 h-5" /> },
  { id: 'nagad', name: 'Nagad', color: '#E11F26', icon: <Wallet className="w-5 h-5" /> },
  { id: 'rocket', name: 'Rocket', color: '#8C338B', icon: <CreditCard className="w-5 h-5" /> },
  { id: 'upay', name: 'Upay', color: '#FFD500', icon: <Smartphone className="w-5 h-5" /> },
  { id: 'crypto', name: 'USDT (TRC20)', color: '#26A17B', icon: <Smartphone className="w-5 h-5" /> },
];

export const PAYOUT_METHODS = PAYOUT_CONFIG.map(p => p.name);
