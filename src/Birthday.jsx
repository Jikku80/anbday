import React, { useState, useEffect, useRef } from 'react';
import { Heart, Gift, Sparkles, Star, Trophy, Cake, Zap, Crown, Volume2 } from 'lucide-react'; // Added Volume2
import jan from './assets/jan.jpg'
import kis from './assets/kis.jpg';
import woo from './assets/woo.jpg';

// 🔊 SOUND EFFECT HELPER FUNCTION
// ⚠️ IMPORTANT: Update these paths to your actual audio files (e.g., './assets/heart.mp3').
const AUDIO_PATHS = {
  HEART_FOUND: '/pop.mp3',
  GIFT_OPENED: '/pop.mp3',
  CANDLE_BLOW: '/blow.mp3',
  CAKE_SLICE: '/bg.mp3',
  CELEBRATION: '/birthday.mp3',
  // NEW: A silent/small sound to prime the audio context
  PRIMER: '/pop.mp3', // Use any short sound file you have
};

// ⚠️ MODIFIED playSound to use isAudioActive check
const playSound = (soundKey) => {
  const path = AUDIO_PATHS[soundKey];
  if (!path || path.includes('path/to/your')) {
    console.warn(`[Audio Warning] Placeholder path used for ${soundKey}. Please replace 'path/to/your/...' with a real audio file path.`);
    return;
  }
  
  try {
    const sound = new Audio(path);
    // Ensure sound is played. Autoplay policy check is managed by the new 'Start Screen'
    sound.play().catch(error => {
      console.error(`Audio playback failed for ${soundKey}:`, error);
      // NOTE: If this fails, it's usually the Autoplay Policy. 
      // The new start screen should prevent this, but it's good to keep the catch.
    });
  } catch (e) {
    console.error("Error creating or playing audio object:", e);
  }
};


// Simple toast system (no changes needed)
const Toast = ({ message, onClose }) => (
  <div className="fixed top-4 right-4 bg-white rounded-2xl shadow-2xl p-4 animate-bounce z-50 max-w-sm border-4 border-pink-300">
    <div className="flex items-center gap-3">
      <div className="bg-gradient-to-br from-pink-400 to-purple-400 rounded-full p-2">
        <Sparkles className="text-white w-5 h-5" />
      </div>
      <p className="text-gray-800 font-semibold">{message}</p>
    </div>
    <button 
      onClick={onClose}
      className="absolute -top-2 -right-2 bg-pink-400 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-pink-500 shadow-lg"
    >
      ✕
    </button>
  </div>
);

