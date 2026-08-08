import type {
  Project,
  Achievement,
  Certification,
  ExperienceItem,
  Education,
  SkillCategory,
  NavLink,
} from '../_types';

export const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Skills', href: '#skills' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Contact', href: '#contact' },
];

export const ROLES = [
  'Computer Engineer',
  'Embedded Systems Developer',
  'IoT & Robotics Enthusiast',
  'Full-Stack Developer',
];

export const PERSONAL_INFO = {
  fullName: 'Lorence B. Ojales',
  address: 'Lipa City, Batangas',
  phone: '09682313762',
  email: 'lorence.ojales@gmail.com',
  universityEmail: '1620052@ub.edu.ph',
  socials: {
    facebook: 'https://www.facebook.com/lorence.ojales',
    instagram: 'https://www.instagram.com/lrenceo_/',
    linkedin: 'https://www.linkedin.com/in/lorenceojales/',
    github: 'https://github.com/Rensushii',
  },
};

export const PROJECTS: Project[] = [
  {
    id: 'tugon',
    title: 'Tugon Lipa · Smart Community Platform',
    description:
      'AI-powered citizen reporting & response system — 2nd Place, Hack the Future.',
    tags: ['LLM', 'Full-Stack', 'Civic Tech'],
    bgClass: 'bg-tugon',
    image: '/images/projects/tugonlipa/tugon-bg.jpg',
    gallery: Array.from(
      { length: 8 },
      (_, i) => `/images/projects/tugonlipa/tugon${i + 1}.jpg`
    ),
    modalContent: {
      subtitle:
        '2nd Place · Hack the Future: Smart Batangas Province Hackathon Challenge',
      problem:
        'In Lipa City, citizens struggled with fragmented public service channels. Reporting issues meant navigating confusing phone trees, visiting barangay halls, or relying on social media posts that often went unanswered. LGUs lacked a centralized system to track and resolve citizen reports efficiently.',
      solution:
        'My team built TugonLipa, an integrated smart community platform combining a centralized emergency and service hotline, a barangay-focused social feed, and an AI-driven assistance agent. Citizens submit reports with photos, receive real-time case updates, and access official announcements — all from one unified interface.',
      tech: [
        'LangChain',
        'RAG',
        'Automation',
        'LLM Integration',
        'Custom Report System',
        'Social feed integration',
      ],
      awardLink:
        'https://ub.edu.ph/tugon-lipa-project-secures-2nd-place-at-philippine-innovation-conference-2025/',
    },
  },
  {
    id: 'ecoflow',
    title: 'Eco Flow · Smart Greenhouse',
    description:
      'AI-powered IoT system with automated irrigation, analytics, and real-time monitoring.',
    tags: ['IoT', 'AI/ML', 'Raspberry Pi', 'ESP32'],
    bgClass: 'bg-ecoflow',
    image: '/images/projects/ecoflow/ecoflow-bg.jpg',
    gallery: Array.from(
      { length: 10 },
      (_, i) => `/images/projects/ecoflow/ecoflow${i + 1}.jpg`
    ),
    liveUrl: 'https://ecoflowgreenhouse.vercel.app',
    modalContent: {
      subtitle: 'Undergraduate Thesis · University of Batangas Lipa Campus (2025-2026)',
      problem:
        'At the University of Batangas Lipa Campus, the "Punla Para sa Kalikasan" greenhouse relied on manual irrigation — inconsistent watering, subjective judgment, and no real-time data.',
      solution:
        'I co-developed Eco Flow, a fully automated greenhouse system integrating IoT monitoring, data analytics, and AI-based water scheduling using Raspberry Pi 5 and ESP32.',
      results:
        'Eco Flow achieved 94.74% water utilization efficiency (vs. 70.83% manual), reduced daily water consumption by 29%, and earned a 95.4% performance rating under ISO 25010 standards.',
      tech: [
        'Raspberry Pi 5',
        'ESP32',
        'Python (Flask)',
        'SQLite',
        'Scikit-learn',
        'Arduino IDE',
        'DHT22',
        'Capacitive soil moisture',
        'Solid-state relays',
        'Fusion 360',
        'Eagle CAD',
      ],
      fusion360: ['https://a360.co/3Z1v7yZ', 'https://a360.co/3Nc3jpi'],
    },
  },
  {
    id: 'mazebot',
    title: 'MazeBot',
    description:
      'Autonomous wall-following robot using sensors and reactive control on an ESP32.',
    tags: ['ESP32', 'Robotics', 'Embedded C', 'Sensors'],
    bgClass: 'bg-mazebot',
    image: '/images/projects/mazebot/mazebot-bg.jpg',
    gallery: [],
    modalContent: {
      subtitle: 'Embedded Systems Exercise · Reactive Control & Sensor Fusion',
      problem:
        'Maze navigation and autonomous obstacle avoidance are fundamental challenges in mobile robotics requiring real-time decision-making.',
      solution:
        'I built MazeBot using three VL53L0X TOF sensors, an ESP32, and a DRV8833 motor driver with differential steering.',
      results:
        'MazeBot reliably follows walls, navigates 90° and 180° turns, and resolves T-junctions — built for under ₱2,000.',
      tech: [
        'ESP32',
        'Arduino IDE',
        'VL53L0X TOF (x3)',
        'GA12-NC20 motors',
        'DRV8833 driver',
        '18650 Li-ion',
        'Fusion 360',
      ],
      fusion360: ['https://a360.co/478fxXO'],
    },
  },
  {
    id: 'genbacheck',
    title: 'GenbaCheck Attendance',
    description:
      'Offline-first, IoT-powered event check-in system with QR, captive portal & MAC tracking.',
    tags: ['ESP32', 'IoT', 'Next.js', 'Supabase'],
    bgClass: 'bg-genbacheck',
    image: '/images/projects/genbacheck/genbacheck-bg.jpg',
    gallery: Array.from(
      { length: 5 },
      (_, i) => `/images/projects/genbacheck/genbacheck${i + 1}.jpg`
    ),
    liveUrl: 'https://genbacheck.vercel.app',
    modalContent: {
      subtitle:
        'Offline-first, IoT-powered event check-in system — QR, captive portal & MAC tracking',
      overview:
        'GenbaCheck Attendance is an offline-first, IoT-powered event check-in system that eliminates paper queues and prevents fraudulent attendance. Attendees scan a QR code displayed on an ESP32\'s OLED screen, automatically join a private Wi-Fi network, and are greeted by a captive portal registration form. Their device\'s MAC address is captured to enforce a one-time-only policy, and after a successful check-in the device is instantly disconnected. All data is synced via a laptop service to a cloud database and displayed on a live, responsive web dashboard.',
      features: [
        'ESP32 + OLED generates a Wi-Fi QR code (WPA2-secured) that attendees scan with their phone camera.',
        'Captive portal automatically opens a registration page – no app installation, no URL typing.',
        "The attendee's MAC address is logged and checked against a local/cloud database.",
        'After successful registration, the ESP32 deauthenticates the device, freeing the AP slot and preventing re-registration.',
        'A Python background service on a laptop reads data via USB serial, caches it in SQLite, and syncs it to Supabase (cloud PostgreSQL).',
        'A Next.js dashboard (deployed on Vercel) displays real-time attendance, supports search & time-range filtering, and offers a one-click Windows installer for the laptop service.',
      ],
      tech: [
        'ESP32',
        'SSD1306 OLED (I2C)',
        'Wi-Fi AP',
        'Arduino (C++)',
        'esp_wifi',
        'DNSServer',
        'WebServer',
        'Nayuki QR code generator',
        'Python 3',
        'pyserial',
        'supabase',
        'sqlite3',
        'Supabase (PostgreSQL)',
        'Next.js 16',
        'TypeScript',
        'Tailwind CSS',
        'Vercel',
        'USB Serial',
        'REST API',
      ],
    },
  },
  {
    id: 'nyc',
    title: 'NYC Crash Analytics',
    description:
      'Interactive dashboard with Leaflet, heatmaps, Chart.js, and PHP/MySQL backend.',
    tags: ['PHP', 'MySQL', 'Leaflet', 'Chart.js'],
    bgClass: 'bg-nyc',
    image: '/images/projects/nyc/nyc-bg.jpg',
    gallery: Array.from({ length: 9 }, (_, i) => `/images/projects/nyc/nyc${i + 1}.jpg`),
    liveUrl: 'https://lorence.kesug.com',
    modalContent: {
      subtitle: 'Full-stack interactive dashboard for motor-vehicle collision data',
      overview:
        'NYC Crash Analytics transforms raw NYC Open Data into an interactive visual exploration tool with PHP, MySQL, and vanilla JavaScript.',
      features: [
        'Responsive dark-theme interface with Leaflet maps, marker clustering, heatmaps, time-slider, and Chart.js visualizations.',
      ],
      tech: [
        'PHP',
        'MySQL',
        'JavaScript',
        'Leaflet',
        'Chart.js',
        'Bootstrap',
        'REST APIs',
        'CSV/JSON/PDF Export',
      ],
    },
  },
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'hackathon',
    title: 'Hackathon Winner',
    subtitle: '2nd Place · Hack the Future: Smart Batangas Province Hackathon Challenge',
    venue: 'University of Batangas, Batangas City',
    date: 'November 21–22, 2025',
    badge: 'silver',
    image: '/images/achievements/hackathon.jpg',
    description:
      'My team and I developed TugonLipa, an AI-powered smart community platform that earned 2nd Place at the Hack the Future: Smart Batangas Province Hackathon Challenge. The platform integrates a centralized emergency hotline, a barangay-focused social feed, and an AI-driven assistance agent to help citizens report issues and receive real-time updates. This achievement reflects our ability to rapidly prototype, integrate AI, and deliver civic technology that addresses real community needs.',
    link: 'https://ub.edu.ph/tugon-lipa-project-secures-2nd-place-at-philippine-innovation-conference-2025/',
  },
  {
    id: 'breadboarding',
    title: 'Breadboarding Competition',
    subtitle: 'Participant · ICpEp.se Region 4A CPE Challenge 2025',
    venue: 'Colegio de San Juan de Letran, Calamba, Laguna',
    date: 'November 15, 2025',
    badge: 'participant',
    image: '/images/achievements/breadboarding.jpg',
    description:
      'Participated in the Breadboarding Competition at the ICpEp.se Region 4A CPE Challenge 2025, demonstrating hands-on circuit design and prototyping skills. The competition tested our ability to quickly assemble and debug electronic circuits under time pressure, reinforcing my practical knowledge of analog and digital electronics.',
  },
  {
    id: 'programming',
    title: 'C++ Programming Competition',
    subtitle: 'Participant · ICpEp.se Region 4A CPE Challenge 2024',
    venue: 'De La Salle Lipa, Lipa City, Batangas',
    date: 'December 3, 2024',
    badge: 'participant',
    image: '/images/achievements/programming.jpg',
    description:
      'Competed in the C++ Programming Competition at the ICpEp.se Region 4A CPE Challenge 2024, solving algorithmic problems under a timed setting. The experience sharpened my problem-solving skills, algorithmic thinking, and ability to write efficient, clean C++ code under pressure.',
  },
];

