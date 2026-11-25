"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Trophy,
  Plus,
  Trash2,
  Tag,
  ShieldCheck,
  Sparkles,
  Calendar,
  Building,
  CheckCircle,
  X,
  Search,
  Filter,
  GraduationCap,
  Award,
} from "lucide-react";
import { StudentActivity } from "@/types/database";

interface ActivityLockerProps {
  userId?: string;
  userName?: string;
}

const CATEGORIES = [
  { id: "all", label: "All Activities" },
  { id: "leadership", label: "Leadership & Clubs" },
  { id: "competition", label: "Competitions & Olympiads" },
  { id: "creative", label: "Creative & Arts" },
  { id: "sports", label: "Sports & Athletics" },
  { id: "service", label: "Community Service" },
] as const;

const AVAILABLE_COMPETENCIES = [
  "Leadership",
  "Problem Solving",
  "Critical Thinking",
  "Public Speaking",
  "Collaboration",
  "Technical Depth",
  "Social Impact",
  "Discipline",
  "Negotiation",
  "Empathy",
];

export default function ActivityLocker({ userId = "", userName = "Student" }: ActivityLockerProps) {
  const storageKey = userId ? `ptiros_activities_${userId}` : "";
  const [activities, setActivities] = useState<StudentActivity[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New activity form state
  const [newTitle, setNewTitle] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newOrg, setNewOrg] = useState("");
  const [newCategory, setNewCategory] = useState<StudentActivity["category"]>("leadership");
  const [newGrade, setNewGrade] = useState("Grade 11");
  const [newDesc, setNewDesc] = useState("");
  const [selectedCompetencies, setSelectedCompetencies] = useState<string[]>(["Leadership", "Problem Solving"]);

  // Load activities on mount or when user changes — keep brand-new accounts empty
  useEffect(() => {
    if (storageKey) {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored !== null) {
          const parsed: StudentActivity[] = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setActivities(parsed);
            return;
          }
        }
      } catch {}
    }

    setActivities([]);
  }, [userId, storageKey]);

  // Persist whenever activities change
  const persistActivities = (updated: StudentActivity[]) => {
    setActivities(updated);
    if (!storageKey) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {}
  };

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newRole.trim()) return;

    const newActivity: StudentActivity = {
      id: `act_${Date.now()}`,
      userId,
      title: newTitle.trim(),
      role: newRole.trim(),
      organization: newOrg.trim() || undefined,
      category: newCategory,
      grade: newGrade.trim(),
      description: newDesc.trim() || "Demonstrated initiative, dedication, and measurable impact in this extracurricular domain.",
      competencies: selectedCompetencies.length > 0 ? selectedCompetencies : ["Initiative"],
      createdAt: new Date().toISOString(),
    };

    persistActivities([newActivity, ...activities]);
    setIsModalOpen(false);
    // Reset form
    setNewTitle("");
    setNewRole("");
    setNewOrg("");
    setNewDesc("");
  };

  const handleDeleteActivity = (id: string) => {
    persistActivities(activities.filter((a) => a.id !== id));
  };

  const toggleCompetency = (comp: string) => {
    setSelectedCompetencies((prev) =>
      prev.includes(comp) ? prev.filter((c) => c !== comp) : [...prev, comp]
    );
  };

  // Filtered list
  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      const matchesCat = categoryFilter === "all" || act.category === categoryFilter;
      const matchesSearch =
        searchQuery.trim() === "" ||
        act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.competencies.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCat && matchesSearch;
    });
  }, [activities, categoryFilter, searchQuery]);

  // Profile strength calculation
  const profileStats = useMemo(() => {
    if (activities.length === 0) {
      return { score: 0, categoriesCount: 0, competenciesCount: 0 };
    }
    const categoriesPresent = new Set(activities.map((a) => a.category));
    const allCompetencies = new Set(activities.flatMap((a) => a.competencies));

    // A balanced profile covers at least 4 categories and 6 competencies
    const categoryCoverage = Math.min(categoriesPresent.size / 4, 1);
    const competencyCoverage = Math.min(allCompetencies.size / 6, 1);
    const score = Math.round((categoryCoverage * 0.5 + competencyCoverage * 0.5) * 100);

    return {
      score,
      categoriesCount: categoriesPresent.size,
      competenciesCount: allCompetencies.size,
    };
  }, [activities]);

  return (
    <div className="space-y-6">
      {/* 1. Profile Strength Summary Deck */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-stone-200/80 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[11px] font-bold uppercase tracking-wider mb-2">
              <Trophy className="size-3 text-orange-600" />
              Extracurricular & Activity Locker
            </div>
            <h2 className="text-lg sm:text-xl font-display font-bold text-stone-900">
              Holistic Admissions & Competency Portfolio
            </h2>
            <p className="text-xs text-stone-500 mt-1 max-w-2xl leading-relaxed">
              Top universities (IITs, NLSIU, Ashoka, Ivy League, Oxbridge) evaluate beyond marks. Record your clubs, competitions, leadership, and service to prove real-world initiative.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs transition active:scale-95 cursor-pointer shrink-0"
          >
            <Plus className="size-4" />
            <span>Add New Activity</span>
          </button>
        </div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/70">
            <span className="text-[11px] font-semibold text-stone-500 block mb-1">
              Holistic Profile Score
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-stone-900 font-display">
                {profileStats.score}%
              </span>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  profileStats.score >= 70
                    ? "text-emerald-700 bg-emerald-100"
                    : profileStats.score > 0
                    ? "text-amber-800 bg-amber-100"
                    : "text-stone-600 bg-stone-200"
                }`}
              >
                {profileStats.score >= 70 ? "Tier-1 Competitive" : profileStats.score > 0 ? "Building Profile" : "Not Started"}
              </span>
            </div>
            <p className="text-[11px] text-stone-400 mt-1">
              Balanced across {profileStats.categoriesCount} distinct domains
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/70">
            <span className="text-[11px] font-semibold text-stone-500 block mb-1">
              Total Logged Records
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-stone-900 font-display">
                {activities.length}
              </span>
              <span className="text-[11px] text-stone-600 font-medium">
                verified entries
              </span>
            </div>
            <p className="text-[11px] text-stone-400 mt-1">
              Mapped to NEP 2020 holistic progress card
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/70">
            <span className="text-[11px] font-semibold text-stone-500 block mb-1">
              Core Competencies Proven
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-stone-900 font-display">
                {profileStats.competenciesCount}
              </span>
              <span className="text-[11px] text-orange-700 font-bold bg-orange-100 px-2 py-0.5 rounded-full">
                High Impact
              </span>
            </div>
            <p className="text-[11px] text-stone-400 mt-1">
              Leadership, problem solving, public speaking
            </p>
          </div>
        </div>
      </div>

      {/* 2. Filter & Search Controls */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  categoryFilter === cat.id
                    ? "bg-stone-900 text-white shadow-2xs"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200/70"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="absolute left-3 top-2.5 size-3.5 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clubs, olympiads..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-orange-500/30 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 3. Activity Feed Cards */}
      <div className="space-y-3">
        {filteredActivities.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-dashed border-stone-300 text-center space-y-2">
            <Trophy className="size-8 text-stone-300 mx-auto" />
            <p className="text-sm font-semibold text-stone-700">No activities found in this filter.</p>
            <p className="text-xs text-stone-400">Add an extracurricular activity to showcase your holistic portfolio.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600 text-white text-xs font-bold"
            >
              <Plus className="size-3.5" />
              Add Activity
            </button>
          </div>
        ) : (
          filteredActivities.map((act) => (
            <div
              key={act.id}
              className="bg-white rounded-2xl p-4 sm:p-6 border border-stone-200/80 shadow-xs hover:border-orange-300 transition-colors space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                      {act.category}
                    </span>
                    <span className="text-xs text-stone-400 font-medium">
                      {act.grade}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-stone-900 font-display">
                    {act.title}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-orange-950 font-semibold mt-0.5">
                    <span className="text-orange-700">{act.role}</span>
                    {act.organization && (
                      <>
                        <span className="text-stone-300">•</span>
                        <span className="text-stone-600 flex items-center gap-1">
                          <Building className="size-3 text-stone-400" />
                          {act.organization}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteActivity(act.id)}
                  className="text-stone-300 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition cursor-pointer self-start"
                  title="Remove Activity"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">
                {act.description}
              </p>

              {/* Competency Badges */}
              <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-stone-100">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mr-1">
                  Skills Proven:
                </span>
                {act.competencies.map((comp) => (
                  <span
                    key={comp}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-stone-50 border border-stone-200/80 text-stone-700"
                  >
                    {comp}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 4. Add Activity Dialog Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overscroll-contain"
        >
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4 overscroll-contain">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-display font-bold text-lg text-stone-900">
                  Log Extracurricular Activity
                </h3>
                <p className="text-xs text-stone-500">
                  Records your achievements for university admissions dossiers.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-lg hover:bg-stone-100 transition cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleAddActivity} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Activity / Club / Competition Name *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Harvard Model UN, School Robotics Club, Science Fair"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-orange-500/30 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Your Role / Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="e.g. Founder, Best Delegate, Captain, Volunteer"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-orange-500/30 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Organization / School
                  </label>
                  <input
                    type="text"
                    value={newOrg}
                    onChange={(e) => setNewOrg(e.target.value)}
                    placeholder="e.g. DPS R.K. Puram, Red Cross"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-orange-500/30 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as StudentActivity["category"])}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-orange-500/30 focus:outline-none bg-white"
                  >
                    <option value="leadership">Leadership & Clubs</option>
                    <option value="competition">Competitions & Olympiads</option>
                    <option value="creative">Creative & Arts</option>
                    <option value="sports">Sports & Athletics</option>
                    <option value="service">Community Service</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Grade / Year *
                  </label>
                  <input
                    type="text"
                    required
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value)}
                    placeholder="e.g. Grade 11, Grade 10-12"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-orange-500/30 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Key Impact & Description
                </label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Describe what you built, led, or achieved with specific measurable outcomes (e.g. 'Organized 3 inter-school workshops for 85 students')."
                  className="w-full p-3 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-orange-500/30 focus:outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Select Core Competencies Proven:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {AVAILABLE_COMPETENCIES.map((comp) => {
                    const isSelected = selectedCompetencies.includes(comp);
                    return (
                      <button
                        key={comp}
                        type="button"
                        onClick={() => toggleCompetency(comp)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                          isSelected
                            ? "bg-orange-600 text-white shadow-2xs"
                            : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                        }`}
                      >
                        {comp}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 font-semibold text-xs hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                >
                  Save to Locker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
