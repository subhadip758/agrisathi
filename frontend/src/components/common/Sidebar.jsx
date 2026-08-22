// import React, { useState } from 'react';
// import { useLanguage } from "../../context/LanguageContext";
// import sidebarText from "../../i18n/sidebar";
// import { Link, useLocation } from 'react-router-dom';
// import {
//   LayoutDashboard, Sprout, TestTube, CloudRain, Droplets, Bug,
//   FlaskConical, BarChart3, TrendingUp, MessageSquare, BookOpen,
//   Wallet, ShoppingBag, X, Sparkles,
// } from 'lucide-react';

// // ── Color helper (replaces the giant ternary chains) ──────────────────────────
// function colorRGB(colorClass) {
//   if (colorClass.includes('emerald')) return '16,185,129';
//   if (colorClass.includes('green'))   return '34,197,94';
//   if (colorClass.includes('sky'))     return '14,165,233';
//   if (colorClass.includes('cyan'))    return '6,182,212';
//   if (colorClass.includes('teal'))    return '20,184,166';
//   if (colorClass.includes('blue'))    return '59,130,246';
//   if (colorClass.includes('indigo'))  return '99,102,241';
//   if (colorClass.includes('violet'))  return '139,92,246';
//   if (colorClass.includes('purple'))  return '168,85,247';
//   if (colorClass.includes('pink'))    return '236,72,153';
//   if (colorClass.includes('rose'))    return '244,63,94';
//   if (colorClass.includes('red'))     return '239,68,68';
//   if (colorClass.includes('amber'))   return '251,146,60';
//   if (colorClass.includes('orange'))  return '249,115,22';
//   if (colorClass.includes('yellow'))  return '234,179,8';
//   return '34,197,94';
// }

// function buildGlow(c) {
//   const r = colorRGB(c);
//   return `0 0 20px rgba(${r},.6), 0 0 40px rgba(${r},.4), 0 0 60px rgba(${r},.3)`;
// }
// function buildTextGlow(c) {
//   const r = colorRGB(c);
//   return `0 0 10px rgba(${r},.8), 0 0 20px rgba(${r},.6), 0 0 30px rgba(${r},.4), 0 0 5px rgba(255,255,255,.8)`;
// }

// // ─────────────────────────────────────────────────────────────────────────────
// const Sidebar = ({ isOpen, setIsOpen }) => {
//   const location  = useLocation();
//   const { language } = useLanguage();
//   const t         = sidebarText[language];
//   const [hoveredItem, setHoveredItem] = useState(null);

//   const menuItems = [
//     { key: 'dashboard',   icon: LayoutDashboard, path: '/dashboard',           color: 'from-blue-500 to-cyan-500'    },
//     { key: 'crop',        icon: Sprout,           path: '/crop-recommendation', color: 'from-green-500 to-emerald-500' },
//     { key: 'soil',        icon: TestTube,         path: '/soil-analysis',       color: 'from-amber-500 to-orange-500' },
//     { key: 'weather',     icon: CloudRain,        path: '/weather',             color: 'from-sky-500 to-blue-500'     },
//     { key: 'irrigation',  icon: Droplets,         path: '/irrigation',          color: 'from-cyan-500 to-teal-500'    },
//     { key: 'disease',     icon: Bug,              path: '/disease-detection',   color: 'from-red-500 to-rose-500'     },
//     { key: 'fertilizer',  icon: FlaskConical,     path: '/fertilizer',          color: 'from-purple-500 to-violet-500'},
//     { key: 'water',       icon: BarChart3,        path: '/water-analytics',     color: 'from-indigo-500 to-blue-500'  },
//     { key: 'yield',       icon: TrendingUp,       path: '/yield-prediction',    color: 'from-emerald-500 to-green-500'},
//     { key: 'marketplace', icon: ShoppingBag,      path: '/market-price',        color: 'from-pink-500 to-rose-500'    },
//     { key: 'learning',    icon: BookOpen,         path: '/learning-hub',        color: 'from-violet-500 to-purple-500'},
//     { key: 'subsidy',     icon: Wallet,           path: '/subsidy-schemes',     color: 'from-yellow-500 to-orange-500'},
//     { key: 'helpdesk',    icon: MessageSquare,    path: '/helpdesk',            color: 'from-teal-500 to-cyan-500'    },
//   ];

