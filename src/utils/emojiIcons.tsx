import React from 'react';

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: number | string;
  color?: string;
  strokeWidth?: number | string;
  className?: string;
}

export type LucideIcon = React.ForwardRefExoticComponent<IconProps & React.RefAttributes<HTMLSpanElement>>;

function createEmojiIcon(emoji: string): LucideIcon {
  const Component = React.forwardRef<HTMLSpanElement, IconProps>(
    ({ size = 18, className = '', style, color, strokeWidth, ...props }, ref) => {
      const sizePx = typeof size === 'number' ? `${size}px` : size;
      return (
        <span
          ref={ref}
          role="img"
          aria-hidden="true"
          className={`inline-flex items-center justify-center select-none text-current leading-none shrink-0 ${className}`}
          style={{
            fontSize: sizePx,
            width: sizePx,
            height: sizePx,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            ...style,
          }}
          {...props}
        >
          {emoji}
        </span>
      );
    }
  );
  Component.displayName = 'EmojiIcon';
  return Component;
}

// Universal fallback
export const LucideProps = {};
export const icons = new Proxy({}, {
  get: (_, prop: string) => createEmojiIcon('🔹')
});
export const Activity = createEmojiIcon('📈');
export const AlertCircle = createEmojiIcon('⚠️');
export const AlertTriangle = createEmojiIcon('⚠️');
export const ArrowLeft = createEmojiIcon('⬅️');
export const ArrowRight = createEmojiIcon('➡️');
export const ArrowUpRight = createEmojiIcon('↗️');
export const Award = createEmojiIcon('🏆');
export const BarChart3 = createEmojiIcon('📊');
export const Bell = createEmojiIcon('🔔');
export const BookOpen = createEmojiIcon('📖');
export const Bookmark = createEmojiIcon('🔖');
export const BookmarkCheck = createEmojiIcon('📑');
export const Bot = createEmojiIcon('🤖');
export const Briefcase = createEmojiIcon('💼');
export const Building = createEmojiIcon('🏢');
export const Building2 = createEmojiIcon('🏛️');
export const Calendar = createEmojiIcon('📅');
export const CalendarCheck = createEmojiIcon('📆');
export const Check = createEmojiIcon('✔️');
export const CheckCheck = createEmojiIcon('✅');
export const CheckCircle = createEmojiIcon('✅');
export const CheckCircle2 = createEmojiIcon('✅');
export const ChevronDown = createEmojiIcon('▾');
export const ChevronLeft = createEmojiIcon('‹');
export const ChevronRight = createEmojiIcon('›');
export const ChevronUp = createEmojiIcon('▴');
export const Circle = createEmojiIcon('⚪');
export const Clock = createEmojiIcon('⏱️');
export const CloudOff = createEmojiIcon('☁️');
export const Code = createEmojiIcon('💻');
export const Code2 = createEmojiIcon('📝');
export const Command = createEmojiIcon('⌘');
export const Copy = createEmojiIcon('📋');
export const Cpu = createEmojiIcon('⚙️');
export const CreditCard = createEmojiIcon('💳');
export const Database = createEmojiIcon('🗄️');
export const DollarSign = createEmojiIcon('💲');
export const Download = createEmojiIcon('📥');
export const Edit3 = createEmojiIcon('✏️');
export const Eraser = createEmojiIcon('🧹');
export const ExternalLink = createEmojiIcon('↗️');
export const FileArchive = createEmojiIcon('📦');
export const FileCheck2 = createEmojiIcon('📋');
export const FileCode = createEmojiIcon('📄');
export const FileText = createEmojiIcon('📄');
export const Filter = createEmojiIcon('🔍');
export const Flame = createEmojiIcon('🔥');
export const Gauge = createEmojiIcon('⏱️');
export const GitCompare = createEmojiIcon('🔀');
export const Globe = createEmojiIcon('🌐');
export const GraduationCap = createEmojiIcon('🎓');
export const Grid = createEmojiIcon('⊞');
export const Hand = createEmojiIcon('✋');
export const HardDrive = createEmojiIcon('💾');
export const Hash = createEmojiIcon('#');
export const HelpCircle = createEmojiIcon('❓');
export const History = createEmojiIcon('🕒');
export const Info = createEmojiIcon('ℹ️');
export const KeyRound = createEmojiIcon('🔑');
export const Keyboard = createEmojiIcon('⌨️');
export const Layers = createEmojiIcon('📚');
export const LayoutDashboard = createEmojiIcon('📊');
export const Lightbulb = createEmojiIcon('💡');
export const ListChecks = createEmojiIcon('☑️');
export const Loader2 = createEmojiIcon('⏳');
export const Lock = createEmojiIcon('🔒');
export const LogOut = createEmojiIcon('🚪');
export const Mail = createEmojiIcon('✉️');
export const MapPin = createEmojiIcon('📍');
export const Menu = createEmojiIcon('☰');
export const MessageSquare = createEmojiIcon('💬');
export const Mic = createEmojiIcon('🎙️');
export const MicOff = createEmojiIcon('🔇');
export const Minus = createEmojiIcon('➖');
export const Monitor = createEmojiIcon('🖥️');
export const Paperclip = createEmojiIcon('📎');
export const PenTool = createEmojiIcon('🖋️');
export const Percent = createEmojiIcon('%');
export const Phone = createEmojiIcon('📞');
export const PhoneOff = createEmojiIcon('📴');
export const Play = createEmojiIcon('▶️');
export const PlayCircle = createEmojiIcon('⏯️');
export const Plus = createEmojiIcon('➕');
export const PlusCircle = createEmojiIcon('➕');
export const Printer = createEmojiIcon('🖨️');
export const QrCode = createEmojiIcon('📱');
export const Radio = createEmojiIcon('📻');
export const Receipt = createEmojiIcon('🧾');
export const RefreshCw = createEmojiIcon('🔄');
export const RotateCcw = createEmojiIcon('↺');
export const RotateCw = createEmojiIcon('↻');
export const Save = createEmojiIcon('💾');
export const ScrollText = createEmojiIcon('📜');
export const Search = createEmojiIcon('🔍');
export const Send = createEmojiIcon('📤');
export const Server = createEmojiIcon('🖥️');
export const Share2 = createEmojiIcon('🔗');
export const Shield = createEmojiIcon('🛡️');
export const ShieldAlert = createEmojiIcon('🛡️');
export const ShieldCheck = createEmojiIcon('🛡️');
export const Sliders = createEmojiIcon('🎚️');
export const Smartphone = createEmojiIcon('📱');
export const Smile = createEmojiIcon('😊');
export const Sparkles = createEmojiIcon('✨');
export const Square = createEmojiIcon('⏹️');
export const Tablet = createEmojiIcon('📱');
export const Tag = createEmojiIcon('🏷️');
export const Target = createEmojiIcon('🎯');
export const Terminal = createEmojiIcon('💻');
export const Trash2 = createEmojiIcon('🗑️');
export const TrendingDown = createEmojiIcon('📉');
export const TrendingUp = createEmojiIcon('📈');
export const Type = createEmojiIcon('🔤');
export const Upload = createEmojiIcon('📤');
export const User = createEmojiIcon('👤');
export const UserCheck = createEmojiIcon('👤');
export const UserX = createEmojiIcon('👤');
export const Users = createEmojiIcon('👥');
export const Video = createEmojiIcon('🎥');
export const VideoOff = createEmojiIcon('📹');
export const Volume2 = createEmojiIcon('🔊');
export const VolumeX = createEmojiIcon('🔇');
export const Wallet = createEmojiIcon('👛');
export const Wifi = createEmojiIcon('📶');
export const WifiOff = createEmojiIcon('📴');
export const X = createEmojiIcon('✕');
export const Zap = createEmojiIcon('⚡');
