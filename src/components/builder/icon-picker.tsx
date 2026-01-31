"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Sparkles,
  Heart,
  // Wedding & Love
  HeartHandshake,
  Gem,
  Crown,
  Ribbon,
  // Food & Drink
  Wine,
  Utensils,
  Coffee,
  Cake,
  CakeSlice,
  Beer,
  Champagne,
  GlassWater,
  Soup,
  // Activities
  Music,
  Music2,
  Mic2,
  Camera,
  PartyPopper,
  Gamepad2,
  Dices,
  // Time & Location
  Clock,
  Clock3,
  Clock6,
  Clock9,
  MapPin,
  Navigation,
  Car,
  Plane,
  Bus,
  // Objects
  Gift,
  Flower2,
  Sun,
  Moon,
  Star,
  Sunset,
  Sunrise,
  CloudSun,
  // People
  Users,
  Baby,
  UserCheck,
  UsersRound,
  // Buildings
  Church,
  Home,
  Building2,
  Tent,
  TreePine,
  Hotel,
  Castle,
  // Communication
  MessageCircle,
  Mail,
  Phone,
  Send,
  // Misc
  Bookmark,
  Flag,
  Award,
  Trophy,
  Zap,
  Flame,
  type LucideIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Lucide icons organized by category
const ICON_CATEGORIES = [
  {
    name: "Bruiloft & Liefde",
    color: "rose",
    icons: [
      { id: "heart", icon: Heart, label: "Hart" },
      { id: "heart-handshake", icon: HeartHandshake, label: "Verbintenis" },
      { id: "gem", icon: Gem, label: "Ring" },
      { id: "crown", icon: Crown, label: "Kroon" },
      { id: "sparkles", icon: Sparkles, label: "Magie" },
      { id: "ribbon", icon: Ribbon, label: "Lint" },
      { id: "gift", icon: Gift, label: "Cadeau" },
      { id: "award", icon: Award, label: "Prijs" },
    ],
  },
  {
    name: "Eten & Drinken",
    color: "amber",
    icons: [
      { id: "wine", icon: Wine, label: "Wijn" },
      { id: "champagne", icon: Champagne, label: "Champagne" },
      { id: "beer", icon: Beer, label: "Bier" },
      { id: "coffee", icon: Coffee, label: "Koffie" },
      { id: "glass-water", icon: GlassWater, label: "Water" },
      { id: "utensils", icon: Utensils, label: "Diner" },
      { id: "soup", icon: Soup, label: "Soep" },
      { id: "cake", icon: Cake, label: "Taart" },
      { id: "cake-slice", icon: CakeSlice, label: "Taartpunt" },
    ],
  },
  {
    name: "Muziek & Entertainment",
    color: "violet",
    icons: [
      { id: "music", icon: Music, label: "Muziek" },
      { id: "music-2", icon: Music2, label: "Noten" },
      { id: "mic-2", icon: Mic2, label: "Microfoon" },
      { id: "camera", icon: Camera, label: "Foto" },
      { id: "party-popper", icon: PartyPopper, label: "Feest" },
      { id: "gamepad", icon: Gamepad2, label: "Spel" },
      { id: "dices", icon: Dices, label: "Dobbelstenen" },
    ],
  },
  {
    name: "Locaties",
    color: "emerald",
    icons: [
      { id: "church", icon: Church, label: "Kerk" },
      { id: "castle", icon: Castle, label: "Kasteel" },
      { id: "home", icon: Home, label: "Huis" },
      { id: "building", icon: Building2, label: "Gebouw" },
      { id: "hotel", icon: Hotel, label: "Hotel" },
      { id: "tent", icon: Tent, label: "Tent" },
      { id: "tree", icon: TreePine, label: "Buiten" },
      { id: "map-pin", icon: MapPin, label: "Locatie" },
      { id: "navigation", icon: Navigation, label: "Navigatie" },
    ],
  },
  {
    name: "Vervoer",
    color: "sky",
    icons: [
      { id: "car", icon: Car, label: "Auto" },
      { id: "bus", icon: Bus, label: "Bus" },
      { id: "plane", icon: Plane, label: "Vliegtuig" },
    ],
  },
  {
    name: "Tijd & Sfeer",
    color: "orange",
    icons: [
      { id: "clock", icon: Clock, label: "Klok" },
      { id: "clock-3", icon: Clock3, label: "15:00" },
      { id: "clock-6", icon: Clock6, label: "18:00" },
      { id: "clock-9", icon: Clock9, label: "21:00" },
      { id: "sunrise", icon: Sunrise, label: "Ochtend" },
      { id: "sun", icon: Sun, label: "Middag" },
      { id: "sunset", icon: Sunset, label: "Avond" },
      { id: "moon", icon: Moon, label: "Nacht" },
      { id: "cloud-sun", icon: CloudSun, label: "Weer" },
    ],
  },
  {
    name: "Mensen",
    color: "blue",
    icons: [
      { id: "users", icon: Users, label: "Gasten" },
      { id: "users-round", icon: UsersRound, label: "Groep" },
      { id: "user-check", icon: UserCheck, label: "Aanwezig" },
      { id: "baby", icon: Baby, label: "Kinderen" },
    ],
  },
  {
    name: "Natuur & Decoratie",
    color: "pink",
    icons: [
      { id: "flower", icon: Flower2, label: "Bloem" },
      { id: "star", icon: Star, label: "Ster" },
      { id: "flame", icon: Flame, label: "Vlam" },
      { id: "zap", icon: Zap, label: "Energie" },
    ],
  },
  {
    name: "Overig",
    color: "stone",
    icons: [
      { id: "message", icon: MessageCircle, label: "Bericht" },
      { id: "mail", icon: Mail, label: "Mail" },
      { id: "phone", icon: Phone, label: "Telefoon" },
      { id: "send", icon: Send, label: "Versturen" },
      { id: "bookmark", icon: Bookmark, label: "Bookmark" },
      { id: "flag", icon: Flag, label: "Vlag" },
      { id: "trophy", icon: Trophy, label: "Trofee" },
    ],
  },
];

