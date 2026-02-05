import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Menu } from 'lucide-react';

interface SafeImageProps {
  src: string;
  alt: string;
}

function SafeImage({ src, alt }: SafeImageProps) {
  const [error, setError] = useState(false);
  return (
    <img 
      src={error ? 'https://a.storyblok.com/f/267449/800x600/2a72b93bbb/go-lrg.png' : src} 
      alt={alt} 
      onError={() => setError(true)} 
      className="object-contain rounded-xl w-full h-auto" 
    />
  );
}

interface InfographicItem {
  label: string;
  desc: string;
}

interface AnimatedInfographicProps {
  title: string;
  data: InfographicItem[];
}

function AnimatedInfographic({ title, data }: AnimatedInfographicProps) {
  return (
    <motion.div className="w-full p-4 bg-[#FFF8F5] rounded-xl shadow-inner mb-6">
      <h4 className="text-lg font-semibold text-[#EE4C2C] mb-3">{title}</h4>
      <div className="grid grid-cols-3 gap-3">
        {data.map((item, idx) => (
          <motion.div
            key={idx}
            className="p-4 bg-white rounded-lg shadow-md flex flex-col items-center text-center border border-[#FCE5DD]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
          >
            <motion.div 
              className="w-10 h-10 bg-[#EE4C2C] rounded-full mb-2" 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              transition={{ delay: 0.2 + idx * 0.1 }}
            />
            <p className="text-sm font-medium text-gray-800">{item.label}</p>
            <p className="text-xs text-gray-500">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

function Modal({ open, onClose, title, children }: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div 
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50" 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-3xl w-full p-6 relative max-h-[80vh] overflow-y-auto" 
            initial={{ scale: 0.9 }} 
            animate={{ scale: 1 }} 
            exit={{ scale: 0.9 }}
          >
            <button 
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-gray-300" 
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-3 text-[#EE4C2C]">{title}</h2>
            <div className="text-gray-700 dark:text-gray-300 space-y-3">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface ModalContentType {
  title: string;
  children: React.ReactNode;
}

interface Section {
  id: string;
  title: string;
  desc: string;
  keyPoints: string[];
  moreDetails: string;
  img: string;
  infographic?: InfographicItem[];
}

export default function DojoSalesTraining() {
  const [modalContent, setModalContent] = useState<ModalContentType | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleOpenModal = (content: ModalContentType) => setModalContent(content);
  const handleCloseModal = () => setModalContent(null);

  const sections: Section[] = [
    {
      id: 'overview',
      title: '⚡ What is Dojo?',
      desc: 'Dojo provides premium card machines, instant settlements, and flexible funding for UK businesses.',
      keyPoints: [
        'Next-day settlements from 6am.',
        'Premium design and fast transactions.',
        'Award-winning customer service and UK-based support.',
        'Advanced analytics through the Dojo app.',
        'Trusted by thousands of businesses nationwide.'
      ],
      moreDetails: 'Dojo simplifies payments by combining cutting-edge technology and excellent customer service. Businesses benefit from next-day funding, no hidden fees, and 24/7 support. Designed to reduce downtime, Dojo terminals are reliable and easy to set up, helping merchants focus on what they do best - serving their customers.',
      img: 'https://a.storyblok.com/f/267449/1160x800/2a72b93bbb/go-lrg.png'
    },
    {
      id: 'devices',
      title: '💳 Dojo Devices',
      desc: 'Dojo Go, Dojo Pocket, and Tap to Pay on iPhone - seamless payment experiences for any business type.',
      keyPoints: [
        'Dojo Go - countertop terminal with Wi-Fi and SIM backup.',
        'Dojo Pocket - portable device ideal for restaurants and tableside service.',
        'Tap to Pay on iPhone - accept payments with no hardware required.',
        'High-speed performance and easy setup.',
        'Integrated tipping, split-bill and pay-at-table features.'
      ],
      moreDetails: 'Each device is designed with efficiency and style in mind. Dojo Go offers powerful, always-connected performance, while Dojo Pocket gives staff mobility for faster customer service. Tap to Pay allows startups and mobile sellers to accept payments instantly using only their iPhone. Every device syncs with the Dojo app for real-time transaction insights.',
      img: 'https://a.storyblok.com/f/267449/747x800/699e5ddccf/dojo-pocket-terminal.png'
    },
    {
      id: 'sidekick',
      title: '📱 Dojo Sidekick App',
      desc: 'Manage payments, refunds, and analytics from the palm of your hand with the Dojo Sidekick app.',
      keyPoints: [
        'Track real-time sales performance.',
        'Process refunds and manage transactions easily.',
        'Export data and reports for accounting and insights.',
        'Monitor multiple sites or terminals from one dashboard.',
        'Get support or troubleshooting help directly from the app.'
      ],
      moreDetails: 'The Dojo Sidekick app gives merchants full visibility of their payment ecosystem. Users can track daily performance, manage refunds, and export reports - all in one intuitive interface. Perfect for busy owners, it simplifies admin while ensuring they always have access to real-time data wherever they are.',
      img: 'https://a.storyblok.com/f/267449/1080x980/72594d13ed/wired-usp-2-2.jpg'
    },
    {
      id: 'billing',
      title: '🧾 Billing Explained',
      desc: 'Transparent billing with clear fee breakdowns and add-ons for every business.',
      keyPoints: [
        'Transparent pricing model with clear rate breakdowns.',
        'Rates include debit, credit, and corporate cards.',
        'Optional add-ons like Everyday Settlement and Hardware Care.',
        '12-month fixed rate guarantee available.',
        'No hidden fees or complicated invoices.'
      ],
      moreDetails: 'Dojo ensures clarity in billing - no confusing statements, no hidden fees. Merchants receive a transparent breakdown of every charge, from card type fees to optional add-ons. The optional Dojo Plan and Hardware Care offer flexibility, protection, and business insights. This transparency builds trust and makes cost forecasting straightforward.',
      img: 'https://a.storyblok.com/f/267449/1500x1200/8bb74f6651/dojo-go-product-shot.jpg'
    },
    {
      id: 'funding',
      title: '💰 Dojo Funding',
      desc: 'Fast, fixed-fee business funding paid back automatically through card transactions.',
      keyPoints: [
        'Access funding within 48 hours.',
        'No APR or credit score impact for quote checks.',
        'Automatic repayments through card machine transactions.',
        'Flexible funding amounts to suit business needs.',
        '89% of customers retake funding due to satisfaction.'
      ],
      moreDetails: 'Dojo Funding gives businesses access to quick capital without the complexity of traditional loans. Merchants can receive funds within 48 hours and repay automatically through daily card transactions. There is no interest or APR - just one simple fixed fee agreed upfront, providing flexibility and confidence for business growth.',
      img: 'https://a.storyblok.com/f/267449/1080x1078/e6f67e20cd/wired-usp-1-1.jpg'
    },
    {
      id: 'flex',
      title: '⚙️ FLEX Funding',
      desc: 'Automatic funding access linked to Dojo account for flexible, dip-in dip-out capital support.',
      keyPoints: [
        'Available for all new Dojo customers.',
        'Based on trading history after first 7 days.',
        'Instant access to short-term working capital.',
        'No complex applications or waiting times.',
        'Perfect for cash flow management or stock purchases.'
      ],
      moreDetails: 'FLEX Funding is a built-in safety net for businesses using Dojo. Once enabled, it provides instant access to capital when needed - like a business overdraft. Funds can be drawn and repaid automatically, allowing merchants to manage cash flow smoothly without interrupting operations.',
      img: 'https://a.storyblok.com/f/267449/1080x1078/e6f67e20cd/wired-usp-1-1.jpg'
    },
    {
      id: 'usp',
      title: '🏆 Unique Selling Points',
      desc: 'Switch for free with up to £3,000 buy-out, 12-month fixed pricing, or flexible contract.',
      keyPoints: [
        'Free switch and buy-out up to £3,000.',
        'Fixed pricing for 12 months or rolling monthly contract.',
        'Everyday Settlement available for faster cash flow.',
        'Backed by a top-rated Trustpilot reputation.',
        '600+ EPOS integrations for seamless business operations.'
      ],
      moreDetails: 'Dojo unique offers make switching effortless. Qualified businesses can receive up to £3,000 to buy out existing contracts, benefit from 12 months of fixed rates, or enjoy flexible rolling terms. Combined with instant settlements, advanced tech, and unmatched support, Dojo is the perfect choice for growing businesses.',
      img: 'https://a.storyblok.com/f/267449/1080x1078/e6f67e20cd/wired-usp-1-1.jpg'
    },
    {
      id: 'epos',
      title: '🖥️ EPOS Integration',
      desc: 'Cloud-based integrations with 600+ EPOS providers for seamless syncing and reporting.',
      keyPoints: [
        'Integrates with 600+ EPOS providers.',
        'Cloud-based for real-time data syncing.',
        'Simplifies reconciliation and reduces manual errors.',
        'Ideal for hospitality, retail, and multi-site operators.',
        'Backed by reliable UK-based support.'
      ],
      moreDetails: 'Dojo EPOS integrations streamline operations across hospitality and retail. With real-time syncing and error-free reconciliation, businesses save hours on admin and ensure consistent accuracy. Cloud-based integration also ensures data security and easy scalability for multi-site businesses.',
      img: 'https://a.storyblok.com/f/267449/1080x980/72594d13ed/wired-usp-2-2.jpg'
    },
    {
      id: 'trust',
      title: '🤝 Trusted by Thousands',
      desc: 'Dojo is rated Excellent on Trustpilot for reliability, transparency, and fast UK-based support.',
      keyPoints: [
        'Rated 4.6★ on Trustpilot.',
        '24/7 UK-based support team.',
        'Thousands of satisfied business customers.',
        'Transparent communication and consistent service.',
        'Long-term partner to UK SMEs.'
      ],
      moreDetails: 'Dojo has earned an Excellent rating on Trustpilot thanks to its focus on reliability and transparency. Thousands of SMEs trust Dojo for seamless payments, rapid funding, and exceptional customer service. With dedicated UK-based support available 24/7, merchants always have help when they need it most.',
      img: 'https://a.storyblok.com/f/267449/1080x980/72594d13ed/wired-usp-2-2.jpg'
    }
  ];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
      setMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <header className="sticky top-0 z-50 bg-[#1E1E1E] text-white border-b border-[#EE4C2C] shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <h1 className="font-bold text-lg tracking-tight">Dojo Sales & Funding Training</h1>
          <button className="md:hidden text-[#EE4C2C]" onClick={() => setMenuOpen(!menuOpen)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
        <nav className="hidden md:block bg-[#1E1E1E]">
          <ul className="flex gap-6 px-6 py-3 text-sm font-semibold overflow-x-auto">
            {sections.map((s) => (
              <li key={s.id}>
                <button onClick={() => scrollToSection(s.id)} className="hover:text-[#EE4C2C] transition-colors whitespace-nowrap">
                  {s.title.replace(/[^a-zA-Z ]/g, '')}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <AnimatePresence>
          {menuOpen && (
            <motion.aside 
              className="fixed top-0 left-0 w-3/4 h-full bg-[#1E1E1E] text-white z-50 p-6" 
              initial={{ x: '-100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '-100%' }}
            >
              <button className="absolute top-4 right-4 text-white" onClick={() => setMenuOpen(false)}>
                <X className="w-6 h-6" />
              </button>
              <ul className="mt-10 space-y-4 text-lg font-semibold">
                {sections.map((s) => (
                  <li key={s.id}>
                    <button onClick={() => scrollToSection(s.id)} className="w-full text-left hover:text-[#EE4C2C]">
                      {s.title.replace(/[^a-zA-Z ]/g, '')}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.aside>
          )}
        </AnimatePresence>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-12">
        {sections.map((sec, i) => (
          <motion.section 
            key={sec.id} 
            id={sec.id} 
            initial={{ opacity: 0, y: 40 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.1 }} 
            className="scroll-mt-24"
          >
            <Card className="border border-[#FCE5DD] shadow-lg rounded-3xl overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="grid md:grid-cols-2 items-center">
                <div className="p-8">
                  <h2 className="text-2xl font-semibold text-[#EE4C2C] mb-3">{sec.title}</h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-5 leading-relaxed">{sec.desc}</p>
                  {sec.infographic && <AnimatedInfographic title="Visual Overview" data={sec.infographic} />}
                  <div className="flex gap-3 mt-5">
                    <Button 
                      variant="outline" 
                      className="border-[#EE4C2C] text-[#EE4C2C] hover:bg-[#EE4C2C] hover:text-white" 
                      onClick={() => handleOpenModal({ 
                        title: sec.title + ' - Key Talking Points', 
                        children: (
                          <ul className='list-disc pl-5 space-y-2'>
                            {sec.keyPoints.map((point, idx) => <li key={idx}>{point}</li>)}
                          </ul>
                        ) 
                      })}
                      data-testid={`button-keypoints-${sec.id}`}
                    >
                      Key Talking Points
                    </Button>
                    <Button 
                      className="bg-[#EE4C2C] text-white hover:bg-[#d84424]" 
                      onClick={() => handleOpenModal({ 
                        title: sec.title + ' - More Details', 
                        children: <p>{sec.moreDetails}</p>
                      })}
                      data-testid={`button-details-${sec.id}`}
                    >
                      More Details
                    </Button>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-slate-800 p-6 flex justify-center">
                  <SafeImage src={sec.img} alt={sec.title} />
                </div>
              </div>
            </Card>
          </motion.section>
        ))}
      </main>

      <footer className="text-center text-gray-500 dark:text-gray-400 text-sm py-8">
        © PartnerConnector - Dojo Training
      </footer>

      <Modal open={!!modalContent} onClose={handleCloseModal} title={modalContent?.title || ''}>
        {modalContent?.children}
      </Modal>
    </div>
  );
}
