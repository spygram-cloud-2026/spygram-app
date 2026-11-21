import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { generateInterceptedChats } from '../utils/fakeChatGenerator';
import AudioPlayer from '../components/AudioPlayer';
import SensitiveMedia from '../components/SensitiveMedia';
import { 
  ArrowLeft, 
  Phone, 
  Video, 
  Info, 
  Camera, 
  Mic, 
  Image as ImageIcon, 
  Heart, 
  Send,
  Lock
} from 'lucide-react';
import VipLockModal from '../components/VipLockModal';

export default function ChatDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { targetUser, visitorLocation, isPaid } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [inputText, setInputText] = useState('');

  const chats = generateInterceptedChats(targetUser, visitorLocation?.city || 'sua cidade');
  const activeChat = chats.find(c => c.id === id) || chats[0];

  const [messages, setMessages] = useState(activeChat.messages);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      id: 'm-' + Date.now(),
      sender: 'me',
      type: 'text',
      content: inputText,
      time: 'Agora'
    };

    setMessages([...messages, newMsg]);
    setInputText('');

    // Simulate auto response after 1.5s
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: 'm-resp-' + Date.now(),
          sender: 'them',
          type: 'text',
          content: 'Depois te mando mais detalhes por aqui, não comenta nada com ninguém tá?',
          time: 'Agora'
        }
      ]);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between">
      <div className="mobile-frame flex flex-col flex-1 pb-20">
        {/* Chat Top Header */}
        <div className="sticky top-12 z-30 bg-black/90 backdrop-blur-md border-b border-[#262626] px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/messages')}
              className="text-white hover:text-[#a8a8a8]"
            >
              <ArrowLeft size={22} />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="relative">
                <img
                  src={activeChat.avatar}
                  alt={activeChat.name}
                  className="w-9 h-9 rounded-full object-cover border border-[#363636]"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#10b981] rounded-full border border-black" />
              </div>

              <div>
                <h3 className="text-xs font-bold text-white leading-tight">
                  {activeChat.name}
                </h3>
                <span className="text-[10px] text-[#10b981] block leading-none">
                  Online agora
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-white">
            <button onClick={() => setShowModal(true)} className="hover:text-[#a8a8a8]">
              <Phone size={20} />
            </button>
            <button onClick={() => setShowModal(true)} className="hover:text-[#a8a8a8]">
              <Video size={22} />
            </button>
            <button onClick={() => setShowModal(true)} className="hover:text-[#a8a8a8]">
              <Info size={20} />
            </button>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 p-4 space-y-3.5 overflow-y-auto">
          {messages.map((msg) => {
            const isMe = msg.sender === 'me';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                {/* Text message */}
                {msg.type === 'text' && (
                  <div
                    className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                      isMe
                        ? 'bg-gradient-to-r from-[#0095f6] to-[#3797f0] text-white rounded-br-xs shadow-sm'
                        : 'bg-[#262626] text-[#f5f5f5] rounded-bl-xs border border-[#363636]'
                    }`}
                  >
                    {msg.content}
                  </div>
                )}

                {/* Audio message */}
                {msg.type === 'audio' && (
                  <div className="my-1">
                    <AudioPlayer duration={msg.duration || 18} />
                  </div>
                )}

                {/* Sensitive image message */}
                {msg.type === 'sensitive_image' && (
                  <div className="my-1">
                    <SensitiveMedia
                      imageUrl={msg.imageUrl}
                      caption={msg.caption}
                    />
                  </div>
                )}

                {/* Message timestamp */}
                <span className="text-[9px] text-[#737373] mt-1 px-1 font-mono">
                  {msg.time}
                </span>
              </div>
            );
          })}
        </div>

        {/* Input Bar */}
        <div className="fixed bottom-0 max-w-[480px] w-full bg-[#121212]/95 backdrop-blur-md border-t border-[#262626] p-3 z-40">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <button 
              type="button" 
              onClick={() => setShowModal(true)}
              className="w-8 h-8 rounded-full bg-[#0095f6] text-white flex items-center justify-center flex-shrink-0"
            >
              <Camera size={16} />
            </button>

            <div className="flex-1 relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enviar mensagem..."
                className="w-full pl-3.5 pr-9 py-2 bg-[#181818] border border-[#262626] rounded-full text-xs text-white placeholder-[#737373] focus:outline-none focus:border-[#363636]"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#0095f6] disabled:text-[#737373] transition-colors"
              >
                <Send size={15} />
              </button>
            </div>

            <button 
              type="button"
              onClick={() => setShowModal(true)}
              className="text-white hover:text-[#a8a8a8]"
            >
              <Mic size={20} />
            </button>

            <button 
              type="button"
              onClick={() => setShowModal(true)}
              className="text-white hover:text-[#a8a8a8]"
            >
              <ImageIcon size={20} />
            </button>

            <button 
              type="button"
              onClick={() => setShowModal(true)}
              className="text-white hover:text-[#ed4956]"
            >
              <Heart size={20} />
            </button>
          </form>
        </div>
      </div>

      <VipLockModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Recursos Adicionais Protegidos"
      />
    </div>
  );
}
