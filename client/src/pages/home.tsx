import { useState, useEffect } from 'react';
import OnboardingOverlay from '@/components/onboarding-overlay';
import TimerSetup from '@/components/timer-setup';
import ActiveTimer from '@/components/active-timer';
import TimerStats from '@/components/timer-stats';
import NotificationPreview from '@/components/notification-preview';
import { useProcrastinationTimer } from '@/hooks/use-procrastination-timer';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Home = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { toast } = useToast();
  
  const {
    initializing,
    timerActive,
    mode,
    currentTime,
    totalTime,
    workTimeRemaining,
    playTimeRemaining,
    isRunning,
    percentageComplete,
    startTimer,
    pauseResumeTimer,
    switchTimer,
    resetTimer,
  } = useProcrastinationTimer();

  useEffect(() => {
    // Check if this is the first time the user has visited the app
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    if (!hasVisitedBefore) {
      setShowOnboarding(true);
      localStorage.setItem('hasVisitedBefore', 'true');
    }
  }, []);

  if (initializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-neutral-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="font-sans bg-neutral-50 text-neutral-800 min-h-screen">
      <div className="max-w-md mx-auto px-4 py-8 h-full">
        {showOnboarding && (
          <OnboardingOverlay onClose={() => setShowOnboarding(false)} />
        )}

        <header className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-neutral-800 mb-1">ProcrastiTimer</h1>
          <p className="text-neutral-600">Balance your work and play time</p>
        </header>

        {!timerActive ? (
          <TimerSetup onStart={startTimer} />
        ) : (
          <>
            <ActiveTimer
              mode={mode}
              currentTime={currentTime}
              totalTime={totalTime}
              isRunning={isRunning}
              percentageComplete={percentageComplete}
              onPausePlay={pauseResumeTimer}
              onSwitch={switchTimer}
              onReset={resetTimer}
            />
            
            <TimerStats 
              workTimeRemaining={workTimeRemaining}
              playTimeRemaining={playTimeRemaining}
              mode={mode}
            />
            
            <NotificationPreview 
              mode={mode}
              currentTime={currentTime}
              isRunning={isRunning}
            />
          </>
        )}
        
        <div className="text-center">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-neutral-500 hover:text-neutral-700 text-sm"
          >
            <Settings className="h-4 w-4 mr-1" />
            Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
