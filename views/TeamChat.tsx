
import React, { useState, useEffect, useRef } from 'react';
import { 
  Hash, Search, Plus, Send, MoreHorizontal, Phone, Video, 
  Info, Smile, Paperclip, Lock, Users, MessageSquare, ChevronDown, Edit,
  Mic, MicOff, VideoOff, PhoneOff, X, FileText, Image as ImageIcon,
  Check, CheckCheck, Clock, Reply, Trash2, Heart, ThumbsUp, Laugh,
  LogOut, Settings
} from 'lucide-react';
import { ChatChannel, ChatMessage, ChatAttachment } from '../types';
import { MOCK_CHANNELS, MOCK_CHAT_MESSAGES } from '../constants';

// --- Sub-components ---

const CallOverlay = ({ isActive, type, onEnd, isMuted, toggleMute, isVideoOff, toggleVideo }: any) => {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        let interval: any;
        if (isActive) {
            setSeconds(0);
            interval = setInterval(() => {
                setSeconds(s => s + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isActive]);

    if (!isActive) return null;

    const formatTime = (totalSeconds: number) => {
        const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const s = (totalSeconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    return (
        <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300">
            <div className="flex flex-col items-center gap-6">
                <div className="relative">
                    <div className="w-32 h-32 rounded-full border-4 border-white/20 overflow-hidden bg-gray-800 flex items-center justify-center">
                        <span className="text-4xl text-white font-bold">JD</span>
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-black"></div>
                </div>
                <div className="text-center text-white">
                    <h2 className="text-2xl font-bold">John Doe</h2>
                    <p className="text-gray-400 animate-pulse">{type === 'video' ? 'Video Calling...' : 'Audio Calling...'}</p>
                    <p className="text-sm text-gray-500 mt-2 font-mono">{formatTime(seconds)}</p>
                </div>
                
                <div className="flex items-center gap-4 mt-8">
                    <button 
                        onClick={toggleMute}
                        className={`p-4 rounded-full transition-all ${isMuted ? 'bg-red-500/20 text-red-500' : 'bg-white/10 text-white hover:bg-white/20'}`}
                    >
                        {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                    </button>
                    <button 
                        onClick={onEnd}
                        className="p-4 rounded-full bg-red-600 text-white hover:bg-red-700 transition-all scale-110 shadow-lg shadow-red-900/50"
                    >
                        <PhoneOff size={28} />
                    </button>
                    {type === 'video' && (
                        <button 
                            onClick={toggleVideo}
                            className={`p-4 rounded-full transition-all ${isVideoOff ? 'bg-red-500/20 text-red-500' : 'bg-white/10 text-white hover:bg-white/20'}`}
                        >
                            {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const CreateChannelModal = ({ isOpen, onClose, onSave }: { isOpen: boolean, onClose: () => void, onSave: (data: any) => void }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ name, description, type: isPrivate ? 'private' : 'public' });
        setName('');
        setDescription('');
        setIsPrivate(false);
        onClose();
    };

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
             <div className="bg-white dark:bg-[#18181b] w-full max-w-md rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 p-6">
                 <div className="flex justify-between items-center mb-6">
                     <h3 className="text-lg font-bold text-black dark:text-white">Create Channel</h3>
                     <button onClick={onClose} className="text-gray-400 hover:text-black dark:hover:text-white"><X size={18}/></button>
                 </div>
                 <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                         <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Channel Name</label>
                         <div className="relative">
                             <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                             <input 
                                value={name}
                                onChange={e => setName(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-black dark:focus:border-white"
                                placeholder="e.g. marketing-updates"
                                autoFocus
                                required
                             />
                         </div>
                     </div>
                     <div>
                         <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Description</label>
                         <textarea 
                             value={description}
                             onChange={e => setDescription(e.target.value)}
                             className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black dark:focus:border-white resize-none h-20"
                             placeholder="What's this channel about?"
                         />
                     </div>
                     <div className="flex items-center gap-2">
                         <input 
                            type="checkbox" 
                            id="private-channel"
                            checked={isPrivate}
                            onChange={e => setIsPrivate(e.target.checked)}
                            className="rounded border-gray-300"
                         />
                         <label htmlFor="private-channel" className="text-sm text-black dark:text-white select-none">Make private</label>
                     </div>
                     <div className="pt-2 flex justify-end gap-2">
                         <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-medium text-gray-500 hover:text-black dark:hover:text-white transition-colors">Cancel</button>
                         <button type="submit" className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-xs font-medium hover:opacity-90">Create Channel</button>
                     </div>
                 </form>
             </div>
        </div>
    )
}

const ChannelInfoSidebar = ({ channel, isOpen, onClose }: { channel: ChatChannel | undefined, isOpen: boolean, onClose: () => void }) => {
    const [showAllMembers, setShowAllMembers] = useState(false);
    
    if (!isOpen || !channel) return null;

    // Mock extended members list
    const members = showAllMembers 
        ? ['Alex Doe', 'Maria Garcia', 'James Wilson', 'Sarah Connor', 'Michael Ross', 'Linda Kim', 'Robert Chen', 'David Kim'] 
        : ['Alex Doe', 'Maria Garcia', 'James Wilson'];

    return (
        <div className="w-80 border-l border-gray-100 dark:border-gray-800 bg-white dark:bg-[#18181b] flex flex-col h-full animate-in slide-in-from-right duration-300 absolute right-0 z-20 shadow-xl">
            <div className="h-16 px-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0">
                <span className="font-bold text-black dark:text-white">Channel Details</span>
                <button onClick={onClose} className="text-gray-400 hover:text-black dark:hover:text-white"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-2xl mx-auto flex items-center justify-center mb-4 text-3xl">
                        {channel.type === 'dm' ? (
                            <img src={channel.avatarUrl} className="w-full h-full rounded-2xl object-cover" />
                        ) : (
                            <Hash size={32} className="text-gray-400" />
                        )}
                    </div>
                    <h3 className="font-bold text-lg text-black dark:text-white">{channel.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{channel.type === 'dm' ? 'Direct Message' : 'Public Channel'}</p>
                </div>

                {channel.description && (
                     <div className="mb-8">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Topic</h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{channel.description}</p>
                     </div>
                )}

                <div className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Members</h4>
                        <span className="text-xs bg-gray-100 dark:bg-white/10 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300">{channel.members?.length || 24}</span>
                    </div>
                    <div className="space-y-3">
                        {members.map((name, i) => (
                             <div key={i} className="flex items-center gap-3">
                                 <img src={`https://picsum.photos/100/100?random=${20+i}`} className="w-8 h-8 rounded-full bg-gray-200" />
                                 <span className="text-sm text-black dark:text-white">{name} {name === 'Alex Doe' && '(You)'}</span>
                                 {i % 3 === 0 && <span className="w-2 h-2 bg-green-500 rounded-full ml-auto"></span>}
                             </div>
                        ))}
                        {!showAllMembers && (
                            <button 
                                onClick={() => setShowAllMembers(true)}
                                className="text-xs text-blue-600 hover:underline pt-1 w-full text-left"
                            >
                                View all members
                            </button>
                        )}
                    </div>
                </div>

                <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Shared Files</h4>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-700">
                             <div className="p-2 bg-blue-100 text-blue-600 rounded"><FileText size={16} /></div>
                             <div className="flex-1 min-w-0">
                                 <p className="text-xs font-medium text-black dark:text-white truncate">Q4_Report.pdf</p>
                                 <p className="text-[10px] text-gray-500">2.4 MB • Today</p>
                             </div>
                        </div>
                        <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-700">
                             <div className="p-2 bg-purple-100 text-purple-600 rounded"><ImageIcon size={16} /></div>
                             <div className="flex-1 min-w-0">
                                 <p className="text-xs font-medium text-black dark:text-white truncate">Design_v2.png</p>
                                 <p className="text-[10px] text-gray-500">4.1 MB • Yesterday</p>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ReactionBar = ({ onReact, onClose }: { onReact: (emoji: string) => void, onClose: () => void }) => (
    <div className="absolute -top-10 left-0 bg-white dark:bg-gray-800 shadow-lg rounded-full px-2 py-1 flex gap-1 border border-gray-200 dark:border-gray-700 animate-in fade-in slide-in-from-bottom-2 z-10">
        {['👍', '❤️', '😂', '😮', '🚀'].map(emoji => (
            <button 
                key={emoji}
                onClick={() => { onReact(emoji); onClose(); }}
                className="hover:scale-125 transition-transform p-1 text-lg"
            >
                {emoji}
            </button>
        ))}
    </div>
);

const MessageBubble = ({ msg, isMe, onReact, onDelete, showAvatar }: any) => {
    const [showReactions, setShowReactions] = useState(false);

    return (
        <div 
            className={`group relative flex gap-4 ${isMe ? 'flex-row-reverse' : ''} ${!showAvatar ? 'mt-1' : 'mt-4'}`}
            onMouseLeave={() => setShowReactions(false)}
        >
            {/* Avatar */}
            <div className="w-9 shrink-0 flex flex-col items-center">
                 {showAvatar && (
                     <img src={msg.senderAvatar} className="w-9 h-9 rounded-lg object-cover bg-gray-100 border border-gray-200 dark:border-gray-700" />
                 )}
            </div>

            <div className={`flex flex-col max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                {showAvatar && (
                    <div className={`flex items-baseline gap-2 mb-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                        <span className="text-xs font-bold text-black dark:text-white">{msg.senderName}</span>
                        <span className="text-[10px] text-gray-400">{msg.timestamp}</span>
                    </div>
                )}
                
                <div className="relative group/bubble">
                    {/* Hover Actions */}
                    <div 
                        className={`absolute top-0 ${isMe ? '-left-16' : '-right-16'} opacity-0 group-hover/bubble:opacity-100 transition-opacity flex items-center gap-1 bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-lg p-1`}
                    >
                        <button onClick={() => setShowReactions(!showReactions)} className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded text-gray-500"><Smile size={14}/></button>
                        <button className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded text-gray-500"><Reply size={14}/></button>
                        {isMe && <button onClick={() => onDelete(msg.id)} className="p-1 hover:bg-red-50 hover:text-red-500 rounded text-gray-500"><Trash2 size={14}/></button>}
                    </div>

                    {showReactions && <ReactionBar onReact={(emoji) => onReact(msg.id, emoji)} onClose={() => setShowReactions(false)} />}

                    <div 
                        className={`
                            px-4 py-2 text-sm shadow-sm relative
                            ${isMe 
                                ? 'bg-black dark:bg-white text-white dark:text-black rounded-2xl rounded-tr-sm' 
                                : 'bg-white dark:bg-white/5 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-2xl rounded-tl-sm'}
                        `}
                    >
                        {msg.content}
                        
                        {/* Attachments */}
                        {msg.attachments && msg.attachments.length > 0 && (
                            <div className="mt-2 space-y-1">
                                {msg.attachments.map((att: any) => (
                                    <div key={att.id} className={`flex items-center gap-2 p-2 rounded-lg ${isMe ? 'bg-white/10' : 'bg-black/5'} border border-transparent`}>
                                        <div className="p-1.5 bg-white/20 rounded"><FileText size={16} /></div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium truncate">{att.name}</p>
                                            <p className="text-[9px] opacity-70">{att.size}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {/* Reactions Display */}
                    {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                        <div className={`absolute -bottom-3 ${isMe ? 'right-0' : 'left-0'} flex gap-1`}>
                            {Object.entries(msg.reactions).map(([emoji, count]) => (
                                <span key={emoji} className="text-[10px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-1.5 py-0.5 shadow-sm flex items-center gap-1">
                                    {emoji} <span className="font-bold">{count as number}</span>
                                </span>
                            ))}
                        </div>
                    )}
                </div>
                
                {/* Status Indicator (Read/Delivered) */}
                {isMe && showAvatar && (
                    <div className="mt-1 flex items-center justify-end text-[10px] text-gray-400 gap-1">
                        <span className="text-green-500"><CheckCheck size={12} /></span>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Main Component ---

const TeamChat: React.FC = () => {
  // --- State ---
  const [channels, setChannels] = useState<ChatChannel[]>(MOCK_CHANNELS);
  const [activeChannelId, setActiveChannelId] = useState<string>('ch-1');
  
  // Store messages by channel ID
  const [messagesByChannel, setMessagesByChannel] = useState<Record<string, ChatMessage[]>>({
      'ch-1': MOCK_CHAT_MESSAGES.filter(m => m.channelId === 'ch-1'),
      'ch-2': MOCK_CHAT_MESSAGES.filter(m => m.channelId === 'ch-2'),
      'dm-1': MOCK_CHAT_MESSAGES.filter(m => m.channelId === 'dm-1'),
  });

  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [userStatus, setUserStatus] = useState<'online' | 'busy' | 'away'>('online');
  
  // UI Toggles
  const [isInfoSidebarOpen, setIsInfoSidebarOpen] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [activeCall, setActiveCall] = useState<{type: 'audio' | 'video', active: boolean}>({ type: 'audio', active: false });
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isCreateChannelModalOpen, setIsCreateChannelModalOpen] = useState(false);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Derived with filtering
  const filteredChannels = channels.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const activeChannel = channels.find(c => c.id === activeChannelId);
  const currentMessages = messagesByChannel[activeChannelId] || [];
  
  const publicChannels = filteredChannels.filter(c => c.type === 'public');
  const privateChannels = filteredChannels.filter(c => c.type === 'private');
  const directMessages = filteredChannels.filter(c => c.type === 'dm');

  // --- Effects ---

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages, activeChannelId]);

  // --- Handlers ---

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      channelId: activeChannelId,
      senderId: 'me',
      senderName: 'Alex Doe',
      senderAvatar: 'https://picsum.photos/100/100?random=20',
      content: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: 'Today',
      isMe: true
    };

    setMessagesByChannel(prev => ({
        ...prev,
        [activeChannelId]: [...(prev[activeChannelId] || []), newMessage]
    }));
    setInputText('');
    setIsEmojiPickerOpen(false);
    
    // Simulate Incoming Reply for DMs
    if (activeChannel?.type === 'dm') {
        setTimeout(() => {
            const replyMsg: ChatMessage = {
                id: `msg-${Date.now() + 1}`,
                channelId: activeChannelId,
                senderId: 'u-dm',
                senderName: activeChannel.name,
                senderAvatar: activeChannel.avatarUrl || '',
                content: 'Got it, thanks!',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                date: 'Today'
            };
            setMessagesByChannel(prev => ({
                ...prev,
                [activeChannelId]: [...(prev[activeChannelId] || []), replyMsg]
            }));
        }, 2000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSendMessage();
      }
  };

  const handleReaction = (msgId: string, emoji: string) => {
      setMessagesByChannel(prev => {
          const channelMsgs = (prev[activeChannelId] || []).map(msg => {
              if (msg.id === msgId) {
                  const currentCount = msg.reactions?.[emoji] || 0;
                  return {
                      ...msg,
                      reactions: { ...msg.reactions, [emoji]: currentCount + 1 }
                  };
              }
              return msg;
          });
          return { ...prev, [activeChannelId]: channelMsgs };
      });
  };

  const handleDeleteMessage = (msgId: string) => {
      if(confirm('Delete this message?')) {
        setMessagesByChannel(prev => ({
            ...prev,
            [activeChannelId]: prev[activeChannelId].filter(m => m.id !== msgId)
        }));
      }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const newMessage: ChatMessage = {
              id: `msg-${Date.now()}`,
              channelId: activeChannelId,
              senderId: 'me',
              senderName: 'Alex Doe',
              senderAvatar: 'https://picsum.photos/100/100?random=20',
              content: `Uploaded file: ${file.name}`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              date: 'Today',
              isMe: true,
              attachments: [{ id: `att-${Date.now()}`, name: file.name, type: 'file', size: '1.2 MB' }]
          };
          setMessagesByChannel(prev => ({
            ...prev,
            [activeChannelId]: [...(prev[activeChannelId] || []), newMessage]
        }));
      }
  };

  const handleChannelClick = (id: string) => {
    setActiveChannelId(id);
    // Mark as read
    setChannels(prev => prev.map(c => c.id === id ? { ...c, unreadCount: 0 } : c));
    setIsInfoSidebarOpen(false); 
    // On mobile, you might want to close sidebar here
  };

  const handleCreateChannel = (data: any) => {
      const newChannel: ChatChannel = {
          id: `ch-${Date.now()}`,
          name: data.name,
          type: data.type,
          description: data.description,
          unreadCount: 0,
          members: ['me']
      };
      setChannels(prev => [...prev, newChannel]);
      setActiveChannelId(newChannel.id);
  };

  const toggleUserStatus = () => {
      const statuses: ('online' | 'busy' | 'away')[] = ['online', 'busy', 'away'];
      const currentIndex = statuses.indexOf(userStatus);
      setUserStatus(statuses[(currentIndex + 1) % statuses.length]);
  };

  return (
    <div className="h-full flex bg-white dark:bg-[#18181b] overflow-hidden fade-in relative">
      
      {/* --- Call Overlay --- */}
      <CallOverlay 
        isActive={activeCall.active} 
        type={activeCall.type} 
        onEnd={() => setActiveCall({ ...activeCall, active: false })}
        isMuted={isMuted}
        toggleMute={() => setIsMuted(!isMuted)}
        isVideoOff={isVideoOff}
        toggleVideo={() => setIsVideoOff(!isVideoOff)}
      />

      {/* --- Create Channel Modal --- */}
      <CreateChannelModal 
        isOpen={isCreateChannelModalOpen} 
        onClose={() => setIsCreateChannelModalOpen(false)} 
        onSave={handleCreateChannel}
      />

      {/* --- Sidebar (Channels) --- */}
      <div className="w-64 flex flex-col border-r border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-black/20 shrink-0">
        
        {/* Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 shrink-0">
          <h2 className="font-bold text-black dark:text-white truncate">GlassFlow Team</h2>
          <button 
            onClick={() => setIsCreateChannelModalOpen(true)}
            className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400"
            title="New Channel"
          >
            <Edit size={16} /> 
          </button>
        </div>

        {/* User Status Bar */}
        <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors" onClick={toggleUserStatus}>
            <div className="relative">
                <img src="https://picsum.photos/100/100?random=20" className="w-8 h-8 rounded-lg" />
                <span className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-black ${userStatus === 'online' ? 'bg-green-500' : userStatus === 'busy' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
            </div>
            <div>
                <p className="text-xs font-bold text-black dark:text-white">Alex Doe</p>
                <p className="text-[10px] text-gray-500 capitalize">{userStatus}</p>
            </div>
        </div>

        {/* Search */}
        <div className="p-3">
            <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Jump to..." 
                    className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-black dark:text-white placeholder-gray-400 focus:outline-none focus:border-black/20 dark:focus:border-white/20"
                />
            </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-2 space-y-6 pb-4">
            
            {/* Public Channels */}
            <div>
                <div className="flex items-center justify-between px-2 mb-1 group">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors cursor-pointer flex items-center gap-1">
                        <ChevronDown size={10} /> Channels
                    </span>
                    <button 
                        onClick={() => setIsCreateChannelModalOpen(true)}
                        className="text-gray-400 hover:text-black dark:hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <Plus size={12} />
                    </button>
                </div>
                <div className="space-y-0.5">
                    {publicChannels.map(channel => (
                        <button
                            key={channel.id}
                            onClick={() => handleChannelClick(channel.id)}
                            className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm transition-colors ${activeChannelId === channel.id ? 'bg-black/5 dark:bg-white/10 text-black dark:text-white font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}
                        >
                            <div className="flex items-center gap-2 truncate">
                                <Hash size={14} className="text-gray-400 shrink-0" />
                                <span className="truncate">{channel.name}</span>
                            </div>
                            {channel.unreadCount ? (
                                <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 rounded-full min-w-[16px] h-4 flex items-center justify-center">
                                    {channel.unreadCount}
                                </span>
                            ) : null}
                        </button>
                    ))}
                    {privateChannels.map(channel => (
                        <button
                            key={channel.id}
                            onClick={() => handleChannelClick(channel.id)}
                            className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm transition-colors ${activeChannelId === channel.id ? 'bg-black/5 dark:bg-white/10 text-black dark:text-white font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}
                        >
                            <div className="flex items-center gap-2 truncate">
                                <Lock size={12} className="text-gray-400 shrink-0" />
                                <span className="truncate">{channel.name}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Direct Messages */}
            <div>
                <div className="flex items-center justify-between px-2 mb-1 group">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors cursor-pointer flex items-center gap-1">
                        <ChevronDown size={10} /> Direct Messages
                    </span>
                    <button className="text-gray-400 hover:text-black dark:hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <Plus size={12} />
                    </button>
                </div>
                <div className="space-y-0.5">
                    {directMessages.map(dm => (
                        <button
                            key={dm.id}
                            onClick={() => handleChannelClick(dm.id)}
                            className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm transition-colors ${activeChannelId === dm.id ? 'bg-black/5 dark:bg-white/10 text-black dark:text-white font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}
                        >
                            <div className="flex items-center gap-2 truncate">
                                <div className="relative shrink-0">
                                    <img src={dm.avatarUrl} className="w-5 h-5 rounded-full bg-gray-200" />
                                    <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white dark:border-gray-900 ${dm.status === 'online' ? 'bg-green-500' : dm.status === 'busy' ? 'bg-red-500' : 'bg-gray-400'}`}></span>
                                </div>
                                <span className="truncate">{dm.name}</span>
                            </div>
                            {dm.unreadCount ? (
                                <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 rounded-full min-w-[16px] h-4 flex items-center justify-center">
                                    {dm.unreadCount}
                                </span>
                            ) : null}
                        </button>
                    ))}
                </div>
            </div>

        </div>
      </div>

      {/* --- Main Chat Area --- */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#18181b] relative">
        
        {/* Chat Header */}
        <div className="h-16 px-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0">
             <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 px-2 py-1 rounded transition-colors" onClick={() => setIsInfoSidebarOpen(!isInfoSidebarOpen)}>
                 {activeChannel?.type === 'public' && <Hash size={20} className="text-gray-400" />}
                 {activeChannel?.type === 'private' && <Lock size={20} className="text-gray-400" />}
                 {activeChannel?.type === 'dm' && <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>}
                 
                 <div>
                     <h3 className="font-bold text-black dark:text-white">{activeChannel?.name || 'Select a channel'}</h3>
                     {activeChannel?.type !== 'dm' ? (
                         <p className="text-xs text-gray-500">24 members • 3 online</p>
                     ) : (
                         <p className="text-xs text-gray-500">Local time: 10:42 AM</p>
                     )}
                 </div>
             </div>

             <div className="flex items-center gap-4 text-gray-400">
                 <button onClick={() => setActiveCall({ type: 'audio', active: true })} className="hover:text-black dark:hover:text-white transition-colors p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full"><Phone size={18} /></button>
                 <button onClick={() => setActiveCall({ type: 'video', active: true })} className="hover:text-black dark:hover:text-white transition-colors p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full"><Video size={18} /></button>
                 <div className="w-px h-6 bg-gray-100 dark:bg-gray-800"></div>
                 <button onClick={() => setIsInfoSidebarOpen(!isInfoSidebarOpen)} className={`hover:text-black dark:hover:text-white transition-colors p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full ${isInfoSidebarOpen ? 'bg-gray-100 dark:bg-white/10 text-black dark:text-white' : ''}`}><Info size={18} /></button>
             </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
            {currentMessages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 pb-20">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                        <MessageSquare size={32} className="opacity-20" />
                    </div>
                    <p className="text-sm font-medium">No messages yet.</p>
                    <p className="text-xs">Start the conversation in {activeChannel?.name}.</p>
                </div>
            )}
            
            {currentMessages.map((msg, index) => {
                const isSequence = index > 0 && currentMessages[index - 1].senderId === msg.senderId && msg.timestamp === currentMessages[index - 1].timestamp;
                return (
                    <MessageBubble 
                        key={msg.id} 
                        msg={msg} 
                        isMe={msg.isMe} 
                        onReact={handleReaction} 
                        onDelete={handleDeleteMessage}
                        showAvatar={!isSequence}
                    />
                );
            })}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 pt-2">
            <div className="relative bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus-within:ring-1 focus-within:ring-black dark:focus-within:ring-white/50 transition-all">
                <form onSubmit={handleSendMessage}>
                    <input 
                        type="text" 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={`Message ${activeChannel?.type === 'dm' ? activeChannel.name : '#' + activeChannel?.name}`}
                        className="w-full bg-transparent p-4 pr-32 text-sm text-black dark:text-white placeholder-gray-400 focus:outline-none"
                    />
                    
                    {isEmojiPickerOpen && (
                        <div className="absolute bottom-12 right-2 bg-white dark:bg-gray-800 shadow-xl rounded-lg border border-gray-200 dark:border-gray-700 p-2 grid grid-cols-4 gap-2 animate-in fade-in zoom-in-95">
                            {['😀','😂','😍','🤔','👍','👎','🔥','🎉'].map(emoji => (
                                <button 
                                    key={emoji} 
                                    type="button" 
                                    onClick={() => { setInputText(prev => prev + emoji); setIsEmojiPickerOpen(false); }}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded text-xl"
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="absolute right-2 bottom-2 flex items-center gap-2">
                        <button 
                            type="button" 
                            onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                            className="p-2 text-gray-400 hover:text-black dark:hover:text-white transition-colors rounded hover:bg-gray-100 dark:hover:bg-white/10"
                        >
                            <Smile size={18} />
                        </button>
                        <button 
                            type="button" 
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2 text-gray-400 hover:text-black dark:hover:text-white transition-colors rounded hover:bg-gray-100 dark:hover:bg-white/10"
                        >
                            <Paperclip size={18} />
                        </button>
                        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                        <button 
                            type="submit"
                            disabled={!inputText.trim()}
                            className="p-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </form>
            </div>
            <div className="text-center mt-2 flex justify-between px-2">
                <p className="text-[10px] text-gray-400">
                    <strong>Tip:</strong> Press Enter to send.
                </p>
                {activeChannelId === 'ch-2' && <p className="text-[10px] text-gray-400 italic">Only admins can post here.</p>}
            </div>
        </div>

      </div>

      {/* Info Sidebar */}
      <ChannelInfoSidebar 
        channel={activeChannel} 
        isOpen={isInfoSidebarOpen} 
        onClose={() => setIsInfoSidebarOpen(false)} 
      />

    </div>
  );
};

export default TeamChat;