//   const isActive = (path) => location.pathname === path;

//   return (
//     <>
//       {/* ── Mobile backdrop ─────────────────────────────────────────────── */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
//           onClick={() => setIsOpen(false)}
//         />
//       )}

//       {/*
//         ── SPACER (desktop only) ────────────────────────────────────────────
//         This invisible div lives in the normal document flow and reserves
//         exactly the collapsed sidebar width (w-20 = 80px).  Because it is a
//         real flex child, all sibling content is pushed to the right by 80px
//         and is never hidden behind the fixed sidebar.

//         The fixed sidebar then sits on top of / overlapping this slot.
//         When it expands on hover (→ w-72) it overlays content temporarily,
//         but nothing is permanently obscured because it shrinks back to 80px.
//         ─────────────────────────────────────────────────────────────────────
//       */}
//       <div className="hidden lg:block w-20 shrink-0" aria-hidden="true" />

//       {/* ── Fixed sidebar ───────────────────────────────────────────────── */}
//       <aside
//         className={`
//           fixed inset-y-0 left-0 z-50
//           w-72 lg:w-20 lg:hover:w-72
//           bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900
//           shadow-2xl overflow-hidden
//           transition-all duration-500 ease-out
//           ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
//           flex flex-col
//           before:absolute before:inset-0 before:bg-gradient-to-br
//           before:from-green-500/5 before:to-blue-500/5 before:pointer-events-none
//           group/sidebar
//         `}
//       >
//         {/* Animated background blobs */}
//         <div className="absolute inset-0 opacity-5 pointer-events-none">
//           <div className="absolute top-0 -left-4 w-72 h-72 bg-green-500 rounded-full blur-3xl animate-blob" />
//           <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full blur-3xl animate-blob animation-delay-2000" />
//           <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500 rounded-full blur-3xl animate-blob animation-delay-4000" />
//         </div>

//         {/* Logo */}
//         <div className="relative h-20 shrink-0 flex items-center justify-between px-6
//                         border-b border-slate-700/50
//                         bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-xl overflow-hidden">
//           <Link to="/dashboard" className="flex items-center space-x-3 group">
//             <div className="relative w-10 h-10 shrink-0 rounded-full overflow-hidden
//                             shadow-lg shadow-green-500/30
//                             group-hover:shadow-green-500/50 group-hover:scale-110
//                             transition-all duration-300">
//               <img src="/assets/images/logo.jpeg" alt="KrishiBandhu Logo" className="w-full h-full object-cover" />
//             </div>
//             <div className="flex flex-col whitespace-nowrap opacity-0 lg:group-hover/sidebar:opacity-100 transition-opacity duration-300">
//               <span className="font-bold text-lg bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
//                 {t.appName}
//               </span>
//               <span className="text-xs text-slate-400 flex items-center gap-1">
//                 <Sparkles className="w-3 h-3" /> Smart Farming
//               </span>
//             </div>
//           </Link>
//           <button
//             onClick={() => setIsOpen(false)}
//             className="lg:hidden p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
//           >
//             <X className="w-5 h-5 text-slate-400" />
//           </button>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 overflow-y-auto py-6 pr-0 pl-4
//                         scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
//           <ul className="space-y-1">
//             {menuItems.map((item, index) => {
//               const Icon      = item.icon;
//               const active    = isActive(item.path);
//               const isHovered = hoveredItem === item.key;

//               return (
//                 <li
//                   key={item.path}
//                   style={{ animationDelay: `${index * 50}ms` }}
//                   className="animate-slideIn relative"
//                 >
//                   {/* Curved notch decorations */}
//                   {active && (
//                     <>
//                       <div className="absolute -top-8 right-0 w-8 h-8 pointer-events-none">
//                         <div className="w-full h-full rounded-full shadow-[20px_20px_0_0] shadow-slate-900" />
//                       </div>
//                       <div className="absolute -bottom-8 right-0 w-8 h-8 pointer-events-none">
//                         <div className="w-full h-full rounded-full shadow-[20px_-20px_0_0] shadow-slate-900" />
//                       </div>
//                     </>
//                   )}

