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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBuilderStore, type Location } from "@/stores/builder-store";
import { cn } from "@/lib/utils";

const LOCATION_TYPES = [
  { value: "ceremony", label: "Ceremonie", icon: "💒" },
  { value: "reception", label: "Receptie", icon: "🥂" },
  { value: "dinner", label: "Diner", icon: "🍽️" },
  { value: "party", label: "Feest", icon: "💃" },
  { value: "other", label: "Anders", icon: "📍" },
];

interface LocationFormData {
  name: string;
  address: string;
  time: string;
  type: Location["type"];
  notes: string;
}

const emptyForm: LocationFormData = {
  name: "",
  address: "",
  time: "",
  type: "ceremony",
  notes: "",
};

export default function LocationsPage() {
  const tCta = useTranslations("cta");
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<LocationFormData>(emptyForm);

  const {
    locations,
    templateId,
    addLocation,
    updateLocation,
    removeLocation,
    setCurrentStep,
  } = useBuilderStore();

  useEffect(() => {
    if (!templateId) {
      router.push("/builder/template");
      return;
    }
    setCurrentStep(4);
  }, [templateId, router, setCurrentStep]);

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

  const getTypeInfo = (type: string) => {
    return LOCATION_TYPES.find((t) => t.value === type) || LOCATION_TYPES[4];
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
          {locations.map((location, index) => {
            const typeInfo = getTypeInfo(location.type);
            return (
              <motion.div
                key={location.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="bg-white rounded-xl p-4 shadow-sm border border-stone-200"
              >
                <div className="flex items-start gap-4">
                  <div className="flex items-center gap-2 text-stone-400">
                    <GripVertical className="w-5 h-5 cursor-grab" />
                    <span className="text-2xl">{typeInfo.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-medium text-burgundy-700">
                          {typeInfo.label} • {location.time}
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
            );
          })}
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

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="locationType">Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: Location["type"]) =>
                        setFormData({ ...formData, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LOCATION_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <span className="flex items-center gap-2">
                              <span>{type.icon}</span>
                              <span>{type.label}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

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
