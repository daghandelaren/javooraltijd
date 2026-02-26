"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Plus,
  Trash2,
  GripVertical,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBuilderStore, type TimelineItem } from "@/stores/builder-store";
import { useBuilderGuard } from "@/hooks/use-builder-guard";
import {
  IconButton,
  ProgramIcon,
  PROGRAM_PRESETS,
  DEFAULT_ICON,
} from "@/components/builder/icon-picker";
import { cn } from "@/lib/utils";

interface TimelineFormData {
  title: string;
  time: string;
  description: string;
  icon: string;
}

const emptyForm: TimelineFormData = {
  title: "",
  time: "",
  description: "",
  icon: DEFAULT_ICON,
};

export default function ProgramPage() {
  const tCta = useTranslations("cta");
  const router = useRouter();
  useBuilderGuard(2);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<TimelineFormData>(emptyForm);

  const {
    timeline,
    addTimelineItem,
    updateTimelineItem,
    removeTimelineItem,
    setCurrentStep,
  } = useBuilderStore();

  useEffect(() => {
    setCurrentStep(5);
  }, [setCurrentStep]);

  const handleAddPreset = (preset: { title: string; icon: string }) => {
    setFormData({
      ...emptyForm,
      title: preset.title,
      icon: preset.icon,
    });
    setEditingId(null);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (item: TimelineItem) => {
    setFormData({
      title: item.title,
      time: item.time,
      description: item.description || "",
      icon: item.icon || DEFAULT_ICON,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.time) return;

    if (editingId) {
      updateTimelineItem(editingId, {
        ...formData,
        iconType: "lucide",
      });
    } else {
      addTimelineItem({
        ...formData,
        iconType: "lucide",
      });
    }
    setShowForm(false);
    setFormData(emptyForm);
    setEditingId(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData(emptyForm);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    removeTimelineItem(id);
  };

  const handleBack = () => {
    router.push("/builder/locations");
  };

  const handleNext = () => {
    router.push("/builder/rsvp");
  };

  // Sort timeline by time
  const sortedTimeline = [...timeline].sort((a, b) => {
    const timeA = a.time.replace(":", "");
    const timeB = b.time.replace(":", "");
    return timeA.localeCompare(timeB);
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-stone-900">
          Programma
        </h1>
        <p className="mt-2 text-stone-600">
          Hoe ziet het programma van jullie dag eruit?
        </p>
      </div>

      <div className="max-w-xl mx-auto space-y-6">
        {/* Preset buttons - Show when empty and form not shown */}
        {timeline.length === 0 && !showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <p className="text-sm text-stone-600 text-center">
              Klik op een onderdeel om toe te voegen:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PROGRAM_PRESETS.map((preset) => (
                <Button
                  key={preset.title}
                  variant="outline"
                  onClick={() => handleAddPreset(preset)}
                  className="h-auto py-3 px-4 flex flex-col items-center gap-2 hover:border-olive-300 hover:bg-olive-50/50"
                >
                  <ProgramIcon iconId={preset.icon} size="lg" className="text-olive-600" />
                  <span className="text-sm">{preset.title}</span>
                </Button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Timeline list */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {sortedTimeline.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-white rounded-xl p-4 shadow-sm border border-stone-200 hover:shadow-md hover:border-stone-300 transition-all"
              >
                <div className="flex items-start gap-4">
                  {/* Drag handle & Icon */}
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-stone-300 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-olive-50 to-champagne-50 border border-olive-100 flex items-center justify-center">
                      <ProgramIcon
                        iconId={item.icon || DEFAULT_ICON}
                        size="lg"
                        className="text-olive-600"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-semibold text-olive-600 tracking-wide">
                          {item.time}
                        </p>
                        <h3 className="font-heading text-lg font-semibold text-stone-900 mt-0.5">
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="text-sm text-stone-500 mt-1 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(item)}
                          className="h-8 px-2"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                          className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty state */}
        {timeline.length === 0 && !showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-stone-50 to-champagne-50/50 rounded-xl p-8 text-center border-2 border-dashed border-stone-200"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white shadow-sm border border-stone-200 flex items-center justify-center">
              <Clock className="w-8 h-8 text-stone-300" />
            </div>
            <h3 className="font-heading text-lg font-semibold text-stone-700">
              Nog geen programma
            </h3>
            <p className="text-stone-500 mt-1 mb-4">
              Voeg de onderdelen van jullie dag toe
            </p>
            <Button onClick={handleAddNew} className="bg-olive-600 hover:bg-olive-700">
              <Plus className="w-4 h-4 mr-2" />
              Item toevoegen
            </Button>
          </motion.div>
        )}

        {/* Add buttons when timeline has items */}
        {timeline.length > 0 && !showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {/* Unused presets */}
            {PROGRAM_PRESETS.filter(
              (preset) => !timeline.some((t) => t.title === preset.title)
            ).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {PROGRAM_PRESETS.filter(
                  (preset) => !timeline.some((t) => t.title === preset.title)
                ).map((preset) => (
                  <Button
                    key={preset.title}
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddPreset(preset)}
                    className="gap-2"
                  >
                    <ProgramIcon iconId={preset.icon} size="sm" className="text-olive-600" />
                    {preset.title}
                  </Button>
                ))}
              </div>
            )}

            {/* Custom add button */}
            <Button
              variant="outline"
              onClick={handleAddNew}
              className="w-full border-2 border-dashed border-stone-300 hover:border-olive-400 hover:bg-olive-50/30 h-12"
            >
              <Plus className="w-4 h-4 mr-2" />
              Eigen onderdeel toevoegen
            </Button>
          </motion.div>
        )}

        {/* Add/Edit form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white rounded-xl p-6 shadow-lg border border-stone-200 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-lg font-semibold text-stone-900">
                    {editingId ? "Item bewerken" : "Nieuw onderdeel"}
                  </h3>
                  <button
                    onClick={handleCancel}
                    className="text-stone-400 hover:text-stone-600 transition-colors"
                  >
                    <span className="sr-only">Sluiten</span>
                    &times;
                  </button>
                </div>

                {/* Icon and Time row */}
                <div className="flex gap-4">
                  {/* Icon picker */}
                  <div className="space-y-2">
                    <Label>Icoon</Label>
                    <IconButton
                      value={formData.icon}
                      onChange={(iconId) => setFormData({ ...formData, icon: iconId })}
                    />
                  </div>

                  {/* Time */}
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="itemTime">Tijd *</Label>
                    <Input
                      id="itemTime"
                      type="time"
                      value={formData.time}
                      onChange={(e) =>
                        setFormData({ ...formData, time: e.target.value })
                      }
                      className="h-14 text-lg"
                    />
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="itemTitle">Titel *</Label>
                  <Input
                    id="itemTitle"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Bijv. Ceremonie, Diner, Feest"
                    className="h-12"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="itemDescription">
                    Beschrijving{" "}
                    <span className="text-stone-400 font-normal">(optioneel)</span>
                  </Label>
                  <Input
                    id="itemDescription"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    placeholder="Bijv. In de tuin van het landgoed"
                    className="h-12"
                  />
                </div>

                {/* Preview */}
                <div className="bg-stone-50 rounded-lg p-4">
                  <p className="text-xs text-stone-500 uppercase tracking-wider mb-3">
                    Preview
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-olive-50 to-champagne-50 border border-olive-100 flex items-center justify-center">
                      <ProgramIcon
                        iconId={formData.icon}
                        size="lg"
                        className="text-olive-600"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-olive-600">
                        {formData.time || "--:--"}
                      </p>
                      <p className="font-heading text-lg font-semibold text-stone-900">
                        {formData.title || "Titel"}
                      </p>
                      {formData.description && (
                        <p className="text-sm text-stone-500">{formData.description}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="ghost" onClick={handleCancel}>
                    {tCta("cancel")}
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={!formData.title || !formData.time}
                    className="bg-olive-600 hover:bg-olive-700 min-w-[120px]"
                  >
                    {editingId ? "Opslaan" : "Toevoegen"}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-stone-200">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {tCta("back")}
        </Button>
        <Button onClick={handleNext} className="min-w-[140px]">
          {tCta("next")}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