//                   <Link
//                     to={item.path}
//                     onMouseEnter={() => setHoveredItem(item.key)}
//                     onMouseLeave={() => setHoveredItem(null)}
//                     onClick={() => { if (window.innerWidth < 1024) setIsOpen(false); }}
//                     className={`
//                       relative flex items-center space-x-4 px-4 py-3.5
//                       transition-all duration-300 group overflow-hidden rounded-l-[30px]
//                       ${active
//                         ? 'bg-slate-900 text-white shadow-lg'
//                         : 'text-slate-300 hover:bg-slate-800/30 hover:text-white'}
//                     `}
//                   >
//                     {active && (
//                       <div className={`absolute inset-0 rounded-l-[30px] bg-gradient-to-r ${item.color} opacity-10`} />
//                     )}

//                     {/* Icon */}
//                     <div
//                       className={`
//                         relative flex items-center justify-center w-10 h-10 shrink-0 rounded-lg
//                         transition-all duration-300 z-10
//                         ${active ? `bg-gradient-to-br ${item.color}` : 'bg-slate-700/30 group-hover:bg-slate-700/50'}
//                         ${isHovered ? 'scale-110 rotate-3' : ''}
//                       `}
//                       style={active ? { boxShadow: buildGlow(item.color) } : {}}
//                     >
//                       <Icon className={`w-5 h-5 transition-all duration-300
//                         ${active
//                           ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]'
//                           : 'text-slate-400 group-hover:text-white'}`}
//                       />
//                     </div>

//                     {/* Label */}
//                     <span
//                       className={`
//                         text-sm font-medium relative z-10 transition-all duration-300 whitespace-nowrap
//                         opacity-0 lg:group-hover/sidebar:opacity-100
//                         ${active ? 'font-semibold text-white' : ''}
//                         ${isHovered ? 'translate-x-1' : ''}
//                       `}
//                       style={active ? { textShadow: buildTextGlow(item.color) } : {}}
//                     >
//                       {t[item.key]}
//                     </span>

//                     {/* Hover ping dot */}
//                     {isHovered && !active && (
//                       <div className={`absolute right-3 w-2 h-2 rounded-full
//                         bg-gradient-to-r ${item.color} animate-ping
//                         opacity-0 lg:group-hover/sidebar:opacity-100`}
//                       />
//                     )}

//                     {/* Active pulse dot */}
//                     {active && (
//                       <div className="absolute right-4 opacity-0 lg:group-hover/sidebar:opacity-100 transition-opacity duration-300">
//                         <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${item.color} animate-pulse`} />
//                       </div>
//                     )}
//                   </Link>
//                 </li>
//               );
//             })}
//           </ul>
//         </nav>

//         {/* Footer help card */}
//         <div className="relative p-4 border-t border-slate-700/50 shrink-0">
//           <div className="relative overflow-hidden rounded-2xl
//                           bg-gradient-to-br from-slate-800/80 to-slate-900/80
//                           backdrop-blur-xl border border-slate-700/50 p-5 shadow-2xl
//                           opacity-0 lg:group-hover/sidebar:opacity-100 transition-opacity duration-300">
//             <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-blue-500/10 animate-gradient pointer-events-none" />
//             <div className="absolute top-2 right-2 w-20 h-20 bg-green-500/20 rounded-full blur-2xl animate-pulse pointer-events-none" />
//             <div className="absolute bottom-2 left-2 w-16 h-16 bg-blue-500/20 rounded-full blur-2xl animate-pulse animation-delay-2000 pointer-events-none" />

