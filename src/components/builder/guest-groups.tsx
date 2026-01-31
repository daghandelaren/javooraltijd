"use client";

import { useState } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import {
  Users,
  Plus,
  Trash2,
  GripVertical,
  Check,
  ChevronDown,
  ChevronUp,
  UserPlus,
  Heart,
  Briefcase,
  Home,
  Sparkles,
  PartyPopper,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBuilderStore, type GuestGroup } from "@/stores/builder-store";
import { cn } from "@/lib/utils";

// Preset group templates
const GROUP_PRESETS = [
  { name: "Familie", icon: Home, color: "rose" },
  { name: "Vrienden", icon: Heart, color: "violet" },
  { name: "Collega's", icon: Briefcase, color: "blue" },
  { name: "Avondgasten", icon: PartyPopper, color: "amber" },
];

interface GroupCardProps {
  group: GuestGroup;
  events: { id: string; name: string; type: string }[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdate: (updates: Partial<GuestGroup>) => void;
  onDelete: () => void;
}

function GroupCard({
  group,
  events,
  isExpanded,
  onToggleExpand,
  onUpdate,
  onDelete,
}: GroupCardProps) {
  const preset = GROUP_PRESETS.find(
    (p) => p.name.toLowerCase() === group.name.toLowerCase()
  );
  const Icon = preset?.icon || Users;

  const getColorClasses = () => {
    const colorMap: Record<string, { bg: string; border: string; text: string; icon: string }> = {
      rose: { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-700", icon: "bg-rose-100 text-rose-600" },
      violet: { bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-700", icon: "bg-violet-100 text-violet-600" },
      blue: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", icon: "bg-blue-100 text-blue-600" },
      amber: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", icon: "bg-amber-100 text-amber-600" },
    };
    return colorMap[preset?.color || "rose"] || colorMap.rose;
  };

  const colors = getColorClasses();
  const selectedEventCount = group.includedEvents.length;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "rounded-xl border-2 overflow-hidden transition-all",
        isExpanded ? `${colors.bg} ${colors.border}` : "border-stone-200 bg-white hover:border-stone-300"
      )}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 p-4 cursor-pointer"
        onClick={onToggleExpand}
      >
        <div className="flex items-center gap-1 text-stone-400">
          <GripVertical className="w-4 h-4" />
        </div>

        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", colors.icon)}>
          <Icon className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <Input
            value={group.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "font-medium border-0 bg-transparent p-0 h-auto text-base focus-visible:ring-0",
              colors.text
            )}
            placeholder="Groepsnaam"
          />
          <p className="text-xs text-stone-500 mt-0.5">
            {selectedEventCount === 0
              ? "Geen evenementen geselecteerd"
              : `${selectedEventCount} evenement${selectedEventCount !== 1 ? "en" : ""} geselecteerd`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
            isExpanded ? colors.icon : "bg-stone-100"
          )}>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        </div>
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4">
              {/* Event selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-stone-700">
                  Welke onderdelen zien deze gasten?
                </Label>
                <div className="grid gap-2">
                  {events.map((event) => {
                    const isSelected = group.includedEvents.includes(event.id);
                    return (
                      <button
                        key={event.id}
                        onClick={() => {
                          const newEvents = isSelected
                            ? group.includedEvents.filter((id) => id !== event.id)
                            : [...group.includedEvents, event.id];
                          onUpdate({ includedEvents: newEvents });
                        }}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-all",
                          isSelected
                            ? `${colors.border} ${colors.bg}`
                            : "border-stone-200 bg-white hover:border-stone-300"
                        )}
                      >
                        <div
                          className={cn(
                            "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors",
                            isSelected ? "border-burgundy-500 bg-burgundy-500" : "border-stone-300"
                          )}
                        >
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div className="flex-1">
                          <span className={cn(
                            "text-sm font-medium",
                            isSelected ? colors.text : "text-stone-700"
                          )}>
                            {event.name}
                          </span>
                          <span className="text-xs text-stone-400 ml-2">
                            ({event.type})
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* RSVP field options */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-stone-700">
                  RSVP velden voor deze groep
                </Label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: "guestCount" as const, label: "Aantal personen" },
                    { key: "dietary" as const, label: "Dieetwensen" },
                    { key: "message" as const, label: "Berichtje" },
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() =>
                        onUpdate({
                          rsvpFields: {
                            ...group.rsvpFields,
                            [key]: !group.rsvpFields[key],
                          },
                        })
                      }
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all",
                        group.rsvpFields[key]
                          ? `${colors.border} ${colors.bg} ${colors.text}`
                          : "border-stone-200 text-stone-500 hover:border-stone-300"
                      )}
                    >
                      {group.rsvpFields[key] && <Check className="w-3 h-3 inline mr-1" />}
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function GuestGroups() {
  const {
    guestGroups,
    locations,
    timeline,
    addGuestGroup,
    updateGuestGroup,
    removeGuestGroup,
  } = useBuilderStore();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showPresets, setShowPresets] = useState(false);

  // Combine locations and timeline items as "events" for segmentation
  const events = [
    ...locations.map((loc) => ({
      id: `loc-${loc.id}`,
      name: loc.name,
      type: loc.type === "ceremony" ? "Ceremonie" :
            loc.type === "reception" ? "Receptie" :
            loc.type === "dinner" ? "Diner" :
            loc.type === "party" ? "Feest" : "Overig",
    })),
    ...timeline.map((item) => ({
      id: `timeline-${item.id}`,
      name: item.title,
      type: "Programma",
    })),
  ];

  const handleAddGroup = (preset?: typeof GROUP_PRESETS[0]) => {
    addGuestGroup({
      name: preset?.name || "Nieuwe groep",
      includedEvents: events.map((e) => e.id), // Default: all events selected
      rsvpFields: {
        dietary: true,
        message: true,
        guestCount: true,
      },
    });
    setShowPresets(false);
  };

  if (events.length === 0) {
    return (
      <div className="p-6 rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 text-center">
        <Users className="w-10 h-10 mx-auto text-stone-400 mb-3" />
        <h3 className="font-heading text-lg font-semibold text-stone-700 mb-2">
          Eerst locaties of programma toevoegen
        </h3>
        <p className="text-sm text-stone-500">
          Voeg eerst locaties of programma-items toe in de vorige stappen.
          Dan kun je hier gastengroepen aanmaken.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-lg font-semibold text-stone-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-burgundy-600" />
            Gastengroepen
          </h3>
          <p className="text-sm text-stone-500 mt-0.5">
            Bepaal welke groepen welke onderdelen zien
          </p>
        </div>
      </div>

      {/* Info banner when no groups */}
      {guestGroups.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-champagne-50 to-burgundy-50/30 border border-champagne-200"
        >
          <div className="w-10 h-10 rounded-full bg-burgundy-100 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-burgundy-600" />
          </div>
          <div>
            <h4 className="font-medium text-stone-800 mb-1">
              Optioneel: Segmenteer jullie gasten
            </h4>
            <p className="text-sm text-stone-600">
              Maak groepen aan om te bepalen welke gasten welke onderdelen zien.
              Bijvoorbeeld: familie ziet alles, avondgasten alleen het feest.
            </p>
          </div>
        </motion.div>
      )}

      {/* Groups list */}
      <AnimatePresence mode="popLayout">
        {guestGroups.map((group) => (
          <GroupCard
            key={group.id}
            group={group}
            events={events}
            isExpanded={expandedId === group.id}
            onToggleExpand={() =>
              setExpandedId(expandedId === group.id ? null : group.id)
            }
            onUpdate={(updates) => updateGuestGroup(group.id, updates)}
            onDelete={() => removeGuestGroup(group.id)}
          />
        ))}
      </AnimatePresence>

      {/* Add group button with presets */}
      <div className="relative">
        <AnimatePresence>
          {showPresets && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full left-0 right-0 mb-2 p-4 bg-white rounded-xl border border-stone-200 shadow-lg z-10"
            >
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-medium text-stone-700">
                  Kies een preset of maak een eigen groep
                </Label>
                <button
                  onClick={() => setShowPresets(false)}
                  className="p-1 text-stone-400 hover:text-stone-600 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {GROUP_PRESETS.map((preset) => {
                  const Icon = preset.icon;
                  const exists = guestGroups.some(
                    (g) => g.name.toLowerCase() === preset.name.toLowerCase()
                  );
                  return (
                    <button
                      key={preset.name}
                      onClick={() => !exists && handleAddGroup(preset)}
                      disabled={exists}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
                        exists
                          ? "border-stone-200 bg-stone-50 opacity-50 cursor-not-allowed"
                          : "border-stone-200 hover:border-burgundy-300 hover:bg-burgundy-50/30"
                      )}
                    >
                      <Icon className={cn(
                        "w-6 h-6",
                        exists ? "text-stone-400" : "text-burgundy-600"
                      )} />
                      <span className={cn(
                        "text-sm font-medium",
                        exists ? "text-stone-400" : "text-stone-700"
                      )}>
                        {preset.name}
                      </span>
                      {exists && (
                        <span className="text-xs text-stone-400">Toegevoegd</span>
                      )}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => handleAddGroup()}
                className="w-full mt-3 p-3 rounded-lg border-2 border-dashed border-stone-300 text-stone-600 hover:border-burgundy-400 hover:text-burgundy-700 hover:bg-burgundy-50/30 transition-all flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Eigen groep maken
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          variant="outline"
          onClick={() => setShowPresets(!showPresets)}
          className="w-full border-2 border-dashed border-stone-300 hover:border-burgundy-400 hover:bg-burgundy-50/30 h-14"
        >
          <Plus className="w-5 h-5 mr-2" />
          Groep toevoegen
        </Button>
      </div>

      {/* Usage tip */}
      {guestGroups.length > 0 && (
        <p className="text-xs text-stone-500 text-center">
          Tip: Je kunt gasten aan groepen toewijzen wanneer je de deellink verstuurt
        </p>
      )}
    </div>
  );
}
