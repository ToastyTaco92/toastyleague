"use client";

interface TwitchEmbedProps {
  channel: string;
  className?: string;
}

export function TwitchEmbed({ channel, className = "" }: TwitchEmbedProps) {
  return (
    <div className={`aspect-video bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg overflow-hidden relative ${className}`}>
      <iframe
        src={`https://player.twitch.tv/?channel=${channel}&parent=www.toastytacogaming.com&parent=toastytacogaming.com&muted=true&autoplay=false`}
        height="100%"
        width="100%"
        allowFullScreen
        className="w-full h-full"
        title={`${channel} Twitch Stream`}
        loading="lazy"
      />
      
      {/* Fallback message - Twitch will show "Channel is offline" when not streaming */}
      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
        Live from Twitch
      </div>
    </div>
  );
}
