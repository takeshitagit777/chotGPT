/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Plus, 
  MessageSquare, 
  Smile, 
  FlaskConical, 
  Lightbulb, 
  Coffee, 
  Settings, 
  HelpCircle, 
  Info, 
  ChevronRight, 
  Sparkles, 
  Send, 
  Menu, 
  X,
  Crown,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
  <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 group ${
    active ? 'bg-gray-50 text-gray-900 font-semibold' : 'hover:bg-gray-50 text-gray-600'
  }`}>
    <Icon className={`w-4 h-4 ${active ? 'text-green-600' : 'text-gray-400 group-hover:text-green-600'}`} />
    <span className="text-sm">{label}</span>
  </div>
);

const RobotIllustration = () => {
  return (
    <div className="relative flex flex-col items-center">
      <motion.div 
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="w-48 h-48 relative"
      >
        {/* Antenna */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-6 bg-slate-400 rounded-full">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-chot-green rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
        </div>
        
        {/* Head */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-40 h-32 bg-white rounded-[40px] shadow-xl border-4 border-gray-50 flex items-center justify-center p-4">
          {/* Face Display */}
          <div className="w-full h-full bg-slate-800 rounded-[28px] relative overflow-hidden flex flex-col items-center justify-center gap-2">
            {/* Eyes */}
            <div className="flex gap-6">
              <div className="w-3 h-4 bg-chot-green rounded-full opacity-80" />
              <div className="w-3 h-4 bg-chot-green rounded-full opacity-80" />
            </div>
            {/* Mouth (sweat drop look) */}
            <div className="w-6 h-1 bg-slate-600 rounded-full" />
            
            {/* Sweat Drop */}
            <div className="absolute top-4 right-4 text-blue-400">
               <div className="w-2 h-4 bg-blue-300 rounded-full opacity-60 blur-[1px]" />
            </div>
          </div>
        </div>
        
        {/* Body */}
        <div className="absolute top-36 left-1/2 -translate-x-1/2 w-32 h-12 bg-white rounded-t-3xl shadow-lg border-x-4 border-t-4 border-gray-50" />
        
        {/* Arms (optional but keeping simple) */}
        <div className="absolute top-24 -left-4 w-10 h-10 bg-white rounded-full shadow-md border-2 border-gray-100" />
        <div className="absolute top-24 -right-4 w-10 h-10 bg-white rounded-full shadow-md border-2 border-gray-100" />
      </motion.div>
      
      {/* Speech Bubble */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8, x: 20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ delay: 1 }}
        className="absolute top-0 -right-24 bg-white px-5 py-3 rounded-2xl shadow-lg border border-gray-100 text-sm font-medium text-slate-600 after:content-[''] after:absolute after:bottom-4 after:-left-2 after:w-4 after:h-4 after:bg-white after:border-l after:border-b after:border-gray-100 after:rotate-45"
      >
        うーん… <br /> あと一歩、届かない…
      </motion.div>
    </div>
  );
};

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // initial check
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-chot-gray">
      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isSidebarOpen && windowWidth < 1024 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ 
          width: isSidebarOpen ? 260 : 0,
          x: isSidebarOpen ? 0 : -260
        }}
        className={`fixed lg:relative bg-white h-screen border-r border-gray-100 z-50 flex flex-col overflow-hidden shadow-[4px_0_12px_rgba(0,0,0,0.02)]`}
      >
        <div className="p-5 flex flex-col h-full min-w-[260px]">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-chot-green-soft text-green-600 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 fill-current" />
            </div>
            <h1 className="text-xl font-bold font-display tracking-tight text-gray-900">chotGPT</h1>
          </div>

          {/* New Chat Button */}
          <button className="flex items-center justify-center gap-2 w-full py-3 bg-chot-green-soft text-green-700 hover:bg-[#D5EEDC] rounded-2xl font-semibold border border-green-100/50 transition-all mb-6 text-sm">
            <Plus className="w-4 h-4" />
            <span>ちょっと新しく聞く</span>
          </button>

          {/* Main Menu */}
          <nav className="space-y-1 flex-1">
            <SidebarItem icon={MessageSquare} label="あとちょっと相談室" active />
            <SidebarItem icon={Smile} label="気まずい返信処理室" />
            <SidebarItem icon={FlaskConical} label="やる気ゼロ研究所" />
            <SidebarItem icon={Lightbulb} label="丸投げアイデア置き場" />
            <SidebarItem icon={Coffee} label="雑談でもいいよね" />
          </nav>

          {/* Bottom Menu */}
          <div className="mt-4 pt-4 border-t border-gray-50 text-sm text-gray-500">
            <a href="#" className="block px-3 py-2 hover:text-gray-900 transition-colors">ちょっとした設定</a>
            <a href="#" className="block px-3 py-2 hover:text-gray-900 transition-colors">使い方のヒント</a>
            <a href="#" className="block px-3 py-2 hover:text-gray-900 transition-colors">chotGPTについて</a>
            
            {/* Daily Quote Card */}
            <div className="mt-6 p-4 bg-[#FDFDFD] rounded-2xl border border-gray-100 flex flex-col gap-1">
              <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider block">今日のひとこと</span>
              <p className="text-xs text-gray-600 italic leading-relaxed">「考えるフリ、大得意。」</p>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Header */}
        <header className="px-8 py-4 h-16 flex items-center justify-between sticky top-0 bg-chot-gray/80 backdrop-blur-md z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 rounded-xl bg-white border border-gray-100 hover:bg-gray-50 text-slate-600"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="px-4 py-1.5 text-xs font-bold text-green-700 bg-white border border-green-200 rounded-full shadow-sm hover:shadow-md transition-shadow">
              アップグレード
            </button>
            <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
               <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="px-6 pt-12 pb-24 max-w-4xl mx-auto w-full flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h2 className="text-5xl sm:text-6xl font-extrabold text-gray-900 font-display tracking-tight mb-2">
              chotGPT
            </h2>
            <p className="text-xl text-gray-500 font-medium">
              返信が、<span className="text-green-500 font-bold px-1">あとちょっと</span>足りないAI。
            </p>
            <p className="text-sm text-gray-400 mt-1 italic">ちょっと惜しい。でも、ちょっと助かる。</p>
          </motion.div>

          {/* Search Box - Big input mock */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-2xl bg-white rounded-[2.5rem] p-3 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] border border-gray-100 flex items-center gap-3 mb-12"
          >
            <div className="flex-1 px-5 py-2 text-gray-400 text-sm">何を聞きますか？たぶん答えます。</div>
            <button className="bg-green-500 text-white font-bold py-3 px-6 rounded-full hover:bg-green-600 shadow-lg shadow-green-100 transition-all text-sm active:scale-95">
              ちょっと聞く
            </button>
          </motion.div>

          {/* Conversation Examples Section */}
          <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-[1fr,240px] gap-12 items-start">
            <div className="space-y-6">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 pl-4">こんなやりとり、よくあります。</p>

              {/* Chat bubbles */}
              <div className="space-y-4">
                {/* User Message */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-end gap-1"
                >
                  <div className="bg-gray-100 text-gray-700 py-3 px-5 rounded-3xl rounded-tr-none text-sm shadow-sm">
                    いい感じの返信考えて
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 mr-1 text-right">あなた • 10:21</span>
                </motion.div>

                {/* AI Message */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-start gap-1"
                >
                  <div className="bg-white border border-gray-100 text-gray-800 py-3 px-5 rounded-3xl rounded-tl-none text-sm shadow-sm max-w-xs sm:max-w-md relative">
                    承知しました。いい感じにしておきます。
                    <div className="mt-2 pt-2 border-t border-gray-50 text-[10px] text-gray-400 italic">
                      ※ 具体性は人間が足してください。
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 ml-1">chotGPT • 10:21</span>
                </motion.div>
              </div>
            </div>

            {/* Robot Side */}
            <div className="hidden lg:flex flex-col items-center justify-center h-full pt-12">
              <RobotIllustration />
            </div>
          </div>

          {/* Mobile Robot Version */}
          <div className="lg:hidden mt-20 mb-10 w-full flex justify-center">
             <RobotIllustration />
          </div>

          {/* Features Grid */}
          <div className="w-full mt-24 grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-white p-6 rounded-3xl border border-gray-50 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 bg-blue-50 rounded-xl mb-4 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <FlaskConical className="w-5 h-5 text-blue-500" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1 text-sm">文章をちょっと整える</h3>
              <p className="text-xs text-gray-500 leading-relaxed">言いたいことはあるけど、形にするのがめんどうなときに。</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 bg-amber-50 rounded-xl mb-4 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                <Lightbulb className="w-5 h-5 text-amber-500" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1 text-sm">アイデアをちょっと出す</h3>
              <p className="text-xs text-gray-500 leading-relaxed">ゼロからは無理だけど、ヒントがほしいときに。</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-white p-6 rounded-3xl border border-gray-50 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 bg-rose-50 rounded-xl mb-4 flex items-center justify-center group-hover:bg-rose-100 transition-colors">
                <Coffee className="w-5 h-5 text-rose-500" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1 text-sm">返信をちょっと考える</h3>
              <p className="text-xs text-gray-500 leading-relaxed">気のきいた一言が出てこない…そんなときに、そっと味方。</p>
            </motion.div>
          </div>

          <footer className="mt-24 pb-16 text-center">
            <p className="text-[10px] text-gray-400 font-medium tracking-widest">
              ちょっとだけが、ちょうどいい。そんなAIです。
            </p>
          </footer>
        </section>
      </main>
    </div>
  );
}
