import React, { useState } from 'react';
import { Flame, Sparkles, Zap, ShieldCheck } from 'lucide-react';

export interface StreakTrackerProps {
  /** Current streak count (defaults to 5 as requested) */
  streakCount?: number;
  /** Motivating label or message */
  motivatingLabel?: string;
  /** Optional custom CSS classes */
  className?: string;
  /** Optional callback when user logs daily engagement */
  onCheckIn?: () => void;
}

/**
 * StreakTracker:
 * Displays user's current daily engagement streak (mocked at 5),
 * a fire icon, and a short motivating label.
 * Built using a sleek glass-morphism style card consistent with
 * the dashboard's deep blue theme (backdrop-blur, border-blue/slate, deep navy gradient).
 */
export const StreakTracker: React.FC<StreakTrackerProps> = ({
  streakCount: initialStreak = 5,
  motivatingLabel = "You're on fire! Keep the momentum going today.",
  className = '',
  onCheckIn
}) => {
  const [streak, setStreak] = useState<number>(initialStreak);
  const [hasCompletedToday, setHasCompletedToday] = useState<boolean>(true);
  const [showSparkle, setShowSparkle] = useState<boolean>(false);

  const handleClaimDay = () => {
    if (!hasCompletedToday) {
      setHasCompletedToday(true);
      setStreak((prev) => prev + 1);
      setShowSparkle(true);
      setTimeout(() => setShowSparkle(false), 2500);
      onCheckIn?.();
    }
  };

  // Trailing mini-days indicators for weekly engagement
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const activeDaysCount = Math.min(streak, 7);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-5 
        bg-white border border-[#E5E7EB] 
        shadow-xs transition-all duration-300 hover:border-[#DC2626]/40 text-[#1F2937] ${className}`}
    >
      {/* Card Content */}
      <div className="relative z-10 space-y-4">
        {/* Top Header Row: Badge & Status */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-50 text-[#DC2626] border border-red-200">
            <Zap className="w-3.5 h-3.5 text-[#DC2626]" />
            <span>Daily Streak</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-[#DC2626] font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-[#DC2626]" />
            <span>Active</span>
          </div>
        </div>

        {/* Main Stats Row: Big Fire Icon + Streak Number */}
        <div className="flex items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-3.5">
            {/* Fire Icon */}
            <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-red-50 border border-red-200 shadow-xs shrink-0">
              <Flame className="w-6 h-6 text-[#DC2626] fill-[#DC2626]/80 animate-pulse" />
              <Sparkles className="w-3 h-3 text-[#DC2626] absolute -top-1 -right-1" />
            </div>

            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black tracking-tight text-[#1F2937] font-sans">
                  {streak}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#DC2626]">
                  {streak === 1 ? 'Day' : 'Days'}
                </span>
              </div>
              <p className="text-[11px] font-medium text-[#4B5563] mt-0.5">
                Daily learning engagement
              </p>
            </div>
          </div>

          {/* Quick status pill */}
          <div className="text-right shrink-0">
            <span className="inline-block px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase rounded-lg bg-red-50 text-[#DC2626] border border-red-200">
              Streak Saved
            </span>
          </div>
        </div>

        {/* Motivating Label */}
        <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
          <p className="text-xs text-[#1F2937] font-medium leading-relaxed flex items-start gap-2">
            <span className="text-[#DC2626] select-none">🔥</span>
            <span>{motivatingLabel}</span>
          </p>
        </div>

        {/* Weekly mini engagement dots */}
        <div className="pt-1 flex items-center justify-between border-t border-[#E5E7EB] text-[10px]">
          <span className="text-[#4B5563] font-medium">This Week:</span>
          <div className="flex items-center gap-1.5">
            {weekDays.map((day, i) => {
              const isFilled = i < activeDaysCount;
              return (
                <div
                  key={i}
                  className={`w-5 h-5 rounded-md flex items-center justify-center font-bold transition-colors ${
                    isFilled
                      ? 'bg-red-50 text-[#DC2626] border border-red-200'
                      : 'bg-gray-100 text-[#4B5563] border border-[#E5E7EB]'
                  }`}
                  title={`${day} - ${isFilled ? 'Active' : 'Upcoming'}`}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreakTracker;
