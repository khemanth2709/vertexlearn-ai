import React, { useState, useRef, useEffect } from 'react';
import { useLMS } from '../../context/LMSContext';
import { 
  MessageSquare, 
  Send, 
  Hash, 
  User as UserIcon, 
  Paperclip, 
  Sparkles, 
  Smile, 
  Clock, 
  CheckCheck,
  ShieldCheck
} from 'lucide-react';

export const MessagingModule: React.FC = () => {
  const { 
    channels, 
    messages, 
    activeChannelId, 
    setActiveChannelId, 
    sendChannelMessage, 
    sendDirectMessage, 
    user, 
    usersList 
  } = useLMS();

  const [inputText, setInputText] = useState('');
  const [activeDmUserId, setActiveDmUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChannel = channels.find(c => c.id === activeChannelId) || channels[0];
  const activeDmUser = usersList.find(u => u.id === activeDmUserId);

  // Filter messages based on active context
  const currentMessages = activeDmUserId
    ? messages.filter(m => 
        (m.senderId === user?.id && m.recipientId === activeDmUserId) ||
        (m.senderId === activeDmUserId && m.recipientId === user?.id)
      )
    : messages.filter(m => m.channelId === activeChannelId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeChannelId, activeDmUserId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (activeDmUserId) {
      sendDirectMessage(activeDmUserId, inputText);
    } else {
      sendChannelMessage(inputText);
    }
    setInputText('');
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex rounded-2xl bg-white border border-[#E5E7EB] overflow-hidden shadow-xs text-[#1F2937]">
      
      {/* Channels & DMs Sidebar */}
      <div className="w-64 sm:w-72 bg-[#F9FAFB] border-r border-[#E5E7EB] flex flex-col shrink-0">
        
        {/* Header */}
        <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#DC2626]" />
            <h2 className="font-bold text-sm text-[#1F2937]">Cohort Messenger</h2>
          </div>
          <span className="text-[10px] font-semibold bg-red-50 text-[#DC2626] px-2 py-0.5 rounded-full border border-red-200">
            Realtime
          </span>
        </div>

        {/* Channels List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          <div>
            <div className="text-[10px] font-bold text-[#4B5563] uppercase tracking-wider px-2 mb-1.5">
              Public Cohort Channels
            </div>
            <div className="space-y-0.5">
              {channels.map((ch) => {
                const isActive = !activeDmUserId && activeChannelId === ch.id;
                return (
                  <button
                    key={ch.id}
                    onClick={() => {
                      setActiveChannelId(ch.id);
                      setActiveDmUserId(null);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-[#DC2626] text-white font-semibold shadow-xs' 
                        : 'text-[#4B5563] hover:text-[#1F2937] hover:bg-gray-200/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Hash className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#4B5563]'}`} />
                      <span className="truncate">{ch.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Direct Messages */}
          <div>
            <div className="text-[10px] font-bold text-[#4B5563] uppercase tracking-wider px-2 mb-1.5">
              Direct Messages (Faculty & Peers)
            </div>
            <div className="space-y-0.5">
              {usersList.filter(u => u.id !== user?.id).map((u) => {
                const isActive = activeDmUserId === u.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => {
                      setActiveDmUserId(u.id);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-[#DC2626] text-white font-semibold shadow-xs' 
                        : 'text-[#4B5563] hover:text-[#1F2937] hover:bg-gray-200/60'
                    }`}
                  >
                    <img src={u.avatar} alt={u.name} className="w-5 h-5 rounded-full object-cover border border-[#E5E7EB]" />
                    <div className="truncate flex-1 text-left">
                      <div className="truncate font-semibold">{u.name}</div>
                      <div className={`text-[10px] capitalize ${isActive ? 'text-red-100' : 'text-[#4B5563]'}`}>
                        {u.role} &bull; {u.department.split(' ')[0]}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Main Chat Thread */}
      <div className="flex-1 flex flex-col bg-white">
        
        {/* Chat Header */}
        <div className="p-4 border-b border-[#E5E7EB] bg-[#F9FAFB] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#1F2937] flex items-center gap-2">
              {activeDmUser ? (
                <>
                  <img src={activeDmUser.avatar} alt={activeDmUser.name} className="w-6 h-6 rounded-full object-cover border border-[#E5E7EB]" />
                  <span>{activeDmUser.name}</span>
                  <span className="text-[10px] font-medium text-[#DC2626] bg-red-50 border border-red-200 px-2 py-0.5 rounded-full capitalize">
                    {activeDmUser.role}
                  </span>
                </>
              ) : (
                <>
                  <Hash className="w-4 h-4 text-[#DC2626]" />
                  <span>#{activeChannel.name}</span>
                </>
              )}
            </h3>
            <p className="text-[11px] text-[#4B5563] mt-0.5">
              {activeDmUser 
                ? `1-on-1 Consultation & Grading Inquiries with ${activeDmUser.name}`
                : activeChannel.description}
            </p>
          </div>

          <div className="text-[11px] text-green-700 flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
            End-to-End Encrypted Channel
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-white">
          {currentMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-[#4B5563] space-y-2">
              <MessageSquare className="w-10 h-10 text-gray-300" />
              <div className="text-xs font-semibold text-[#1F2937]">No messages in this thread yet.</div>
              <p className="text-[11px] max-w-xs text-[#4B5563]">
                Start the conversation with cohort peers or post questions to the faculty director.
              </p>
            </div>
          ) : (
            currentMessages.map((msg) => {
              const isMine = msg.senderId === user?.id;

              return (
                <div key={msg.id} className={`flex gap-3 ${isMine ? 'justify-end' : 'justify-start'}`}>
                  {!isMine && (
                    <img 
                      src={msg.senderAvatar} 
                      alt={msg.senderName} 
                      className="w-8 h-8 rounded-full object-cover border border-[#E5E7EB] shrink-0 mt-0.5" 
                    />
                  )}

                  <div className={`max-w-[75%] space-y-1 ${isMine ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 text-[11px] text-[#4B5563] px-1">
                      <span className="font-semibold text-[#1F2937]">{msg.senderName}</span>
                      <span className="text-[10px] text-[#4B5563] uppercase">{msg.senderRole}</span>
                      <span>&bull;</span>
                      <span className="text-[10px] text-gray-400">{msg.timestamp}</span>
                    </div>

                    <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                      isMine 
                        ? 'bg-[#DC2626] text-white rounded-tr-none shadow-xs' 
                        : 'bg-[#F9FAFB] border border-[#E5E7EB] text-[#1F2937] rounded-tl-none shadow-xs'
                    }`}>
                      {msg.text}
                      {msg.attachmentName && (
                        <div className="mt-2 pt-2 border-t border-white/20 flex items-center gap-1.5 text-[11px] text-white">
                          <Paperclip className="w-3 h-3" />
                          <span>Attachment: {msg.attachmentName}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {isMine && (
                    <img 
                      src={msg.senderAvatar} 
                      alt={msg.senderName} 
                      className="w-8 h-8 rounded-full object-cover border border-[#E5E7EB] shrink-0 mt-0.5" 
                    />
                  )}
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-[#E5E7EB] bg-[#F9FAFB] flex items-center gap-2">
          <input 
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              activeDmUser 
                ? `Message ${activeDmUser.name}...` 
                : `Post to #${activeChannel.name}...`
            }
            className="flex-1 bg-white border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-[#DC2626]"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="bg-[#DC2626] hover:bg-[#B91C1C] disabled:opacity-40 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>

      </div>

    </div>
  );
};
