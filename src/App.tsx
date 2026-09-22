import { useState } from 'react';
import { ActiveScreen } from './types';
import { HomeView } from './views/HomeView';
import { PlayZoneView } from './views/PlayZoneView';
import { DailyBonusModal } from './components/DailyBonusModal';
import { UpgradeModal } from './components/UpgradeModal';
import { CadetProfileModal } from './components/CadetProfileModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { CosmicCanvasBackground } from './components/CosmicCanvasBackground';
import { soundManager } from './utils/audio';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('home');
  const [stars, setStars] = useState<number>(1420);
  const [gems, setGems] = useState<number>(385);
  const [playSessionKey, setPlaySessionKey] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('space_cleanup_high_score');
      if (saved !== null) return parseInt(saved, 10) || 0;
    } catch {
      
    }
    return 0;
  });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  
  const [suctionPower, setSuctionPower] = useState<number>(2);
  const [boostSpeed, setBoostSpeed] = useState<number>(2);
  const [shieldDuration, setShieldDuration] = useState<number>(1);

 
  const [isDailyBonusOpen, setIsDailyBonusOpen] = useState<boolean>(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState<boolean>(false);
  const [isCadetProfileOpen, setIsCadetProfileOpen] = useState<boolean>(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState<boolean>(false);

  const handleClaimDailyBonus = (awardedStars: number, awardedGems: number) => {
    setStars((prev) => prev + awardedStars);
    setGems((prev) => prev + awardedGems);
  };

  const handleUpgrade = (type: 'suction' | 'boost' | 'shield', cost: number) => {
    setStars((prev) => Math.max(0, prev - cost));
    if (type === 'suction') setSuctionPower((p) => Math.min(5, p + 1));
    if (type === 'boost') setBoostSpeed((p) => Math.min(5, p + 1));
    if (type === 'shield') setShieldDuration((p) => Math.min(5, p + 1));
  };

  const handleConfirmWholeReset = () => {
    try {
      localStorage.setItem('space_cleanup_high_score', '0');
    } catch {
      
    }
    setHighScore(0);
    setStars(0);
    setGems(0);
    setSuctionPower(1);
    setBoostSpeed(1);
    setShieldDuration(1);
    setPlaySessionKey((k) => k + 1);
  };

  return (
    <div className="bg-[#060212] font-['Chakra_Petch'] text-white h-screen h-[100dvh] max-h-screen w-screen max-w-full overflow-hidden relative select-none flex flex-col">
      
      {activeScreen === 'home' && <CosmicCanvasBackground speedMultiplier={1} />}

      
      <main className="relative z-10 w-full h-full flex-1 flex flex-col overflow-hidden">
        {activeScreen === 'home' && (
          <HomeView            
              onPlay={() => {
              soundManager.playBoost();
              setActiveScreen('play-zone');
          }}
            soundEnabled={soundEnabled}
            setSoundEnabled={setSoundEnabled}
            highScore={highScore}
          />
        )}

        {activeScreen === 'play-zone' && (
          <PlayZoneView
            key={playSessionKey}
            initialScore={0}
            gems={gems}
            setGems={setGems}
            stars={stars}
            setStars={setStars}
            highScore={highScore}
            setHighScore={setHighScore}
            onReturnHome={() => {
              soundManager.playClick();
              setActiveScreen('home');
            }}
            onWholeReset={() => setIsResetConfirmOpen(true)}
            suctionPower={suctionPower}
            boostSpeed={boostSpeed}
            shieldDuration={shieldDuration}
          />
        )}
      </main>
      
      <ResetConfirmModal        
isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleConfirmWholeReset}
      />

      <DailyBonusModal
        isOpen={isDailyBonusOpen}
        onClose={() => setIsDailyBonusOpen(false)}
        onClaim={handleClaimDailyBonus}
      />

      <UpgradeModal        
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        stars={stars}
        suctionPower={suctionPower}
        boostSpeed={boostSpeed}
        shieldDuration={shieldDuration}
        onUpgrade={handleUpgrade}
      />

      <CadetProfileModal
        isOpen={isCadetProfileOpen}
        onClose={() => setIsCadetProfileOpen(false)}
        highScore={highScore}
        totalStars={stars}
        totalGems={gems}
        vacuumGrade="Class S"
      />
    </div>  
  );
}