import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Play, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TimerSetupProps {
  onStart: (totalHours: number) => void;
}

const TimerSetup = ({ onStart }: TimerSetupProps) => {
  const [totalHours, setTotalHours] = useState('4');
  const { toast } = useToast();

  const handleStartTimer = () => {
    const hours = parseFloat(totalHours);
    
    if (isNaN(hours) || hours < 0.5 || hours > 24) {
      toast({
        title: "Invalid input",
        description: "Please enter a number between 0.5 and 24 hours.",
        variant: "destructive"
      });
      return;
    }
    
    onStart(hours);
  };

  return (
    <div className="mb-8">
      <Card className="shadow-md">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-neutral-700 mb-4">How much time do you need?</h2>
          
          <div className="mb-4">
            <Label htmlFor="total-hours" className="block text-sm font-medium text-neutral-600 mb-1">
              Total Hours
            </Label>
            <div className="relative">
              <Input 
                id="total-hours" 
                type="number" 
                min="0.5" 
                max="24" 
                step="0.5" 
                value={totalHours}
                onChange={(e) => setTotalHours(e.target.value)}
                className="block w-full px-4 py-3 text-lg"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-neutral-500">hrs</span>
              </div>
            </div>
            <p className="mt-2 text-sm text-neutral-500">
              We'll split this time equally between Work and Play
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button 
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4"
              onClick={handleStartTimer}
            >
              <Play className="h-5 w-5 mr-2" />
              Start Timer
            </Button>
            
            <Button 
              variant="outline"
              className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium py-3 px-4"
            >
              <Clock className="h-5 w-5 mr-2" />
              History
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimerSetup;
