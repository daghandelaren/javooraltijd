"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Music,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Upload,
  Lock,
  Sparkles,
  Heart,
  Music2,
  Music3,
  Music4,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBuilderStore, type PlanId } from "@/stores/builder-store";
import { cn } from "@/lib/utils";

// Curated music library with romantic tracks
const MUSIC_LIBRARY = [
  {
    id: "romantic-piano",
    title: "Romantische Piano",
    artist: "Wedding Melodies",
    duration: "3:24",
    mood: "romantic",
    icon: Heart,
  },
  {
    id: "string-quartet",
    title: "Strijkkwartet Liefde",
    artist: "Classical Hearts",
    duration: "4:12",
    mood: "elegant",
    icon: Music2,
  },
  {
    id: "acoustic-guitar",
    title: "Zonsondergang Serenade",
    artist: "Acoustic Dreams",
    duration: "3:45",
    mood: "warm",
    icon: Music3,
  },
  {
    id: "orchestral-waltz",
    title: "Eerste Dans Wals",
    artist: "Symphony of Love",
    duration: "4:30",
    mood: "majestic",
    icon: Music4,
  },
  {
    id: "gentle-harp",
    title: "Hemelse Harp",
    artist: "Ethereal Sounds",
    duration: "3:58",
    mood: "dreamy",
    icon: Sparkles,
  },
];

