import React, { useState, useEffect, useRef } from 'react';
import ChatWindow from './ChatWindow'; // adjust path as needed

const FloatingChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const fabRef = useRef(null);
  const panelRef = useRef(null);

  // Close on outside click — check both FAB wrapper and chat panel
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isOpen &&
        fabRef.current && !fabRef.current.contains(e.target) &&
        panelRef.current && !panelRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap');

        .floating-chat-wrapper {
          position: fixed;
          bottom: 80px;
          right: 28px;
          z-index: 9999;
          font-family: 'DM Sans', sans-serif;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 14px;
          /* Prevent this wrapper from affecting page layout */
          pointer-events: none;
        }

        /* ── Chat window panel ── */
        .chat-panel {
          /* Fixed position so it floats above everything, never pushes content */
          position: fixed;
          bottom: 155px; /* sits above the FAB */
          right: 28px;
          width: 370px;
          transform-origin: bottom right;
          transition: transform 0.28s cubic-bezier(0.34, 1.2, 0.64, 1),
                      opacity  0.22s ease;
          /* Re-enable pointer events only for the panel itself */
          pointer-events: none;
        }
        .chat-panel.open {
          transform: scale(1) translateY(0);
          opacity: 1;
          pointer-events: all;
        }
        .chat-panel.closed {
          transform: scale(0.88) translateY(20px);
          opacity: 0;
          pointer-events: none;
        }

        /* ── FAB button ── */
        .fab {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          background: linear-gradient(135deg, #2d5a3d 0%, #4a7c59 60%, #5e9469 100%);
          box-shadow: 0 6px 24px rgba(45,90,61,0.42), 0 2px 8px rgba(0,0,0,0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.22s cubic-bezier(0.34,1.4,0.64,1),
                      box-shadow 0.2s ease;
          position: relative;
          flex-shrink: 0;
          /* Re-enable pointer events for the button */
          pointer-events: all;
        }
        .fab:hover {
          transform: scale(1.1);
          box-shadow: 0 10px 32px rgba(45,90,61,0.5), 0 3px 10px rgba(0,0,0,0.14);
        }
        .fab:active {
          transform: scale(0.96);
        }

        /* Icon transition */
        .fab-icon {
          position: absolute;
          transition: opacity 0.18s ease, transform 0.22s ease;
          font-size: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .fab-icon.visible  { opacity: 1;  transform: rotate(0deg)   scale(1); }
        .fab-icon.hidden   { opacity: 0;  transform: rotate(60deg)  scale(0.5); }

        /* Unread badge */
        .unread-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 16px;
          height: 16px;
          background: #e05252;
          border-radius: 50%;
          border: 2px solid #fff;
          animation: pop 0.3s cubic-bezier(0.34,1.4,0.64,1);
        }
        @keyframes pop {
          from { transform: scale(0); }
          to   { transform: scale(1); }
        }

        /* Pulse ring when closed */
        .fab-ring {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 2px solid rgba(74,124,89,0.4);
          animation: ring 2.4s ease-out infinite;
        }
        @keyframes ring {
          0%   { transform: scale(1);   opacity: 0.7; }
          70%  { transform: scale(1.45); opacity: 0; }
          100% { transform: scale(1.45); opacity: 0; }
        }

        /* Tooltip */
        .fab-tooltip {
          position: absolute;
          right: 68px;
          background: #2d5a3d;
          color: #fff;
          font-size: 12.5px;
          font-weight: 400;
          padding: 5px 12px;
          border-radius: 8px;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transform: translateX(6px);
          transition: opacity 0.18s ease, transform 0.18s ease;
          box-shadow: 0 3px 12px rgba(0,0,0,0.15);
        }
        .fab-tooltip::after {
          content: '';
          position: absolute;
          left: 100%;
          top: 50%;
          transform: translateY(-50%);
          border: 5px solid transparent;
          border-left-color: #2d5a3d;
        }
        .fab:hover .fab-tooltip {
          opacity: 1;
          transform: translateX(0);
        }
      `}</style>

      {/* Chat panel rendered independently — uses panelRef for outside-click */}
      <div className={`chat-panel ${isOpen ? 'open' : 'closed'}`} ref={panelRef}>
        <ChatWindow />
      </div>

      <div className="floating-chat-wrapper" ref={fabRef}>
        {/* Floating Action Button */}
        <button
          className="fab"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? 'Close chat' : 'Open farming assistant'}
        >
          {/* Pulse ring only when closed */}
          {!isOpen && <span className="fab-ring" />}

          {/* Leaf / chat icon */}
          <span className={`fab-icon ${isOpen ? 'hidden' : 'visible'}`}>🌾</span>

          {/* Close icon */}
          <span className={`fab-icon ${isOpen ? 'visible' : 'hidden'}`}>
            <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2.5"
              strokeLinecap="round" viewBox="0 0 24 24">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </span>

          <span className="fab-tooltip">
            {isOpen ? 'Close assistant' : 'Ask farming assistant'}
          </span>
        </button>
      </div>
    </>
  );
};

export default FloatingChatButton;