export const CERTIFICATIONS: Certification[] = [
  {
    title: 'IEEE Open Silicon TinyTapeout Philippine IC Design Bootcamp',
    date: 'April 29, 2026',
    categories: ['seminar'],
    imgUrl: '/images/certifications/ieee-tinytapeout.jpg',
  },
  {
    title: 'Network Support and Security',
    date: 'March 23, 2026',
    categories: ['training'],
    imgUrl: '/images/certifications/network-support-security.jpg',
  },
  {
    title: 'Digital Safety and Security Awareness',
    date: 'March 23, 2026',
    categories: ['training'],
    imgUrl: '/images/certifications/digital-safety.jpg',
  },
  {
    title: 'Introduction to Modern AI',
    date: 'March 9, 2026',
    categories: ['training'],
    imgUrl: '/images/certifications/intro-modern-ai.jpg',
  },
  {
    title: 'Ethical Hacker',
    date: 'February 25, 2026',
    categories: ['training'],
    imgUrl: '/images/certifications/ethical-hacker.jpg',
  },
  {
    title: 'Practical Application of Cybersecurity Framework',
    date: 'December 6, 2025',
    categories: ['webinar', 'icpep'],
    imgUrl: '/images/certifications/cybersecurity-framework.jpg',
  },
  {
    title: 'Tugon Lipa – 2nd place in the Hack the Future: Smart Batangas Province Hackathon',
    date: 'November 22, 2025',
    categories: ['hackathon'],
    imgUrl: '/images/certifications/tugon-lipa-hackathon.jpg',
  },
  {
    title: 'Batangas AI and Cybersecurity Congress 2025',
    date: 'November 7, 2025',
    categories: ['seminar'],
    imgUrl: '/images/certifications/batangas-ai-cybersecurity.jpg',
  },
  {
    title: 'Cyber 101 for Institute of Computer Engineers of the Philippines, Inc.',
    date: 'April 24, 2025',
    categories: ['webinar', 'icpep'],
    imgUrl: '/images/certifications/cyber-101.jpg',
  },
  {
    title: 'AI and Prompt Engineering in Educational Settings',
    date: 'April 5, 2025',
    categories: ['webinar', 'icpep'],
    imgUrl: '/images/certifications/ai-prompt-engineering.jpg',
  },
  {
    title:
      'Hybrid AVG-drone using YOLOv8 and Arduino-Raspberry Pi for defect detection and structural health monitoring in built infrastructure',
    date: 'March 22, 2025',
    categories: ['webinar', 'icpep'],
    imgUrl: '/images/certifications/hybrid-drone.jpg',
  },
  {
    title:
      'Training and Education in Medical Imaging for AI in PACS: Equipping the Next Generation',
    date: 'March 8, 2025',
    categories: ['webinar', 'icpep'],
    imgUrl: '/images/certifications/medical-imaging-ai.jpg',
  },
  {
    title: 'CCNAv7: Introduction to Networks',
    date: 'January 21, 2025',
    categories: ['training'],
    imgUrl: '/images/certifications/ccna-intro-networks.jpg',
  },
  {
    title: 'Tech Nexus 2024: Empowering Campus Innovators',
    date: 'December 7, 2024',
    categories: ['seminar'],
    imgUrl: '/images/certifications/tech-nexus-2024.jpg',
  },
];