// Flatten all icons for search
const ALL_ICONS = ICON_CATEGORIES.flatMap((cat) =>
  cat.icons.map((icon) => ({ ...icon, category: cat.name, color: cat.color }))
);

interface IconPickerProps {
  value: string;
  onChange: (iconId: string) => void;
  onClose: () => void;
}

export function IconPicker({ value, onChange, onClose }: IconPickerProps) {
  const [search, setSearch] = useState("");

  // Filter icons based on search
  const filteredCategories = useMemo(() => {
    if (!search) return ICON_CATEGORIES;
    const searchLower = search.toLowerCase();
    return ICON_CATEGORIES.map((cat) => ({
      ...cat,
      icons: cat.icons.filter(
        (icon) =>
          icon.label.toLowerCase().includes(searchLower) ||
          icon.id.toLowerCase().includes(searchLower)
      ),
    })).filter((cat) => cat.icons.length > 0);
  }, [search]);

  const getColorClasses = (color: string, isSelected: boolean) => {
    if (isSelected) {
      return "bg-burgundy-100 ring-2 ring-burgundy-500 text-burgundy-700";
    }
    const colorMap: Record<string, string> = {
      rose: "hover:bg-rose-50 hover:text-rose-600",
      amber: "hover:bg-amber-50 hover:text-amber-600",
      violet: "hover:bg-violet-50 hover:text-violet-600",
      emerald: "hover:bg-emerald-50 hover:text-emerald-600",
      sky: "hover:bg-sky-50 hover:text-sky-600",
      orange: "hover:bg-orange-50 hover:text-orange-600",
      blue: "hover:bg-blue-50 hover:text-blue-600",
      pink: "hover:bg-pink-50 hover:text-pink-600",
      stone: "hover:bg-stone-100 hover:text-stone-600",
    };
    return colorMap[color] || "hover:bg-stone-100";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      className="absolute z-50 top-full left-0 mt-2 bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden w-80"
      style={{ maxHeight: "440px" }}
    >
      {/* Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-stone-100 p-3 z-10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading font-semibold text-stone-800">Kies een icoon</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Zoek icoon..."
            className="pl-9 pr-9 h-10 bg-stone-50 border-stone-200 rounded-xl"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="overflow-y-auto p-3 space-y-5" style={{ maxHeight: "340px" }}>
        {filteredCategories.length === 0 ? (
          <div className="text-center py-8">
            <Search className="w-10 h-10 mx-auto text-stone-300 mb-3" />
            <p className="text-stone-500">Geen iconen gevonden</p>
          </div>
        ) : (
          filteredCategories.map((category) => (
            <div key={category.name}>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2 px-1">
                {category.name}
              </p>
              <div className="grid grid-cols-4 gap-1.5">
                {category.icons.map(({ id, icon: Icon, label }) => {
                  const isSelected = value === id;
                  return (
                    <motion.button
                      key={id}
                      onClick={() => onChange(id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        "flex flex-col items-center gap-1 p-2.5 rounded-xl transition-all text-stone-600",
                        getColorClasses(category.color, isSelected)
                      )}
                      title={label}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-[10px] font-medium truncate max-w-full leading-tight">
                        {label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}

// Lucide icon map for rendering saved icons
export const ICON_MAP: Record<string, LucideIcon> = {
  // Wedding & Love
  "heart": Heart,
  "heart-handshake": HeartHandshake,
  "gem": Gem,
  "crown": Crown,
  "sparkles": Sparkles,
  "ribbon": Ribbon,
  "gift": Gift,
  "award": Award,
  // Food & Drink
  "wine": Wine,
  "champagne": Champagne,
  "beer": Beer,
  "coffee": Coffee,
  "glass-water": GlassWater,
  "utensils": Utensils,
  "soup": Soup,
  "cake": Cake,
  "cake-slice": CakeSlice,
  // Music & Entertainment
  "music": Music,
  "music-2": Music2,
  "mic-2": Mic2,
  "camera": Camera,
  "party-popper": PartyPopper,
  "gamepad": Gamepad2,
  "dices": Dices,
  // Locations
  "church": Church,
  "castle": Castle,
  "home": Home,
  "building": Building2,
  "hotel": Hotel,
  "tent": Tent,
  "tree": TreePine,
  "map-pin": MapPin,
  "navigation": Navigation,
  // Transport
  "car": Car,
  "bus": Bus,
  "plane": Plane,
  // Time & Atmosphere
  "clock": Clock,
  "clock-3": Clock3,
  "clock-6": Clock6,
  "clock-9": Clock9,
  "sunrise": Sunrise,
  "sun": Sun,
  "sunset": Sunset,
  "moon": Moon,
  "cloud-sun": CloudSun,
  // People
  "users": Users,
  "users-round": UsersRound,
  "user-check": UserCheck,
  "baby": Baby,
  // Nature & Decoration
  "flower": Flower2,
  "star": Star,
  "flame": Flame,
  "zap": Zap,
  // Misc
  "message": MessageCircle,
  "mail": Mail,
  "phone": Phone,
  "send": Send,
  "bookmark": Bookmark,
  "flag": Flag,
  "trophy": Trophy,
};

// Helper component to render icon by ID
export function ProgramIcon({
  iconId,
  className,
  size = "md",
}: {
  iconId: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8",
  };

  const Icon = ICON_MAP[iconId] || MapPin;
  return <Icon className={cn(sizeClasses[size], className)} />;
}

// Compact icon button with picker trigger
interface IconButtonProps {
  value: string;
  onChange: (iconId: string) => void;
}

export function IconButton({ value, onChange }: IconButtonProps) {
  const [showPicker, setShowPicker] = useState(false);

  const Icon = ICON_MAP[value] || MapPin;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowPicker(!showPicker)}
        className={cn(
          "w-14 h-14 rounded-xl border-2 flex items-center justify-center transition-all",
          showPicker
            ? "border-burgundy-400 bg-burgundy-50 shadow-md"
            : "border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm"
        )}
      >
        <Icon className={cn("w-6 h-6", showPicker ? "text-burgundy-600" : "text-stone-600")} />
      </button>

      <AnimatePresence>
        {showPicker && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowPicker(false)}
            />
            <IconPicker
              value={value}
              onChange={(iconId) => {
                onChange(iconId);
                setShowPicker(false);
              }}
              onClose={() => setShowPicker(false)}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Default icon for new items
export const DEFAULT_ICON = "map-pin";

// Preset program items with Lucide icons
export const PROGRAM_PRESETS = [
  { title: "Ceremonie", icon: "church" },
  { title: "Borrel", icon: "champagne" },
  { title: "Diner", icon: "utensils" },
  { title: "Taart aansnijden", icon: "cake" },
  { title: "Openingsdans", icon: "music" },
  { title: "Feest", icon: "party-popper" },
];