function VinylRecord({
  isPlaying,
  color = "#434E3A",
}: {
  isPlaying: boolean;
  color?: string;
}) {
  return (
    <div className="relative w-24 h-24 flex-shrink-0">
      {/* Record shadow */}
      <div className="absolute inset-0 rounded-full bg-black/20 blur-md translate-y-1" />

      {/* Vinyl record */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 shadow-lg"
        animate={{ rotate: isPlaying ? 360 : 0 }}
        transition={{
          duration: 3,
          repeat: isPlaying ? Infinity : 0,
          ease: "linear",
        }}
      >
        {/* Grooves */}
        <div className="absolute inset-2 rounded-full border border-stone-700/50" />
        <div className="absolute inset-4 rounded-full border border-stone-700/30" />
        <div className="absolute inset-6 rounded-full border border-stone-700/50" />
        <div className="absolute inset-8 rounded-full border border-stone-700/30" />

        {/* Center label */}
        <div
          className="absolute inset-[30%] rounded-full flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
          }}
        >
          <div className="w-2 h-2 rounded-full bg-stone-900" />
        </div>

        {/* Shine effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-transparent" />
      </motion.div>
    </div>
  );
}

function TrackCard({
  track,
  isSelected,
  isPlaying,
  onSelect,
  onTogglePlay,
}: {
  track: (typeof MUSIC_LIBRARY)[0];
  isSelected: boolean;
  isPlaying: boolean;
  onSelect: () => void;
  onTogglePlay: () => void;
}) {
  const Icon = track.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "group relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
        isSelected
          ? "border-olive-400 bg-gradient-to-r from-olive-50 to-champagne-50 shadow-md"
          : "border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm"
      )}
      onClick={onSelect}
    >
      {/* Play button overlay */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onTogglePlay();
        }}
        className={cn(
          "relative w-12 h-12 rounded-full flex items-center justify-center transition-all",
          isSelected
            ? "bg-olive-600 text-white shadow-lg"
            : "bg-stone-100 text-stone-500 group-hover:bg-stone-200"
        )}
      >
        {isPlaying && isSelected ? (
          <Pause className="w-5 h-5" />
        ) : (
          <Play className="w-5 h-5 ml-0.5" />
        )}

        {/* Pulse animation when playing */}
        {isPlaying && isSelected && (
          <motion.div
            className="absolute inset-0 rounded-full bg-olive-400"
            animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </button>

      {/* Track info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Icon
            className={cn(
              "w-4 h-4 flex-shrink-0",
              isSelected ? "text-olive-600" : "text-stone-400"
            )}
          />
          <span
            className={cn(
              "font-medium truncate",
              isSelected ? "text-olive-900" : "text-stone-800"
            )}
          >
            {track.title}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-sm text-stone-500 truncate">{track.artist}</span>
          <span className="text-xs text-stone-400">•</span>
          <span className="text-xs text-stone-400">{track.duration}</span>
        </div>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-6 h-6 rounded-full bg-olive-600 flex items-center justify-center"
        >
          <Music className="w-3 h-3 text-white" />
        </motion.div>
      )}
    </motion.div>
  );
}

export function MusicSelector() {
  const { selectedPlan, musicConfig, setMusicConfig, styling } = useBuilderStore();
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);

  // Check if user has access (Signature or Premium)
  const hasAccess = selectedPlan === "signature" || selectedPlan === "premium";

  const handleTrackSelect = (trackId: string) => {
    setMusicConfig({
      enabled: true,
      source: "library",
      trackId,
    });
  };

  const handleTogglePlay = (trackId: string) => {
    if (playingTrack === trackId) {
      setPlayingTrack(null);
    } else {
      setPlayingTrack(trackId);
    }
  };

  const selectedTrack = MUSIC_LIBRARY.find((t) => t.id === musicConfig.trackId);

  if (!hasAccess) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-xl border-2 border-dashed border-stone-300 bg-gradient-to-br from-stone-50 to-champagne-50/50"
      >
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-4 left-4 w-16 h-16 border-2 border-stone-400 rounded-full" />
          <div className="absolute bottom-4 right-4 w-24 h-24 border-2 border-stone-400 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-stone-400 rounded-full" />
        </div>

        <div className="relative p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-stone-200 mb-4">
            <Lock className="w-7 h-7 text-stone-500" />
          </div>

          <h3 className="font-heading text-xl font-semibold text-stone-700 mb-2">
            Achtergrondmuziek
          </h3>
          <p className="text-stone-500 mb-4 max-w-sm mx-auto">
            Voeg sfeervolle muziek toe aan jullie uitnodiging.
            Beschikbaar vanaf het Signature pakket.
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-olive-100 text-olive-700 text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Upgrade naar Signature
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-stone-200"
    >
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="font-heading text-xl font-semibold text-stone-900 flex items-center gap-2">
            <Music className="w-5 h-5 text-olive-600" />
            Achtergrondmuziek
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Kies sfeervolle muziek voor jullie uitnodiging
          </p>
        </div>

        {/* Enable toggle */}
        <button
          onClick={() => setMusicConfig({ enabled: !musicConfig.enabled })}
          className={cn(
            "w-12 h-7 rounded-full relative transition-colors",
            musicConfig.enabled ? "bg-olive-600" : "bg-stone-300"
          )}
        >
          <div
            className={cn(
              "absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform",
              musicConfig.enabled ? "translate-x-6" : "translate-x-1"
            )}
          />
        </button>
      </div>

      <AnimatePresence>
        {musicConfig.enabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-6"
          >
            {/* Currently selected - Vinyl player visualization */}
            {selectedTrack && (
              <div className="flex items-center gap-6 p-5 rounded-xl bg-gradient-to-r from-stone-900 to-stone-800">
                <VinylRecord
                  isPlaying={playingTrack === selectedTrack.id}
                  color={styling.sealColor}
                />

                <div className="flex-1 min-w-0">
                  <p className="text-xs text-stone-400 uppercase tracking-wider mb-1">
                    Nu geselecteerd
                  </p>
                  <h4 className="font-heading text-lg text-white truncate">
                    {selectedTrack.title}
                  </h4>
                  <p className="text-sm text-stone-400">{selectedTrack.artist}</p>

                  {/* Audio wave visualization */}
                  <div className="flex items-end gap-0.5 mt-3 h-6">
                    {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-olive-400 rounded-full"
                        animate={{
                          height: playingTrack === selectedTrack.id
                            ? [4, Math.random() * 20 + 4, 4]
                            : 4,
                        }}
                        transition={{
                          duration: 0.5,
                          repeat: playingTrack === selectedTrack.id ? Infinity : 0,
                          delay: i * 0.05,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Music library */}
            <div className="space-y-3">
              <Label className="text-sm text-stone-600">Kies een nummer</Label>
              <div className="grid gap-3">
                {MUSIC_LIBRARY.map((track, index) => (
                  <motion.div
                    key={track.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <TrackCard
                      track={track}
                      isSelected={musicConfig.trackId === track.id}
                      isPlaying={playingTrack === track.id}
                      onSelect={() => handleTrackSelect(track.id)}
                      onTogglePlay={() => handleTogglePlay(track.id)}
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Volume & Autoplay controls */}
            <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg bg-stone-50">
              {/* Volume slider */}
              <div className="flex-1 space-y-2">
                <Label className="text-sm text-stone-600 flex items-center gap-2">
                  {musicConfig.volume === 0 ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                  Volume: {musicConfig.volume}%
                </Label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={musicConfig.volume}
                  onChange={(e) =>
                    setMusicConfig({ volume: parseInt(e.target.value) })
                  }
                  className="w-full h-2 rounded-full appearance-none cursor-pointer bg-stone-200 accent-olive-600"
                />
              </div>

              {/* Autoplay toggle */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMusicConfig({ autoPlay: !musicConfig.autoPlay })}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all",
                    musicConfig.autoPlay
                      ? "border-olive-400 bg-olive-50 text-olive-700"
                      : "border-stone-200 bg-white text-stone-600 hover:border-stone-300"
                  )}
                >
                  <Play className="w-4 h-4" />
                  <span className="text-sm font-medium">Autoplay</span>
                </button>
              </div>
            </div>

            {/* Upload option (Premium only) */}
            {selectedPlan === "premium" && (
              <div className="pt-4 border-t border-stone-200">
                <Label className="text-sm text-stone-600 mb-3 block">
                  Of upload eigen muziek
                </Label>
                <label className="flex items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed border-stone-300 cursor-pointer hover:border-olive-400 hover:bg-olive-50/30 transition-all group">
                  <Upload className="w-6 h-6 text-stone-400 group-hover:text-olive-500 transition-colors" />
                  <span className="text-stone-600 group-hover:text-olive-700 transition-colors">
                    Klik om MP3 te uploaden
                  </span>
                  <input type="file" accept=".mp3,audio/*" className="hidden" />
                </label>
                <p className="text-xs text-stone-400 mt-2 text-center">
                  Max 10MB • MP3 formaat • Zorg voor rechten
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
