import { CAFE_LIBRARY_TRACKS } from './cafe-library-manifest';

export interface LyricLine {
  time: number; // in seconds
  text: string;
}

export interface TrackData {
  id: string;
  title: string;
  artist: string;
  composer?: string;
  lyricist?: string;
  movie?: string;
  album?: string;
  year?: string;
  startSeconds: number;
  durationSeconds: number;
  auraColor: string; // Hex color for Apple Music style ambient glow
  auraGlow: string;  // CSS rgba string
  lyrics?: LyricLine[];
  src?: string;
  filename?: string;
  originalPath?: string;
  identificationStatus?: 'identified' | 'unidentified';
}

export const PLAYLIST_TRACKS: TrackData[] = [
  {
    id: 'track-01',
    title: 'Neele Neele Ambar Par',
    artist: 'Kishore Kumar',
    composer: 'Kalyanji-Anandji',
    lyricist: 'Indeevar',
    movie: 'Kalaakaar',
    year: '1983',
    startSeconds: 0,
    durationSeconds: 318,
    auraColor: '#1E3A8A', // Deep Starry Sapphire
    auraGlow: 'rgba(30, 58, 138, 0.6)',
    lyrics: [
      { time: 0, text: '♪ (Acoustic 12-string guitar & sitar intro) ♪' },
      { time: 24, text: 'Neele neele ambar par chaand jab aaye' },
      { time: 42, text: 'Pyaar barsaaye, humko tarsaaye' },
      { time: 62, text: 'Aisa koi saathi ho, aisa koi premi ho' },
      { time: 82, text: 'Pyaas dil ki bujha jaaye...' },
      { time: 105, text: 'Neele neele ambar par chaand jab aaye' },
      { time: 132, text: '♪ (Warm sitar solo over vintage adda tea clinks) ♪' },
      { time: 154, text: 'Gungunati huyi koi barkha aaye' },
      { time: 178, text: 'Chanchal hawa ka jhonka choom ke chala jaaye' },
      { time: 204, text: 'Khilte hue phoolon mein rang naya bhar jaaye' },
      { time: 232, text: 'Aisa koi saathi ho, aisa koi premi ho' },
      { time: 258, text: 'Pyaar barsaaye, humko tarsaaye' },
      { time: 285, text: 'Neele neele ambar par chaand jab aaye...' },
    ],
  },
  {
    id: 'track-02',
    title: 'Ae Kash Ke Hum',
    artist: 'Kumar Sanu',
    composer: 'Jatin-Lalit',
    lyricist: 'Majrooh Sultanpuri',
    movie: 'Kabhi Haan Kabhi Naa',
    year: '1994',
    startSeconds: 318,
    durationSeconds: 306,
    auraColor: '#D97706', // Vintage Sunset Amber
    auraGlow: 'rgba(217, 119, 6, 0.6)',
    lyrics: [
      { time: 318, text: '♪ (Mellow accordion & street tapri guitar melody) ♪' },
      { time: 334, text: 'Ae kash ke hum hosh mein ab aane na paaye' },
      { time: 356, text: 'Bas nagmein tere pyaar ke gaate hi jaaye' },
      { time: 378, text: 'Khilati mahekti yeh zulfon ki shaam' },
      { time: 398, text: 'Haste khanakte yeh hothon ke jaam' },
      { time: 420, text: 'Aa jhoom ke saath uthaye...' },
      { time: 442, text: 'Bas nagmein tere pyaar ke gaate hi jaaye' },
      { time: 468, text: 'Khoye rahe hum nasha mein yahan' },
      { time: 492, text: 'Ae kash ke hum hosh mein ab aane na paaye...' },
    ],
  },
  {
    id: 'track-03',
    title: 'Yeh Ladka Hai Allah',
    artist: 'Udit Narayan, Alka Yagnik',
    composer: 'Jatin-Lalit',
    lyricist: 'Sameer Anjaan',
    movie: 'Kabhi Khushi Kabhie Gham',
    year: '2001',
    startSeconds: 624,
    durationSeconds: 324,
    auraColor: '#059669', // Festive Emerald Teal
    auraGlow: 'rgba(5, 150, 105, 0.6)',
    lyrics: [
      { time: 624, text: '♪ (Playful brass shehnai & festive dholak) ♪' },
      { time: 640, text: 'Yeh ladka hai allah, kaisa hai deewana...' },
      { time: 658, text: 'Kitna mushkil hai tauba isko samjhana' },
      { time: 678, text: 'Ke shokhi se dekhe, nakhre dikhaye' },
      { time: 700, text: 'Banno re banno meri chali sasural ko...' },
      { time: 724, text: 'Banno ki mehandi, banno ka kangana' },
      { time: 750, text: 'Yeh ladka hai allah, kaisa hai deewana!' },
    ],
  },
  {
    id: 'track-04',
    title: 'Saajanji Ghar Aaye',
    artist: 'Kumar Sanu, Alka Yagnik, Kavita K.',
    composer: 'Jatin-Lalit',
    lyricist: 'Sameer Anjaan',
    movie: 'Kuch Kuch Hota Hai',
    year: '1998',
    startSeconds: 948,
    durationSeconds: 433,
    auraColor: '#DB2777', // Sangeet Royal Magenta
    auraGlow: 'rgba(219, 39, 119, 0.6)',
    lyrics: [
      { time: 948, text: '♪ (Grand trumpet fanfare & sangeet bells) ♪' },
      { time: 968, text: 'Kab se aaye hain tere dulhe raja' },
      { time: 988, text: 'Ab to aaja o rani der na laga...' },
      { time: 1010, text: 'Saajanji ghar aaye, saajanji ghar aaye' },
      { time: 1032, text: 'Dulhan kyon sharmaaye, saajanji ghar aaye' },
      { time: 1060, text: 'Aankhon mein khumaar, chehre pe noor hai' },
      { time: 1090, text: 'Saajanji ghar aaye, saajanji ghar aaye...' },
    ],
  },
  {
    id: 'track-05',
    title: 'Tujhe Yaad Na Meri Aayee',
    artist: 'Udit Narayan, Alka Yagnik, Manpreet A.',
    composer: 'Jatin-Lalit',
    lyricist: 'Sameer Anjaan',
    movie: 'Kuch Kuch Hota Hai',
    year: '1998',
    startSeconds: 1381,
    durationSeconds: 421,
    auraColor: '#DC2626', // Crimson Ruby Melancholy
    auraGlow: 'rgba(220, 38, 38, 0.6)',
    lyrics: [
      { time: 1381, text: '♪ (Soft thunder, emotional violin & drizzle) ♪' },
      { time: 1400, text: 'Tujhe yaad na meri aayee, kisi se ab kya kehna' },
      { time: 1424, text: 'Dil roye ya aansoo bahaye, kisi se ab kya kehna' },
      { time: 1450, text: 'Tujhe har khushi de di, labon ki hansi de di' },
      { time: 1478, text: 'Ek bas dard diya tune, dil tod diya tune' },
      { time: 1510, text: 'Tujhe yaad na meri aayee, kisi se ab kya kehna...' },
    ],
  },
  {
    id: 'track-06',
    title: 'Say Shava Shava',
    artist: 'Aadesh Shrivastava, Sudesh Bhosle, Sunidhi C.',
    composer: 'Aadesh Shrivastava',
    lyricist: 'Sameer Anjaan',
    movie: 'Kabhi Khushi Kabhie Gham',
    year: '2001',
    startSeconds: 1802,
    durationSeconds: 408,
    auraColor: '#EA580C', // High Energy Tangerine
    auraGlow: 'rgba(234, 88, 12, 0.6)',
    lyrics: [
      { time: 1802, text: '♪ (Dhol beats & traditional brass explosion) ♪' },
      { time: 1818, text: 'Roop hai tera sona, soni teri paayal' },
      { time: 1836, text: 'Chhan chhan aisi khanke, kar de sabko ghaayal' },
      { time: 1856, text: 'Say shava shava, say shava shava!' },
      { time: 1880, text: 'Mahiya ve aaja maahi, mahiya ve aaja...' },
    ],
  },
  {
    id: 'track-07',
    title: 'Raat Ka Nasha',
    artist: 'K.S. Chithra',
    composer: 'Anu Malik',
    lyricist: 'Gulzar',
    movie: 'Asoka',
    year: '2001',
    startSeconds: 2210,
    durationSeconds: 312,
    auraColor: '#4338CA', // Midnight Velvet Indigo
    auraGlow: 'rgba(67, 56, 202, 0.6)',
    lyrics: [
      { time: 2210, text: '♪ (Bansuri flute echoes over moonlight river) ♪' },
      { time: 2230, text: 'Raat ka nasha abhi aankh se gaya nahi' },
      { time: 2255, text: 'Aankh mein khumaar hai, raat ka nasha...' },
      { time: 2280, text: 'Subah ki kiran ne abhi choo ke bhi jagaaya nahi' },
      { time: 2310, text: 'Raat ka nasha abhi aankh se gaya nahi...' },
    ],
  },
  {
    id: 'track-08',
    title: 'Babuji Zara Dheere Chalo',
    artist: 'Sonu Kakkar, Sukhwinder Singh',
    composer: 'Sandeep Chowta',
    lyricist: 'Abbas Tyrewala',
    movie: 'Dum',
    year: '2003',
    startSeconds: 2522,
    durationSeconds: 297,
    auraColor: '#C2410C', // Fiery Rust Cinnamon
    auraGlow: 'rgba(194, 65, 12, 0.6)',
    lyrics: [
      { time: 2522, text: '♪ (Raw acoustic groove & rustic beats) ♪' },
      { time: 2540, text: 'Babuji zara dheere chalo, bijli khadi yahan bijli khadi' },
      { time: 2568, text: 'Nazar bachake aage badho, thokar lagegi badi' },
    ],
  },
  {
    id: 'track-09',
    title: 'Woh To Hai Albela',
    artist: 'Kumar Sanu, Devaki Pandit',
    composer: 'Jatin-Lalit',
    lyricist: 'Majrooh Sultanpuri',
    movie: 'Kabhi Haan Kabhi Naa',
    year: '1994',
    startSeconds: 2819,
    durationSeconds: 307,
    auraColor: '#CA8A04', // Nostalgic Mustard Ochre
    auraGlow: 'rgba(202, 138, 4, 0.6)',
    lyrics: [
      { time: 2819, text: '♪ (Warm tapri strings & cheerful whistle) ♪' },
      { time: 2835, text: 'Woh to hai albela, hazaaron mein akela' },
      { time: 2855, text: 'Sada tumne aib dekha, hunar to na dekha...' },
    ],
  },
  {
    id: 'track-10',
    title: 'San Sanana',
    artist: 'Alka Yagnik, Hema Sardesai',
    composer: 'Anu Malik',
    lyricist: 'Anand Bakshi',
    movie: 'Asoka',
    year: '2001',
    startSeconds: 3126,
    durationSeconds: 354,
    auraColor: '#0D9488', // Mystical Wind Turquoise
    auraGlow: 'rgba(13, 148, 136, 0.6)',
    lyrics: [
      { time: 3126, text: '♪ (Wind chimes, earthen pots & flowing water) ♪' },
      { time: 3144, text: 'San sanana nan, ja ja re ja re pawan' },
      { time: 3168, text: 'Mere jaisa dhoondh ke la mera sajan...' },
    ],
  },
  {
    id: 'track-11',
    title: 'Banke Tera Jogi',
    artist: 'Sonu Nigam, Alka Yagnik',
    composer: 'Jatin-Lalit',
    lyricist: 'Javed Akhtar',
    movie: 'Phir Bhi Dil Hai Hindustani',
    year: '2000',
    startSeconds: 3480,
    durationSeconds: 281,
    auraColor: '#E11D48', // Desert Rose Crimson
    auraGlow: 'rgba(225, 29, 72, 0.6)',
    lyrics: [
      { time: 3480, text: '♪ (Rajasthani morchang & upbeat tabla) ♪' },
      { time: 3498, text: 'Banke tera jogi, main prem nagar mein aaya' },
      { time: 3522, text: 'Tere ishq mein jogan ban jaaun...' },
    ],
  },
  {
    id: 'track-12',
    title: 'Aye Zindagi Gale Lagaa Le',
    artist: 'Suresh Wadkar',
    composer: 'Ilaiyaraaja',
    lyricist: 'Gulzar',
    movie: 'Sadma',
    year: '1983',
    startSeconds: 3761,
    durationSeconds: 329,
    auraColor: '#65A30D', // Gentle Olive Forest
    auraGlow: 'rgba(101, 163, 13, 0.6)',
    lyrics: [
      { time: 3761, text: '♪ (Ilaiyaraaja gentle acoustic string arrangement) ♪' },
      { time: 3780, text: 'Aye zindagi gale lagaa le, humne bhi tere har ek gham ko' },
      { time: 3810, text: 'Gale se lagaaya hai, hai na?' },
      { time: 3840, text: 'Humne bahaane se, chhup ke zamaane se' },
      { time: 3870, text: 'Palkon ke parde mein ghar bhar liya...' },
    ],
  },
  {
    id: 'track-13',
    title: 'Woh Pehli Baar',
    artist: 'Shaan',
    composer: 'Vishal-Shekhar',
    lyricist: 'Raj Kaushal',
    movie: 'Pyaar Mein Kabhi Kabhi',
    year: '1999',
    startSeconds: 4090,
    durationSeconds: 259,
    auraColor: '#0284C7', // Rainy Sky Cerulean
    auraGlow: 'rgba(2, 132, 199, 0.6)',
    lyrics: [
      { time: 4090, text: '♪ (Clean acoustic rhythm guitar & young collegiate smile) ♪' },
      { time: 4108, text: 'Woh pehli baar jab hum mile, haathon mein haath jab aaye' },
      { time: 4132, text: 'Deewana dil tha bekhabar, baatein ajeeb si kar gaya...' },
      { time: 4160, text: 'Woh pehli baar jab hum mile...' },
    ],
  },
  {
    id: 'track-14',
    title: 'Dil Pardesi Ho Gayaa',
    artist: 'Sonu Nigam, Alka Yagnik',
    composer: 'Usha Khanna',
    lyricist: 'Saawan Kumar',
    movie: 'Dil Pardesi Ho Gayaa',
    year: '2003',
    startSeconds: 4349,
    durationSeconds: 345,
    auraColor: '#B45309', // Roasted Cardamom Amber
    auraGlow: 'rgba(180, 83, 9, 0.6)',
    lyrics: [
      { time: 4349, text: '♪ (Valley echoes, mandolin & dholak) ♪' },
      { time: 4370, text: 'Mera dil pardesi ho gaya, o rabba kaisa rog lag gaya...' },
    ],
  },
  {
    id: 'track-15',
    title: 'Neele Neele Ambar Par (Female)',
    artist: 'Sadhana Sargam',
    composer: 'Kalyanji-Anandji',
    lyricist: 'Indeevar',
    movie: 'Kalaakaar',
    year: '1983',
    startSeconds: 4694,
    durationSeconds: 260,
    auraColor: '#2563EB', // Midnight Starry Cobalt
    auraGlow: 'rgba(37, 99, 235, 0.6)',
    lyrics: [
      { time: 4694, text: '♪ (Sweet strings & moonlight reprise) ♪' },
      { time: 4712, text: 'Neele neele ambar par chaand jab aaye' },
      { time: 4735, text: 'Pyaar barsaaye, humko tarsaaye...' },
    ],
  },
];

// Fallback color mapping for custom requested tracks like 'Tadap Tadap' or 'Khuda Jaane'
export const AMBIENT_AURA_MAP: Record<string, { auraColor: string; auraGlow: string }> = {
  'tadap tadap': { auraColor: '#B91C1C', auraGlow: 'rgba(185, 28, 28, 0.65)' },
  'khuda jaane': { auraColor: '#0284C7', auraGlow: 'rgba(2, 132, 199, 0.65)' },
  'default 1900s': { auraColor: '#D97706', auraGlow: 'rgba(217, 119, 6, 0.65)' },
  'default 2020s': { auraColor: '#0D9488', auraGlow: 'rgba(13, 148, 136, 0.65)' },
};

export { CAFE_LIBRARY_TRACKS };

export const getPlaylistForEra = (era: '1900s' | '2020s'): TrackData[] => {
  return era === '2020s' ? CAFE_LIBRARY_TRACKS : PLAYLIST_TRACKS;
};

