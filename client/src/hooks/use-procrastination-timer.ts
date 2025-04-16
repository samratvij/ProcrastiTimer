import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

type TimerMode = 'work' | 'play';

interface TimerState {
  totalSeconds: number;
  workSecondsRemaining: number;
  playSecondsRemaining: number;
  currentMode: TimerMode;
  isRunning: boolean;
}

export const useProcrastinationTimer = () => {
  const [timerState, setTimerState] = useState<TimerState | null>(null);
  const timerRef = useRef<number | null>(null);
  const lastTickTime = useRef<number | null>(null);
  const { toast } = useToast();

  // Fetch any existing timer state from the server
  const { data, isLoading } = useQuery({
    queryKey: ['/api/timer'],
    staleTime: 0, // Always check for the latest state
  });

  // Initialize the timer state from the server or create a new one
  useEffect(() => {
    if (data) {
      setTimerState({
        totalSeconds: data.totalSeconds,
        workSecondsRemaining: data.workSecondsRemaining,
        playSecondsRemaining: data.playSecondsRemaining,
        currentMode: data.currentMode as TimerMode,
        isRunning: data.isRunning,
      });
    }
  }, [data]);

  // Mutation to update timer state on the server
  const { mutate: updateTimerState } = useMutation({
    mutationFn: async (state: TimerState) => {
      return apiRequest('PUT', '/api/timer', state);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update timer state",
        variant: "destructive",
      });
    },
  });

  // Update the timer on the server periodically
  const syncTimerWithServer = useCallback(() => {
    if (timerState) {
      updateTimerState(timerState);
    }
  }, [timerState, updateTimerState]);

  // Set up a periodic sync with the server (every 10 seconds)
  useEffect(() => {
    const syncInterval = setInterval(syncTimerWithServer, 10000);
    return () => clearInterval(syncInterval);
  }, [syncTimerWithServer]);

  // Timer tick function that updates the time
  const timerTick = useCallback(() => {
    if (!timerState || !timerState.isRunning) return;

    const now = Date.now();
    if (!lastTickTime.current) {
      lastTickTime.current = now;
      return;
    }

    const elapsed = Math.floor((now - lastTickTime.current) / 1000);
    if (elapsed < 1) return;

    lastTickTime.current = now;

    setTimerState(prevState => {
      if (!prevState) return null;

      let updatedState = { ...prevState };
      
      if (prevState.currentMode === 'work') {
        updatedState.workSecondsRemaining = Math.max(0, prevState.workSecondsRemaining - elapsed);
        // Auto-switch to play when work time is up
        if (updatedState.workSecondsRemaining === 0 && prevState.playSecondsRemaining > 0) {
          updatedState.currentMode = 'play';
          // Notify the user
          if (Notification.permission === 'granted') {
            new Notification('Work time complete!', {
              body: 'Time to switch to play mode.',
              icon: '/favicon.ico'
            });
          }
        }
      } else {
        updatedState.playSecondsRemaining = Math.max(0, prevState.playSecondsRemaining - elapsed);
        // Auto-switch to work when play time is up
        if (updatedState.playSecondsRemaining === 0 && prevState.workSecondsRemaining > 0) {
          updatedState.currentMode = 'work';
          // Notify the user
          if (Notification.permission === 'granted') {
            new Notification('Play time complete!', {
              body: 'Time to switch to work mode.',
              icon: '/favicon.ico'
            });
          }
        }
      }
      
      // Check if both timers are at zero - timer is complete
      if (updatedState.workSecondsRemaining === 0 && updatedState.playSecondsRemaining === 0) {
        updatedState.isRunning = false;
        // Notify the user
        if (Notification.permission === 'granted') {
          new Notification('Timer Complete!', {
            body: 'Both work and play times are complete.',
            icon: '/favicon.ico'
          });
        }
      }
      
      return updatedState;
    });
  }, [timerState]);

  // Set up the timer
  useEffect(() => {
    // Request notification permission
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
    
    // Create a timer that ticks every 100ms
    if (timerState?.isRunning && !timerRef.current) {
      lastTickTime.current = Date.now();
      timerRef.current = window.setInterval(timerTick, 100);
    } else if (!timerState?.isRunning && timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
      lastTickTime.current = null;
    }
    
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [timerState?.isRunning, timerTick]);

  // Helper to format seconds into HH:MM:SS
  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Calculate times for display
  const currentTime = timerState ? 
    formatTime(timerState.currentMode === 'work' ? timerState.workSecondsRemaining : timerState.playSecondsRemaining) : 
    '00:00:00';

  const totalTime = timerState ? 
    formatTime(Math.floor(timerState.totalSeconds / 2)) : 
    '00:00:00';

  const workTimeRemaining = timerState ? 
    formatTime(timerState.workSecondsRemaining) : 
    '00:00:00';

  const playTimeRemaining = timerState ? 
    formatTime(timerState.playSecondsRemaining) : 
    '00:00:00';

  // Calculate percentage complete for the current timer
  const totalSecondsForMode = timerState ? Math.floor(timerState.totalSeconds / 2) : 0;
  const currentModeSecondsRemaining = timerState ? 
    (timerState.currentMode === 'work' ? timerState.workSecondsRemaining : timerState.playSecondsRemaining) : 
    0;
  const secondsUsed = totalSecondsForMode - currentModeSecondsRemaining;
  const percentageComplete = totalSecondsForMode > 0 ? (secondsUsed / totalSecondsForMode) * 100 : 0;

  // Start a new timer with total hours
  const startTimer = (totalHours: number) => {
    const totalSeconds = Math.floor(totalHours * 3600);
    const halfSeconds = Math.floor(totalSeconds / 2);
    
    const newState: TimerState = {
      totalSeconds,
      workSecondsRemaining: halfSeconds,
      playSecondsRemaining: halfSeconds,
      currentMode: 'work', // Start with work mode
      isRunning: true,
    };
    
    setTimerState(newState);
    
    // Create a new timer session on the server
    apiRequest('POST', '/api/timer', newState)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ['/api/timer'] });
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to start the timer",
          variant: "destructive",
        });
      });
    
    // Request notification permission if not granted
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  };

  // Pause or resume the current timer
  const pauseResumeTimer = () => {
    if (!timerState) return;
    
    const updatedState = {
      ...timerState,
      isRunning: !timerState.isRunning,
    };
    
    setTimerState(updatedState);
    syncTimerWithServer(); // Immediately sync with server
  };

  // Switch between work and play modes
  const switchTimer = () => {
    if (!timerState) return;
    
    const updatedState = {
      ...timerState,
      currentMode: timerState.currentMode === 'work' ? 'play' : 'work',
      isRunning: true, // Switching automatically starts the timer
    };
    
    setTimerState(updatedState);
    syncTimerWithServer(); // Immediately sync with server
  };

  // Reset the timer (clear it)
  const resetTimer = () => {
    // Reset in UI
    setTimerState(null);
    
    // Delete the timer on the server
    apiRequest('DELETE', '/api/timer')
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ['/api/timer'] });
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to reset the timer",
          variant: "destructive",
        });
      });
  };

  return {
    initializing: isLoading,
    timerActive: !!timerState,
    mode: timerState?.currentMode || 'work',
    currentTime,
    totalTime,
    workTimeRemaining,
    playTimeRemaining,
    isRunning: !!timerState?.isRunning,
    percentageComplete,
    startTimer,
    pauseResumeTimer,
    switchTimer,
    resetTimer,
  };
};