export const CERT_CATEGORY_LABELS: Record<string, string> = {
  all: 'All',
  webinar: 'Online Webinar',
  icpep: 'ICpEP',
  training: 'Course/Training',
  seminar: 'Seminar',
  hackathon: 'Hackathon',
};

export const EXPERIENCES: ExperienceItem[] = [
  {
    date: 'June 18, 2025 – August 5, 2025',
    title: 'IT Technical Support Intern',
    org: 'JTEKT Philippines Corporation · LIMA Technology Center, Malvar, Batangas',
    details: [
      'IT support, hardware/network troubleshooting',
      'Server monitoring, system updates, backups',
      'Technical documentation and end-user assistance',
    ],
  },
  {
    date: 'March 1, 2022 – March 10, 2022',
    title: 'Work Immersion Student',
    org: 'Torres Technology Center Corporation · Brgy. Makiling, Calamba City, Laguna',
    details: [
      'Hands-on exposure to technology operations',
      'Assisted team tasks and observed industry practices',
    ],
  },
];

export const EDUCATION: Education = {
  title: 'BS Computer Engineering (Cum Laude)',
  org: 'University of Batangas – Lipa Campus',
  date: '2022 – 2026',
};

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: 'Programming Languages',
    icon: 'Code2',
    skills: ['Python', 'JavaScript', 'TypeScript', 'C', 'C++', 'PHP', 'Java', 'SQL'],
  },
  {
    title: 'Embedded Systems & IoT',
    icon: 'Cpu',
    skills: [
      'ESP32',
      'Raspberry Pi',
      'Arduino',
      'I2C/SPI/UART',
      'Firmware Dev',
      'Sensor Integration',
      'Embedded Debugging',
      'HW/SW Integration',
    ],
  },
  {
    title: 'Backend & Databases',
    icon: 'Server',
    skills: ['Flask', 'REST APIs', 'MySQL', 'PostgreSQL', 'SQLite', 'MongoDB', 'Supabase'],
  },
  {
    title: 'AI, ML & Automation',
    icon: 'BrainCircuit',
    skills: [
      'YOLO',
      'Roboflow',
      'Scikit-learn',
      'LLM Integration',
      'LangChain',
      'Computer Vision',
      'n8n Automation',
    ],
  },
  {
    title: 'DevOps & Tools',
    icon: 'Wrench',
    skills: ['Git', 'GitHub', 'Docker', 'Linux', 'VS Code', 'REST APIs', 'System Configuration'],
  },
];

export const PROJECT_BG_CLASS: Record<string, string> = {
  'bg-tugon': '#1a1008',
  'bg-ecoflow': '#081a10',
  'bg-mazebot': '#0a0a1a',
  'bg-genbacheck': '#0c0e1a',
  'bg-nyc': '#080a18',
};