//             <div className="relative z-10">
//               <div className="flex items-center gap-2 mb-2">
//                 <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600
//                                 flex items-center justify-center shadow-lg shadow-green-500/30">
//                   <MessageSquare className="w-4 h-4 text-white" />
//                 </div>
//                 <p className="text-sm font-bold text-white whitespace-nowrap">{t.needHelp}</p>
//               </div>
//               <p className="text-xs text-slate-300 mb-4 leading-relaxed">{t.supportText}</p>
//               <Link
//                 to="/helpdesk"
//                 onClick={() => { if (window.innerWidth < 1024) setIsOpen(false); }}
//                 className="block w-full text-center bg-gradient-to-r from-green-500 to-emerald-600
//                            text-white py-2.5 rounded-xl text-sm font-semibold
//                            hover:from-green-600 hover:to-emerald-700 hover:scale-105
//                            transition-all duration-300 shadow-lg shadow-green-500/30
//                            hover:shadow-green-500/50 relative overflow-hidden group whitespace-nowrap"
//               >
//                 <span className="relative z-10">{t.getSupport}</span>
//                 <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0
//                                 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
//               </Link>
//             </div>
//           </div>
//         </div>
//       </aside>

//       <style jsx>{`
//         @keyframes slideIn {
//           from { opacity: 0; transform: translateX(-20px); }
//           to   { opacity: 1; transform: translateX(0); }
//         }
//         @keyframes blob {
//           0%,100% { transform: translate(0,0) scale(1); }
//           25%     { transform: translate(20px,-50px) scale(1.1); }
//           50%     { transform: translate(-20px,20px) scale(0.9); }
//           75%     { transform: translate(50px,50px) scale(1.05); }
//         }
//         @keyframes gradient {
//           0%,100% { opacity: 0.5; }
//           50%     { opacity: 0.8; }
//         }
//         .animate-slideIn        { animation: slideIn 0.5s ease-out forwards; opacity: 0; }
//         .animate-blob           { animation: blob 7s infinite; }
//         .animation-delay-2000   { animation-delay: 2s; }
//         .animation-delay-4000   { animation-delay: 4s; }
//         .animate-gradient       { animation: gradient 3s ease-in-out infinite; }
//         .scrollbar-thin::-webkit-scrollbar                        { width: 6px; }
//         .scrollbar-thumb-slate-700::-webkit-scrollbar-thumb       { background-color: rgb(51 65 85); border-radius: 3px; }
//         .scrollbar-thumb-slate-700::-webkit-scrollbar-thumb:hover { background-color: rgb(71 85 105); }
//         .scrollbar-track-transparent::-webkit-scrollbar-track     { background: transparent; }
//       `}</style>
//     </>
//   );
// };

// export default Sidebar;

import React, { useState } from 'react';
import { useLanguage } from "../../context/LanguageContext";
import sidebarText from "../../i18n/sidebar";
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Sprout, TestTube, CloudRain, Droplets, Bug,
  FlaskConical, BarChart3, TrendingUp, MessageSquare, BookOpen,
  Wallet, ShoppingBag, X, Sparkles,
} from 'lucide-react';

// ── Color helper ──────────────────────────────────────────────────────────────
function colorRGB(colorClass) {
  if (colorClass.includes('emerald')) return '16,185,129';
  if (colorClass.includes('green'))   return '34,197,94';
  if (colorClass.includes('sky'))     return '14,165,233';
  if (colorClass.includes('cyan'))    return '6,182,212';
  if (colorClass.includes('teal'))    return '20,184,166';
  if (colorClass.includes('blue'))    return '59,130,246';
  if (colorClass.includes('indigo'))  return '99,102,241';
  if (colorClass.includes('violet'))  return '139,92,246';
  if (colorClass.includes('purple'))  return '168,85,247';
  if (colorClass.includes('pink'))    return '236,72,153';
  if (colorClass.includes('rose'))    return '244,63,94';
  if (colorClass.includes('red'))     return '239,68,68';
  if (colorClass.includes('amber'))   return '251,146,60';
  if (colorClass.includes('orange'))  return '249,115,22';
  if (colorClass.includes('yellow'))  return '234,179,8';
  return '34,197,94';
}

function buildGlow(c) {
  const r = colorRGB(c);
  return `0 0 20px rgba(${r},.6), 0 0 40px rgba(${r},.4), 0 0 60px rgba(${r},.3)`;
}

function buildTextGlow(c) {
  const r = colorRGB(c);
  return `0 0 10px rgba(${r},.8), 0 0 20px rgba(${r},.6), 0 0 30px rgba(${r},.4), 0 0 5px rgba(255,255,255,.8)`;
}

