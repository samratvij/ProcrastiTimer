import { Button } from '@/components/ui/button';
import { Pause, Play, RefreshCw, SeparatorHorizontal } from 'lucide-react';

interface ActiveTimerProps {
  mode: 'work' | 'play';
  currentTime: string;
  totalTime: string;
  isRunning: boolean;
  percentageComplete: number;
  onPausePlay: () => void;
  onSwitch: () => void;
  onReset: () => void;
}

const ActiveTimer = ({
  mode,
  currentTime,
  totalTime,
  isRunning,
  percentageComplete,
  onPausePlay,
  onSwitch,
  onReset,
}: ActiveTimerProps) => {
  // Calculate the stroke-dashoffset value
  const circumference = 2 * Math.PI * 45; // 45 is the radius of the circle
  const dashOffset = circumference - (percentageComplete / 100) * circumference;
  
  const isWorkMode = mode === 'work';
  const modeColors = {
    work: {
      badge: 'bg-blue-100 text-blue-700',
      button: 'bg-blue-600 hover:bg-blue-700',
      switchButton: 'bg-orange-100 text-orange-600 hover:bg-orange-200',
      progressColor: '#1976D2'
    },
    play: {
      badge: 'bg-orange-100 text-orange-700',
      button: 'bg-orange-600 hover:bg-orange-700',
      switchButton: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
      progressColor: '#FF5722'
    }
  };

  return (
    <div className="mb-8">
      <div className="text-center mb-6">
        <div className={`inline-block mb-2 px-3 py-1 rounded-full font-medium ${modeColors[mode].badge}`}>
          {isWorkMode ? 'WORK TIME' : 'PLAY TIME'}
        </div>
        <p className="text-neutral-600 text-sm">
          {isWorkMode ? 'Focus on the task at hand' : 'Take a well-deserved break'}
        </p>
      </div>
      
      <div className="flex justify-center mb-8">
        <div className="relative h-64 w-64">
          {/* Circular progress background */}
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="none" 
              stroke="#E4E7EB" 
              strokeWidth="8"
            />
            
            {/* Circular progress indicator */}
            <circle 
              className="timer-progress"
              cx="50" 
              cy="50" 
              r="45" 
              fill="none" 
              stroke={modeColors[mode].progressColor}
              strokeWidth="8" 
              strokeDasharray={circumference} 
              strokeDashoffset={dashOffset} 
              strokeLinecap="round"
            />
          </svg>
          
          {/* Time display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-neutral-800">{currentTime}</span>
            <span className="text-sm text-neutral-500 mt-1">of {totalTime}</span>
          </div>
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex justify-center items-center space-x-8">
        {/* Reset button */}
        <Button 
          variant="ghost"
          size="icon"
          className="p-3 rounded-full text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100"
          onClick={onReset}
        >
          <RefreshCw className="h-7 w-7" />
        </Button>
        
        {/* Pause/Play button */}
        <Button 
          className={`p-5 rounded-full ${modeColors[mode].button} text-white shadow-lg flex items-center justify-center`}
          size="icon"
          onClick={onPausePlay}
        >
          {isRunning ? (
            <Pause className="h-8 w-8" />
          ) : (
            <Play className="h-8 w-8" />
          )}
        </Button>
        
        {/* Switch mode button */}
        <Button 
          variant="outline"
          className={`p-3 rounded-full ${modeColors[mode].switchButton} transition duration-150`}
          size="icon"
          onClick={onSwitch}
        >
          <SeparatorHorizontal className="h-7 w-7" />
        </Button>
      </div>
    </div>
  );
};

export default ActiveTimer;
