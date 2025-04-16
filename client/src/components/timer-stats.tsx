import { Card, CardContent } from '@/components/ui/card';

interface TimerStatsProps {
  workTimeRemaining: string;
  playTimeRemaining: string;
  mode: 'work' | 'play';
}

const TimerStats = ({ workTimeRemaining, playTimeRemaining, mode }: TimerStatsProps) => {
  // Calculate progress percentages based on time remaining
  // This is a simplified calculation - you would need the total times to calculate this accurately
  const workProgress = mode === 'work' ? 25 : 0; // These are placeholders
  const playProgress = mode === 'play' ? 25 : 0; // These would be calculated from actual timers

  return (
    <Card className="shadow-md mb-8">
      <CardContent className="p-5">
        <h3 className="text-lg font-semibold text-neutral-700 mb-3">Session Progress</h3>
        
        <div className="space-y-4">
          {/* Work time progress */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-neutral-700">
                <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                Work Time
              </span>
              <span className="text-neutral-600">{workTimeRemaining} left</span>
            </div>
            <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full" 
                style={{ width: `${workProgress}%` }}
              ></div>
            </div>
          </div>
          
          {/* Play time progress */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-neutral-700">
                <span className="inline-block w-3 h-3 rounded-full bg-orange-500 mr-2"></span>
                Play Time
              </span>
              <span className="text-neutral-600">{playTimeRemaining} left</span>
            </div>
            <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-orange-500 rounded-full" 
                style={{ width: `${playProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimerStats;
