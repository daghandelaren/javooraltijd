"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Plus,
  Trash2,
  GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconButton, ProgramIcon } from "@/components/builder/icon-picker";
import { useBuilderStore, type Location } from "@/stores/builder-store";
import { useBuilderGuard } from "@/hooks/use-builder-guard";
import { cn } from "@/lib/utils";

const QUICK_PICKS = [
  { label: "Ceremonie", icon: "church" },
  { label: "Receptie", icon: "champagne" },
  { label: "Diner", icon: "utensils" },
  { label: "Feest", icon: "party-popper" },
  { label: "Andere", icon: "map-pin" },
];

interface LocationFormData {
  name: string;
  address: string;
  time: string;
  type: string;
  icon: string;
  notes: string;
}

const emptyForm: LocationFormData = {
  name: "",
  address: "",
  time: "",
  type: "Ceremonie",
  icon: "church",
  notes: "",
};

export default function LocationsPage() {
  const tCta = useTranslations("cta");
  const router = useRouter();
  useBuilderGuard(2);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<LocationFormData>(emptyForm);

  const {
    locations,
    addLocation,
    updateLocation,
    removeLocation,
    setCurrentStep,
  } = useBuilderStore();

  useEffect(() => {
    setCurrentStep(4);
  }, [setCurrentStep]);

  const handleAddNew = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (location: Location) => {
    setFormData({
      name: location.name,
      address: location.address,
      time: location.time,
      type: location.type,
      icon: location.icon ?? "map-pin",
      notes: location.notes || "",
    });
    setEditingId(location.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.address || !formData.time) return;

    if (editingId) {
      updateLocation(editingId, formData);
    } else {
      addLocation(formData);
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
    removeLocation(id);
  };

  const handleBack = () => {
    router.push("/builder/details");
  };

  const handleNext = () => {
    router.push("/builder/program");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-stone-900">
          Locaties
        </h1>
        <p className="mt-2 text-stone-600">
          Waar vinden de festiviteiten plaats?
        </p>
      </div>

      {/* Locations list */}
      <div className="max-w-xl mx-auto space-y-4">
        <AnimatePresence mode="popLayout">
          {locations.map((location) => (
            <motion.div
              key={location.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="bg-white rounded-xl p-4 shadow-sm border border-stone-200"
            >
              <div className="flex items-start gap-4">
                <div className="flex items-center gap-2 text-stone-400 pt-0.5">
                  <GripVertical className="w-5 h-5 cursor-grab" />
                  <ProgramIcon
                    iconId={location.icon ?? "map-pin"}
                    size="sm"
                    className="text-olive-600"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-medium text-olive-700">
                        {location.type} • {location.time}
                      </p>
                      <h3 className="font-heading text-lg font-semibold text-stone-900">
                        {location.name}
                      </h3>
                      <p className="text-sm text-stone-600">
                        {location.address}
                      </p>
                      {location.notes && (
                        <p className="text-sm text-stone-500 mt-1">
                          {location.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(location)}
                      >
                        Bewerk
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(location.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
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

        {/* Empty state */}
        {locations.length === 0 && !showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-stone-50 rounded-xl p-8 text-center border-2 border-dashed border-stone-200"
          >
            <MapPin className="w-12 h-12 mx-auto text-stone-300 mb-4" />
            <h3 className="font-heading text-lg font-semibold text-stone-700">
              Nog geen locaties
            </h3>
            <p className="text-stone-500 mt-1 mb-4">
              Voeg de locaties van jullie bruiloft toe
            </p>
            <Button onClick={handleAddNew}>
              <Plus className="w-4 h-4 mr-2" />
              Locatie toevoegen
            </Button>
          </motion.div>
        )}

        {/* Add button */}
        {locations.length > 0 && !showForm && (
          <Button
            variant="outline"
            onClick={handleAddNew}
            className="w-full border-dashed"
          >
            <Plus className="w-4 h-4 mr-2" />
            Locatie toevoegen
          </Button>
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
              <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-200 space-y-4">
                <h3 className="font-heading text-lg font-semibold text-stone-900">
                  {editingId ? "Locatie bewerken" : "Nieuwe locatie"}
                </h3>

                {/* Icon + Type row */}
                <div className="space-y-2">
                  <Label>Type</Label>
                  <div className="flex items-center gap-3">
                    <IconButton
                      value={formData.icon}
                      onChange={(iconId) =>
                        setFormData({ ...formData, icon: iconId })
                      }
                    />
                    <Input
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      placeholder="bijv. Ceremonie"
                      className="flex-1"
                    />
                  </div>
                  {/* Quick-pick chips */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {QUICK_PICKS.map((pick) => (
                      <button
                        key={pick.label}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            type: pick.label,
                            icon: pick.icon,
                          })
                        }
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all",
                          formData.type === pick.label && formData.icon === pick.icon
                            ? "bg-olive-100 border-olive-400 text-olive-700"
                            : "bg-white border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-50"
                        )}
                      >
                        <ProgramIcon iconId={pick.icon} size="sm" />
                        {pick.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="locationName">Naam *</Label>
                    <Input
                      id="locationName"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Kasteel de Haar"
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="locationAddress">Adres *</Label>
                    <Input
                      id="locationAddress"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      placeholder="Kasteellaan 1, 3455 RR Utrecht"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="locationTime">Tijd *</Label>
                    <Input
                      id="locationTime"
                      type="time"
                      value={formData.time}
                      onChange={(e) =>
                        setFormData({ ...formData, time: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="locationNotes">Notities (optioneel)</Label>
                    <Input
                      id="locationNotes"
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      placeholder="Parkeren aan de achterzijde"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="ghost" onClick={handleCancel}>
                    {tCta("cancel")}
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={
                      !formData.name || !formData.address || !formData.time
                    }
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
