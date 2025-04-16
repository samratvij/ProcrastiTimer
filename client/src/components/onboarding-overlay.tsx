import { Button } from '@/components/ui/button';
import { X, Clock, Briefcase, Play, Bell } from 'lucide-react';

interface OnboardingOverlayProps {
  onClose: () => void;
}

const OnboardingOverlay = ({ onClose }: OnboardingOverlayProps) => {
  return (
    <div className="fixed inset-0 bg-neutral-900/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
        <Button 
          variant="ghost" 
          className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-700"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>
        
        <h2 className="text-2xl font-bold text-neutral-800 mb-4">Welcome to ProcrastiTimer</h2>
        
        <div className="space-y-4 mb-6">
          <div className="flex items-start">
            <div className="bg-primary-50 p-2 rounded-full mr-3">
              <Clock className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-800">Balance Work & Play</h3>
              <p className="text-neutral-600 text-sm">Set your total hours and we'll split it into equal Work and Play segments.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <Briefcase className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-800">Work Timer</h3>
              <p className="text-neutral-600 text-sm">Focus on your tasks during Work time. The timer runs in the background.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-orange-100 p-2 rounded-full mr-3">
              <Play className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-800">Play Timer</h3>
              <p className="text-neutral-600 text-sm">Enjoy guilt-free breaks during Play time. Switch between timers anytime.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-amber-50 p-2 rounded-full mr-3">
              <Bell className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-800">Always Visible</h3>
              <p className="text-neutral-600 text-sm">Timer stays in your notifications, even on lock screen.</p>
            </div>
          </div>
        </div>
        
        <Button 
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg py-3 transition duration-200"
          onClick={onClose}
        >
          Start Using ProcrastiTimer
        </Button>
      </div>
    </div>
  );
};

export default OnboardingOverlay;
