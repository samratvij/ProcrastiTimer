import { Pause, Play, SeparatorHorizontal } from 'lucide-react';

interface NotificationPreviewProps {
  mode: 'work' | 'play';
  currentTime: string;
  isRunning: boolean;
}

const NotificationPreview = ({ mode, currentTime, isRunning }: NotificationPreviewProps) => {
  const isWorkMode = mode === 'work';
  
  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium text-neutral-500 flex items-center mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Notification Preview
      </h3>
      
      <div className="bg-neutral-900 rounded-xl p-4 notification-mock">
        <div className="flex items-center">
          <div className={`h-10 w-10 flex items-center justify-center ${isWorkMode ? 'bg-blue-600' : 'bg-orange-600'} rounded-full mr-3`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
              <span className="text-white font-medium">
                ProcrastiTimer ({isWorkMode ? 'WORK' : 'PLAY'})
              </span>
              <span className="text-neutral-400 text-xs">now</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-neutral-200">
                {currentTime} remaining
              </span>
              
              <div className="flex space-x-3">
                <button className={isWorkMode ? 'text-blue-400' : 'text-orange-400'}>
                  {isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </button>
                
                <button className={isWorkMode ? 'text-orange-400' : 'text-blue-400'}>
                  <SeparatorHorizontal className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPreview;