export default function TreasureHunt() {
  const [currentGame, setCurrentGame] = useState(1);
  const [foundHearts, setFoundHearts] = useState([]);
  const [clickedGifts, setClickedGifts] = useState([]);
  const [toast, setToast] = useState(null);
  const [cakeSlices, setCakeSlices] = useState([]);
  const [candlesLit, setCandlesLit] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [sliceSound, setSliceSound] = useState(false);
  // ✨ NEW STATE: Controls the audio/game start
  const [isAudioActive, setIsAudioActive] = useState(false); 

  const hearts = [
    { id: 1, top: '15%', left: '10%', rotation: 'rotate-12' },
    { id: 2, top: '25%', left: '85%', rotation: '-rotate-12' },
    { id: 3, top: '60%', left: '18%', rotation: 'rotate-45' },
  ];

  const gifts = [
    { id: 1, top: '20%', left: '15%', surprise: '🎂' },
    { id: 2, top: '40%', left: '75%', surprise: '🎈' },
    { id: 3, top: '65%', left: '50%', surprise: '🎊' },
    { id: 4, top: '80%', left: '20%', surprise: '🎉' },
  ];
  
  // 📸 NEW: Placeholder photo array for the background
  const photos = [
    { id: 1, top: '10%', left: '40%', rotation: 'rotate-3', size: 'w-20 h-20', image: jan },
    { id: 2, top: '70%', left: '7%', rotation: '-rotate-6', size: 'w-24 h-24', image: kis },
    { id: 3, top: '45%', left: '88%', rotation: 'rotate-10', size: 'w-20 h-20', image: woo },
  ];


  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  // 🎂 AUDIO EFFECT: Play sound when celebration page opens
  useEffect(() => {
    // ⚠️ CHECK isAudioActive before playing
    if (showCelebration && isAudioActive) { 
      playSound('CELEBRATION');
    }
  }, [showCelebration, isAudioActive]); // Added isAudioActive dependency

  // 🎧 NEW HANDLER: For the start button
  const handleStartGame = () => {
    // 1. Set the flag to true to start the game
    setIsAudioActive(true);
    // 2. Play a sound immediately to ensure the audio context is unlocked
    playSound('PRIMER'); 
  };
  
  // --- Game Logic Handlers (Unchanged, they just call the updated playSound) ---

  // Game 1: Find Hearts
  const handleHeartClick = (heartId) => {
    if (!foundHearts.includes(heartId)) {
      setFoundHearts([...foundHearts, heartId]);
      playSound('HEART_FOUND'); // 🔊 Play sound
      showToast(`💖 Heart found! ${foundHearts.length + 1}/3`);
      
      if (foundHearts.length + 1 === 3) {
        setTimeout(() => {
          showToast('🎉 All hearts found! Moving to next game...');
          setTimeout(() => setCurrentGame(2), 2000);
        }, 1000);
      }
    }
  };

  // Game 2: Click Gifts for Surprises
  const handleGiftClick = (giftId) => {
    if (!clickedGifts.includes(giftId)) {
      const gift = gifts.find(g => g.id === giftId);
      setClickedGifts([...clickedGifts, giftId]);
      playSound('GIFT_OPENED'); // 🔊 Play sound
      showToast(`${gift.surprise} Surprise! ${clickedGifts.length + 1}/4 gifts opened!`);
      
      if (clickedGifts.length + 1 === 4) {
        setTimeout(() => {
          showToast('🎁 All surprises revealed! Time to cut the cake...');
          setTimeout(() => setCurrentGame(3), 2000);
        }, 1000);
      }
    }
  };

  // Game 3: Cut the Cake - click to remove slices
  const handleCakeSliceClick = (sliceIndex) => {
    if (candlesLit) {
      // FIRST CLICK: Blow out the candles
      playSound('CANDLE_BLOW'); // 🔊 Play blow sound
      setCandlesLit(false);
      showToast('🌬️ Make a wish! Candles blown out. Now, start cutting the cake!');
      return;
    }

    // SUBSEQUENT CLICKS: Cut slices
    if (!cakeSlices.includes(sliceIndex)) {
      if (!sliceSound){
        playSound('CAKE_SLICE'); // 🔊 Play slice sound
        setSliceSound(true);
      }
      setCakeSlices([...cakeSlices, sliceIndex]);
      showToast(`🍰 Slice ${cakeSlices.length + 1}/8 removed!`);
      
      if (cakeSlices.length + 1 === 8) {
        setTimeout(() => {
          showToast('🎂 All cake eaten! Get ready for something special...');
          setTimeout(() => setShowCelebration(true), 2000);
        }, 1000);
      }
    }
  };

  // 🌟 NEW START SCREEN RENDER
  if (!isAudioActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-10 max-w-lg w-full text-center relative z-10">
          <Sparkles className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-spin" style={{ animationDuration: '5s' }} />
          <h1 className="text-4xl font-bold text-purple-600 mb-4">
            An Game!
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Click 'Start' to enable sounds and begin your special game!
          </p>
          <button
            onClick={handleStartGame}
            className="flex items-center justify-center mx-auto px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold text-xl rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300"
          >
            <Volume2 className="w-6 h-6 mr-3" />
            Click to Start Game!
          </button>
          <p className="mt-4 text-sm text-gray-500">
            (Required to play all the fun sound effects!)
          </p>
        </div>
      </div>
    );
  }

  // Rest of the existing code follows if (isAudioActive)

  if (showCelebration) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 flex items-center justify-center p-4 relative overflow-hidden">
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(10deg); }
          }
          .animate-float {
            animation: float linear infinite;
          }
          /* Border Pulse for Wish Card */
          @keyframes pulse-border {
            0%, 100% { box-shadow: 0 0 0 0 rgba(255, 105, 180, 0.4); }
            50% { box-shadow: 0 0 0 10px rgba(255, 105, 180, 0); }
          }
          .animate-pulse-border {
            animation: pulse-border 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          /* Slower Ping for sparkles */
          @keyframes ping-slow {
            75%, 100% {
              transform: scale(2);
              opacity: 0;
            }
          }
          .animate-ping-slow {
            animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
          }
          /* Gentle bounce for title */
          @keyframes bounce-slow {
            0%, 100% {
              transform: translateY(-2px);
              animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
            }
            50% {
              transform: translateY(2px);
              animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
            }
          }
          .animate-bounce-slow {
            animation: bounce-slow 4s infinite;
          }

          /* NEW ANIMATION: Invitation Open */
          @keyframes invitation-open {
            0% {
              transform: scale(0.5) rotateX(90deg) translateY(100vh); /* Start scaled down, flipped, and off screen */
              opacity: 0;
            }
            100% {
              transform: scale(1) rotateX(0deg) translateY(0); /* End at normal size and rotation */
              opacity: 1;
            }
          }
          .animate-invitation-open {
            animation: invitation-open 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
            transform-style: preserve-3d; /* Required for good 3D rotation */
          }
        `}</style>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`
              }}
            >
              {i % 4 === 0 ? (
                <Heart className="w-6 h-6 text-pink-200 opacity-60 fill-pink-200" />
              ) : i % 4 === 1 ? (
                <Sparkles className="w-5 h-5 text-yellow-200 opacity-60" />
              ) : i % 4 === 2 ? (
                <Star className="w-4 h-4 text-purple-200 opacity-60 fill-purple-200" />
              ) : (
                <Crown className="w-5 h-5 text-yellow-300 opacity-60" />
              )}
            </div>
          ))}
        </div>

        {/* Main Celebration Card - ANIMATED */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-2xl w-full text-center relative z-10 animate-invitation-open">
          <div className="mb-6">
            <div className="flex justify-center gap-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-10 h-10 text-yellow-400 fill-yellow-400 animate-spin" style={{animationDuration: '3s', animationDelay: `${i * 0.2}s`}} />
              ))}
            </div>
          </div>
          
          <p className="text-4xl font-bold text-purple-600 mb-6">
            Happy Birthday, Beautiful! 🎂
          </p>
          
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8 mb-6 border-4 border-pink-200">
            <Cake className="w-20 h-20 text-pink-400 mx-auto mb-4 animate-bounce" />
            <p className="text-3xl font-bold text-gray-800 mb-6">
              💖 HAPPY BIRTHDAY! 💋
            </p>
            
            {/* ENHANCED WISH SECTION - Animated, Cute, Responsive */}
            <div className="bg-white rounded-3xl p-6 my-8 border-4 border-pink-300 shadow-xl relative overflow-hidden animate-pulse-border">
              {/* Decorative corner sparkles */}
              <Sparkles className="absolute top-2 left-2 w-6 h-6 text-pink-400 opacity-70 animate-ping-slow" />
              <Sparkles className="absolute bottom-2 right-2 w-6 h-6 text-purple-400 opacity-70 animate-ping-slow" style={{ animationDelay: '1s' }} />

              <p className="text-3xl sm:text-4xl font-extrabold text-transparent bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text mb-4 animate-bounce-slow">
                My Birthday Wish For You
              </p>
              
              <div className="h-0.5 bg-gradient-to-r from-pink-300 via-purple-300 to-pink-300 mb-4" />

              <p className="text-lg sm:text-xl text-gray-700 leading-relaxed font-medium">
                <span className="text-pink-500 font-bold">May this special day</span> bring you endless joy, boundless laughter, and all the happiness your heart can hold! 💝 
                You deserve every wonderful moment, every dream come true, and all the love in the world! 
                May this year ahead be filled with amazing adventures, sweet surprises, and memories that make you smile. 
                <span className="text-purple-500 font-bold">You're absolutely incredible</span>, and today we celebrate YOU! 💋🎂💋
              </p>
            </div>
            {/* END ENHANCED WISH SECTION */}

            <p className="text-xl text-pink-600 font-bold">
              Here's to the most amazing year ahead! 🥳💕💋
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3 justify-center">
            {['🎂', '🎁', '🎉', '💋', '💖', '✨', '🌟', '💋', '👑', '🍰', '💋', '💝'].map((emoji, i) => (
              <span key={i} className="text-5xl animate-bounce" style={{animationDelay: `${i * 0.1}s`}}>
                {emoji}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 relative overflow-hidden">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}
          >
            {i % 2 === 0 ? (
              <Sparkles className="w-6 h-6 text-white opacity-40" />
            ) : (
              <Zap className="w-5 h-5 text-yellow-200 opacity-40" />
            )}
          </div>
        ))}
      </div>

      {/* 📸 NEW: Background Photos (Only visible on Game 1 and 2 screens) */}
      {currentGame !== 3 && photos.map((photo) => (
        <div
          key={photo.id}
          className={`absolute z-0 transition-opacity duration-1000 opacity-60 hover:opacity-100 backdrop-blur-sm p-1 bg-white/50 rounded-lg shadow-xl ${photo.rotation} ${photo.size}`}
          style={{ top: photo.top, left: photo.left }}
        >
          {/* Replace 'path/to/your/photo.jpg' with your actual image path */}
          <img 
            src={photo.image}
            className={`w-full h-full bg-cover bg-center rounded-md border-2 border-white`}
            style={{ 
                // NOTE: In a real app, you would use an `<img>` tag and import the image, e.g., <img src={photo.path} alt="Memory" className="w-full h-full object-cover rounded-md" />
                // For this review, we use a decorative background and a placeholder tag.
                backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'><rect width=\'100\' height=\'100\' fill=\'#f3e8ff\'/><circle cx=\'50\' cy=\'40\' r=\'15\' fill=\'#d8b4fe\'/><rect x=\'30\' y=\'65\' width=\'40\' height=\'10\' fill=\'#a78bfa\'/><text x=\'50\' y=\'90\' font-size=\'10\' text-anchor=\'middle\' fill=\'#8b5cf6\'>Photo</text></svg>")'
            }}
          />
            
        </div>
      ))}
      
      {/* Game 1: Hearts */}
      {currentGame === 1 && hearts.map((heart) => (
        <button
          key={heart.id}
          onClick={() => handleHeartClick(heart.id)}
          className={`absolute transition-all duration-500 hover:scale-150 z-20 ${heart.rotation} ${
            foundHearts.includes(heart.id) ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
          }`}
          style={{ top: heart.top, left: heart.left }}
        >
          <Heart 
            className="w-12 h-12 text-pink-500 fill-pink-400 drop-shadow-2xl animate-pulse"
          />
        </button>
      ))}

      {/* Game 2: Gifts */}
      {currentGame === 2 && gifts.map((gift) => (
        <button
          key={gift.id}
          onClick={() => handleGiftClick(gift.id)}
          className={`absolute transition-all duration-500 hover:scale-125 z-20 ${
            clickedGifts.includes(gift.id) ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
          }`}
          style={{ top: gift.top, left: gift.left }}
        >
          {clickedGifts.includes(gift.id) ? (
            <span className="text-6xl animate-bounce">{gift.surprise}</span>
          ) : (
            <Gift className="w-14 h-14 text-purple-500 drop-shadow-2xl animate-bounce" />
          )}
        </button>
      ))}

      {/* Main Content Area: Handles Game 1/2 single card layout and Game 3 side-by-side layout */}
      <div className="flex items-center justify-center min-h-screen p-6 relative z-10">
        
        {currentGame === 3 ? (
          // Game 3: Stacked on mobile, side-by-side on medium screens and up
          <div className="flex flex-col md:flex-row items-center md:items-start justify-center w-full max-w-5xl gap-8 md:gap-12">
            
            {/* 1. Cake Info Card (Left/Top Side) - Responsive sizing added */}
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-xs sm:max-w-sm md:max-w-md border-4 border-white/50 pointer-events-auto">
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl p-6 border-2 border-yellow-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Cake className="w-10 h-10 text-orange-500" />
                    <h2 className="text-2xl font-bold text-orange-700">Game 3: Cut the Cake</h2>
                  </div>
                  <p className="text-lg text-gray-700">
                    **First click** to blow out the candles, then **take all 8 slices**! 🍰
                  </p>
                </div>
                
                <p className="text-center text-2xl font-bold text-gray-700">
                  {candlesLit ? 'Candles Lit! 🕯️' : 'Candles Blown! 💨'}
                  <br />
                  {cakeSlices.length}/8 Slices Eaten! {cakeSlices.length === 8 ? '🎉' : ''}
                </p>
              </div>
            </div>

            {/* 2. Circular Cake (Right/Bottom Side) - Fully Responsive Cake Component */}
            <div className="relative flex flex-col items-center w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
              
              {/* Cake Wrapper: Scales dynamically but preserves aspect ratio */}
              <div className="relative w-full h-auto aspect-square max-w-[400px] mx-auto"> 
                
                {/* Inner container for the main cake elements (SVG, Drips, Toppings) */}
                <div className="absolute inset-0">
                  <svg viewBox="0 0 400 400" className="w-full h-full">
                    <defs>
                      {/* Dark chocolate gradient */}
                      <radialGradient id="chocolateGrad">
                        <stop offset="0%" style={{ stopColor: '#5C3317', stopOpacity: 1 }} />
                        <stop offset="60%" style={{ stopColor: '#3E2723', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#2C1810', stopOpacity: 1 }} />
                      </radialGradient>
                      
                      {/* Side chocolate gradient */}
                      <linearGradient id="sideChocolate" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#4E342E', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#3E2723', stopOpacity: 1 }} />
                      </linearGradient>

                      {/* Glossy highlight */}
                      <radialGradient id="glossy">
                        <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 0.3 }} />
                        <stop offset="100%" style={{ stopColor: '#ffffff', stopOpacity: 0 }} />
                      </radialGradient>
                    </defs>
                    
                    {/* Cake side (3D effect) */}
                    <ellipse cx="200" cy="250" rx="140" ry="30" fill="url(#sideChocolate)" />
                    
                    {/* Cake slices */}
                    {[...Array(8)].map((_, i) => {
                      const angle = (i * 45);
                      const nextAngle = ((i + 1) * 45);
                      const isRemoved = cakeSlices.includes(i);
                      
                      if (isRemoved) return null; 
                      
                      const x1 = 200 + 140 * Math.cos((angle - 90) * Math.PI / 180);
                      const y1 = 200 + 140 * Math.sin((angle - 90) * Math.PI / 180);
                      const x2 = 200 + 140 * Math.cos((nextAngle - 90) * Math.PI / 180);
                      const y2 = 200 + 140 * Math.sin((nextAngle - 90) * Math.PI / 180);
                      
                      return (
                        <g key={i}>
                          <path
                            d={`M 200 200 L ${x1} ${y1} A 140 140 0 0 1 ${x2} ${y2} Z`}
                            fill="url(#chocolateGrad)"
                            stroke="#2C1810"
                            strokeWidth="2"
                            className={`cursor-pointer hover:opacity-80 transition-opacity`}
                            style={{
                              transformOrigin: '200px 200px',
                              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                              pointerEvents: 'auto'
                            }}
                            onClick={() => handleCakeSliceClick(i)}
                          />
                          {/* Slice texture lines */}
                          <path
                              d={`M 200 200 L ${x1} ${y1}`}
                              stroke="#2C1810"
                              strokeWidth="1"
                              opacity="0.3"
                              style={{ pointerEvents: 'none' }}
                            />
                        </g>
                      );
                    })}
                    
                    {/* Glossy effect on top */}
                    <ellipse cx="180" cy="170" rx="60" ry="40" fill="url(#glossy)" style={{ pointerEvents: 'none' }} />
                  </svg>

                  {/* Chocolate frosting drips (positioned using percentages relative to the 400x400 viewBox area) */}
                  <div className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ transform: 'translateY(-10px)' }}>
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                          width: '12px',
                          height: '24px',
                          background: 'linear-gradient(to bottom, #4E342E, #3E2723)',
                          left: `${50 + 45 * Math.cos((i * 30 - 90) * Math.PI / 180)}%`,
                          top: `${50 + 45 * Math.sin((i * 30 - 90) * Math.PI / 180)}%`,
                          transform: 'translate(-50%, -50%)',
                          boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.2)'
                        }}
                      />
                    ))}
                  </div>

                  {/* Decorative toppings (positioned using percentages) */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
                    {/* Chocolate chips */}
                    {[...Array(16)].map((_, i) => {
                      const angle = (i * 22.5);
                      const radius = 50 + (Math.random() * 40);
                      const x = 50 + radius * Math.cos((angle - 90) * Math.PI / 180);
                      const y = 50 + radius * Math.sin((angle - 90) * Math.PI / 180);
                      
                      return (
                        <div
                          key={i}
                          className="absolute rounded-full"
                          style={{
                            width: '8px',
                            height: '8px',
                            background: 'linear-gradient(135deg, #8B4513, #654321)',
                            left: `${x}%`,
                            top: `${y}%`,
                            transform: 'translate(-50%, -50%)',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.2)'
                          }}
                        />
                      );
                    })}
                    
                    {/* White chocolate curls around edge */}
                    {[...Array(8)].map((_, i) => {
                      const angle = (i * 45);
                      const x = 50 + 58 * Math.cos((angle - 90) * Math.PI / 180);
                      const y = 50 + 58 * Math.sin((angle - 90) * Math.PI / 180);
                      
                      return (
                        <div
                          key={`curl-${i}`}
                          className="absolute"
                          style={{
                            width: '16px',
                            height: '16px',
                            background: 'linear-gradient(135deg, #FFF8DC, #F5DEB3)',
                            borderRadius: '50% 50% 0 50%',
                            left: `${x}%`,
                            top: `${y}%`,
                            transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.3), inset -1px -1px 2px rgba(139,69,19,0.2)'
                          }}
                        />
                      );
                    })}
                    
                    {/* Cherry on top */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="relative">
                        {/* Cherry stem */}
                        <div 
                          className="absolute left-1/2 -translate-x-1/2 w-1 bg-green-800 rounded-full"
                          style={{ height: '16px', top: '-16px' }}
                        />
                        {/* Cherry */}
                        <div 
                          className="w-8 h-8 rounded-full relative"
                          style={{
                            background: 'radial-gradient(circle at 30% 30%, #FF6B6B, #DC143C)',
                            boxShadow: '0 3px 6px rgba(0,0,0,0.4), inset -2px -2px 4px rgba(0,0,0,0.3), inset 2px 2px 4px rgba(255,255,255,0.3)'
                          }}
                        >
                          {/* Glossy highlight */}
                          <div 
                            className="absolute rounded-full bg-white opacity-60"
                            style={{ 
                              width: '10px', 
                              height: '10px', 
                              top: '4px', 
                              left: '6px' 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Candles - Positioned relative to the responsive cake wrapper */}
                {candlesLit && (
                  <div 
                    className="absolute w-full flex justify-center z-50 pointer-events-none"
                    style={{ top: '3%', transform: 'translateY(-100%)' }} // Move above the cake circle
                  >
                    <div className="flex gap-4 sm:gap-6">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex flex-col items-center">
                          {/* Flame - Responsive sizing added */}
                          <div className="relative mb-1">
                            <div className="w-3 h-6 bg-gradient-to-t from-yellow-300 via-orange-400 to-red-500 rounded-full animate-pulse shadow-lg shadow-orange-400/60" />
                            <div className="absolute inset-0 bg-gradient-to-t from-yellow-200 to-transparent rounded-full opacity-70" />
                            <div className="absolute inset-1 bg-gradient-to-t from-yellow-100 to-transparent rounded-full" />
                          </div>
                          {/* Candle - Responsive sizing added */}
                          <div className="relative w-2 h-10 bg-gradient-to-b from-pink-300 via-pink-400 to-pink-500 rounded-sm shadow-lg">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-r from-white/40 to-transparent rounded-l-sm" />
                            <div className="absolute top-0 left-0 right-0 h-1 bg-pink-200 rounded-t-sm" />
                            {/* Diagonal stripe */}
                            <div 
                              className="absolute inset-0 opacity-30"
                              style={{
                                background: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.3) 4px, rgba(255,255,255,0.3) 8px)'
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Shadow under cake - Repositioned relative to the responsive cake wrapper */}
                <div 
                  className="absolute left-1/2 -translate-x-1/2 w-4/5 h-2 sm:h-4 bg-black/30 rounded-full blur-xl" 
                  style={{ bottom: '-5%' }} 
                />
              </div>
              
              <p className="text-center mt-8 text-2xl font-bold text-white drop-shadow-lg">
                {candlesLit ? 'Click to blow out the candles!' : cakeSlices.length >= 8 ? 'All done! 🎉' : 'Click a slice to take it! 🍰'}
              </p>
            </div>
          </div>
        ) : (
          // Game 1 or 2: Single centered card layout (already responsive)
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-lg w-full border-4 border-white/50 pointer-events-auto">
            <div className="text-center mb-6">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent mb-2">
                An Game
              </h1>
              <p className="text-gray-600 text-lg">Complete all 3 games! 🎯</p>
            </div>
            
            {/* Game 1: Hearts */}
            {currentGame === 1 && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-pink-100 to-red-100 rounded-2xl p-6 border-2 border-pink-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Heart className="w-10 h-10 text-pink-500 fill-pink-500" />
                    <h2 className="text-2xl font-bold text-pink-700">Game 1: Find Hearts</h2>
                  </div>
                  <p className="text-lg text-gray-700">Look around and find all 3 hidden hearts! 💖</p>
                </div>
                
                <div className="flex justify-center gap-3">
                  {hearts.map((heart) => (
                    <Heart
                      key={heart.id}
                      className={`w-10 h-10 transition-all duration-500 ${
                        foundHearts.includes(heart.id) 
                          ? 'text-pink-500 fill-pink-500 scale-110' 
                          : 'text-gray-300 fill-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-center text-2xl font-bold text-gray-700">
                  {foundHearts.length}/3 Found! {foundHearts.length === 3 ? '🎉' : ''}
                </p>
              </div>
            )}

            {/* Game 2: Gifts */}
            {currentGame === 2 && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl p-6 border-2 border-purple-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Gift className="w-10 h-10 text-purple-500" />
                    <h2 className="text-2xl font-bold text-purple-700">Game 2: Open Gifts</h2>
                  </div>
                  <p className="text-lg text-gray-700">Click all the gifts to reveal surprises! 🎁</p>
                </div>
                
                <div className="flex justify-center gap-3 flex-wrap">
                  {gifts.map((gift) => (
                    <div key={gift.id}>
                      {clickedGifts.includes(gift.id) ? (
                        <span className="text-5xl">{gift.surprise}</span>
                      ) : (
                        <Gift className="w-10 h-10 text-gray-300" />
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-center text-2xl font-bold text-gray-700">
                  {clickedGifts.length}/4 Opened! {clickedGifts.length === 4 ? '🎉' : ''}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}