// ─────────────────────────────────────────────────────────────────────────────
const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { language } = useLanguage();
  const t = sidebarText[language];
  const [hoveredItem, setHoveredItem] = useState(null);

  const menuItems = [
    { key: 'dashboard',   icon: LayoutDashboard, path: '/dashboard',           color: 'from-blue-500 to-cyan-500'     },
    { key: 'crop',        icon: Sprout,           path: '/crop-recommendation', color: 'from-green-500 to-emerald-500' },
    { key: 'soil',        icon: TestTube,         path: '/soil-analysis',       color: 'from-amber-500 to-orange-500' },
    { key: 'weather',     icon: CloudRain,        path: '/weather',             color: 'from-sky-500 to-blue-500'     },
    { key: 'irrigation',  icon: Droplets,         path: '/irrigation',          color: 'from-cyan-500 to-teal-500'    },
    { key: 'disease',     icon: Bug,              path: '/disease-detection',   color: 'from-red-500 to-rose-500'     },
    { key: 'fertilizer',  icon: FlaskConical,     path: '/fertilizer',          color: 'from-purple-500 to-violet-500'},
    { key: 'water',       icon: BarChart3,        path: '/water-analytics',     color: 'from-indigo-500 to-blue-500'  },
    { key: 'yield',       icon: TrendingUp,       path: '/yield-prediction',    color: 'from-emerald-500 to-green-500'},
    { key: 'marketplace', icon: ShoppingBag,      path: '/market-price',        color: 'from-pink-500 to-rose-500'    },
    { key: 'learning',    icon: BookOpen,         path: '/learning-hub',        color: 'from-violet-500 to-purple-500'},
    { key: 'subsidy',     icon: Wallet,           path: '/subsidy-schemes',     color: 'from-yellow-500 to-orange-500'},
    { key: 'helpdesk',    icon: MessageSquare,    path: '/helpdesk',            color: 'from-teal-500 to-cyan-500'    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ── Fixed Sidebar ───────────────────────────────────────── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          w-72
          bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900
          shadow-2xl overflow-hidden
          transition-all duration-500 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          flex flex-col
          before:absolute before:inset-0 before:bg-gradient-to-br
          before:from-green-500/5 before:to-blue-500/5 before:pointer-events-none
          group/sidebar
        `}
      >
        {/* Animated background blobs */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-green-500 rounded-full blur-3xl animate-blob" />
          <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500 rounded-full blur-3xl animate-blob animation-delay-4000" />
        </div>

        {/* Logo */}
        <div className="relative h-20 shrink-0 flex items-center justify-between px-6
                        border-b border-slate-700/50
                        bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-xl overflow-hidden">
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="relative w-10 h-10 shrink-0 rounded-full overflow-hidden
                            shadow-lg shadow-green-500/30
                            group-hover:shadow-green-500/50 group-hover:scale-110
                            transition-all duration-300">
              <img src="/assets/images/logo.jpeg" alt="KrishiBandhu Logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col whitespace-nowrap">
              <span className="font-bold text-lg bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
                {t.appName}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Smart Farming
              </span>
            </div>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 pr-0 pl-4
                        scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          <ul className="space-y-1">
            {menuItems.map((item, index) => {
              const Icon      = item.icon;
              const active    = isActive(item.path);
              const isHovered = hoveredItem === item.key;

              return (
                <li
                  key={item.path}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className="animate-slideIn relative"
                >
                  {active && (
                    <>
                      <div className="absolute -top-8 right-0 w-8 h-8 pointer-events-none">
                        <div className="w-full h-full rounded-full shadow-[20px_20px_0_0] shadow-slate-900" />
                      </div>
                      <div className="absolute -bottom-8 right-0 w-8 h-8 pointer-events-none">
                        <div className="w-full h-full rounded-full shadow-[20px_-20px_0_0] shadow-slate-900" />
                      </div>
                    </>
                  )}

                  <Link
                    to={item.path}
                    onMouseEnter={() => setHoveredItem(item.key)}
                    onMouseLeave={() => setHoveredItem(null)}
                    onClick={() => setIsOpen(false)}
                    className={`
                      relative flex items-center space-x-4 px-4 py-3.5
                      transition-all duration-300 group overflow-hidden rounded-l-[30px]
                      ${active
                        ? 'bg-slate-900 text-white shadow-lg'
                        : 'text-slate-300 hover:bg-slate-800/30 hover:text-white'}
                    `}
                  >
                    {active && (
                      <div className={`absolute inset-0 rounded-l-[30px] bg-gradient-to-r ${item.color} opacity-10`} />
                    )}

                    {/* Icon */}
                    <div
                      className={`
                        relative flex items-center justify-center w-10 h-10 shrink-0 rounded-lg
                        transition-all duration-300 z-10
                        ${active ? `bg-gradient-to-br ${item.color}` : 'bg-slate-700/30 group-hover:bg-slate-700/50'}
                        ${isHovered ? 'scale-110 rotate-3' : ''}
                      `}
                      style={active ? { boxShadow: buildGlow(item.color) } : {}}
                    >
                      <Icon className={`w-5 h-5 transition-all duration-300
                        ${active
                          ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                          : 'text-slate-400 group-hover:text-white'}`}
                      />
                    </div>

                    {/* Label */}
                    <span
                      className={`
                        text-sm font-medium relative z-10 transition-all duration-300 whitespace-nowrap
                        ${active ? 'font-semibold text-white' : ''}
                        ${isHovered ? 'translate-x-1' : ''}
                      `}
                      style={active ? { textShadow: buildTextGlow(item.color) } : {}}
                    >
                      {t[item.key]}
                    </span>

                    {/* Hover ping dot */}
                    {isHovered && !active && (
                      <div className={`absolute right-3 w-2 h-2 rounded-full bg-gradient-to-r ${item.color} animate-ping`} />
                    )}

                    {/* Active pulse dot */}
                    {active && (
                      <div className="absolute right-4">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${item.color} animate-pulse`} />
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer help card */}
        <div className="relative p-4 border-t border-slate-700/50 shrink-0">
          <div className="relative overflow-hidden rounded-2xl
                          bg-gradient-to-br from-slate-800/80 to-slate-900/80
                          backdrop-blur-xl border border-slate-700/50 p-5 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-blue-500/10 animate-gradient pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600
                                flex items-center justify-center shadow-lg shadow-green-500/30">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <p className="text-sm font-bold text-white whitespace-nowrap">{t.needHelp}</p>
              </div>
              <p className="text-xs text-slate-300 mb-4 leading-relaxed">{t.supportText}</p>
              <Link
                to="/helpdesk"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center bg-gradient-to-r from-green-500 to-emerald-600
                           text-white py-2.5 rounded-xl text-sm font-semibold
                           hover:from-green-600 hover:to-emerald-700 hover:scale-105
                           transition-all duration-300 shadow-lg shadow-green-500/30
                           hover:shadow-green-500/50 relative overflow-hidden group whitespace-nowrap"
              >
                <span className="relative z-10">{t.getSupport}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0
                                translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </Link>
            </div>
          </div>
        </div>
      </aside>

      <style jsx>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes blob {
          0%,100% { transform: translate(0,0) scale(1); }
          25%     { transform: translate(20px,-50px) scale(1.1); }
          50%     { transform: translate(-20px,20px) scale(0.9); }
          75%     { transform: translate(50px,50px) scale(1.05); }
        }
        @keyframes gradient {
          0%,100% { opacity: 0.5; }
          50%     { opacity: 0.8; }
        }
        .animate-slideIn      { animation: slideIn 0.5s ease-out forwards; opacity: 0; }
        .animate-blob         { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-gradient     { animation: gradient 3s ease-in-out infinite; }
        .scrollbar-thin::-webkit-scrollbar                        { width: 6px; }
        .scrollbar-thumb-slate-700::-webkit-scrollbar-thumb       { background-color: rgb(51 65 85); border-radius: 3px; }
        .scrollbar-thumb-slate-700::-webkit-scrollbar-thumb:hover { background-color: rgb(71 85 105); }
        .scrollbar-track-transparent::-webkit-scrollbar-track     { background: transparent; }
      `}</style>
    </>
  );
};

export default Sidebar;