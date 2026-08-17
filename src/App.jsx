import React, { useState, useMemo } from "react";
import {
  Music, Lock, Unlock, ChevronLeft, ChevronRight, Calendar,
  CalendarDays, ListMusic, Library, Mic, Guitar, Drum, Piano,
  Volume2, Monitor, Users, Sparkles, Search, Plus, Youtube,
  ChevronDown, X, Trash2, ClipboardCopy, Check, PartyPopper, Sun,
  Eye, EyeOff, Settings, Edit3, KeyRound, BookOpen, Mic2, Star,
  Heart, Radio, Disc3, Wand2, PersonStanding, HandHeart
} from "lucide-react";

const CATEGORIES = ["Opening Worship", "Praise & Worship", "Offering", "Closing"];
const KEY_OPTIONS = ["C", "C#", "Db", "D", "D#", "Eb", "E", "F", "F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb", "B"];

let nextSongId = 15;

const seedSongs = () => ([
  { id: 1, title: "Pun-a Ako", artist: "Jerome Suson", category: "Opening Worship", key: "", youtubeUrl: "https://youtube.com/watch?v=example1", weeks: ["2026-08-23"] },
  { id: 2, title: "I AM FREE", artist: "Newsboys", category: "Praise & Worship", key: "D", youtubeUrl: "https://youtube.com/watch?v=example2", weeks: ["2026-08-23"] },
  { id: 3, title: "I Thank God", artist: "Jesus Culture", category: "Praise & Worship", key: "", youtubeUrl: "https://youtube.com/watch?v=example3", weeks: ["2026-08-23"] },
  { id: 4, title: "Beautiful Savior", artist: "Planetshakee", category: "Praise & Worship", key: "A", youtubeUrl: "https://youtube.com/watch?v=example4", weeks: ["2026-08-23"] },
  { id: 5, title: "How Great Is Our God", artist: "Hillsong Worship", category: "Praise & Worship", key: "", youtubeUrl: "https://youtube.com/watch?v=example5", weeks: ["2026-08-23"] },
  { id: 6, title: "10,000 Reasons", artist: "Matt Redman", category: "Praise & Worship", key: "G", youtubeUrl: "", weeks: [] },
  { id: 7, title: "Way Maker", artist: "Sinach", category: "Praise & Worship", key: "E", youtubeUrl: "", weeks: [] },
  { id: 8, title: "Give Thanks", artist: "Don Moen", category: "Offering", key: "", youtubeUrl: "", weeks: [] },
  { id: 9, title: "Great Are You Lord", artist: "All Sons & Daughters", category: "Opening Worship", key: "", youtubeUrl: "", weeks: [] },
  { id: 10, title: "Goodness of God", artist: "Bethel Music", category: "Praise & Worship", key: "B", youtubeUrl: "", weeks: [] },
  { id: 11, title: "Blessed Be Your Name", artist: "Matt Redman", category: "Closing", key: "", youtubeUrl: "", weeks: [] },
  { id: 12, title: "Cornerstone", artist: "Hillsong Worship", category: "Closing", key: "C", youtubeUrl: "", weeks: [] },
  { id: 13, title: "Build My Life", artist: "Housefires", category: "Opening Worship", key: "", youtubeUrl: "", weeks: [] },
  { id: 14, title: "Same God", artist: "Elevation Worship", category: "Praise & Worship", key: "", youtubeUrl: "", weeks: [] },
  { id: 15, title: "MAGPABILIN", artist: "", category: "Praise & Worship", key: "", youtubeUrl: "", weeks: ["2026-08-09"] },
  { id: 16, title: "DILI KAPUGNGAN", artist: "AYO WORSHIP", category: "Praise & Worship", key: "D", youtubeUrl: "", weeks: ["2026-08-09"] },
  { id: 17, title: "I SPEAK JESUS", artist: "Charity Gayle", category: "Praise & Worship", key: "E", youtubeUrl: "", weeks: ["2026-08-09"] },
  { id: 18, title: "When I look into your Holiness", artist: "", category: "Praise & Worship", key: "", youtubeUrl: "", weeks: ["2026-08-09"] },
]);
nextSongId = 19;

function pad2(n) {
  return String(n).padStart(2, "0");
}
function toDateStr(year, month, day) {
  return `${year}-${pad2(month + 1)}-${pad2(day)}`;
}
function addDaysToDateStr(dateStr, days) {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  return toDateStr(d.getFullYear(), d.getMonth(), d.getDate());
}
function getSundaysInMonth(year, month) {
  const sundays = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let day = 1; day <= daysInMonth; day++) {
    if (new Date(year, month, day).getDay() === 0) sundays.push(toDateStr(year, month, day));
  }
  return sundays;
}
function formatWeekLabel(dateStr) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function formatLongDate(dateStr) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}
function formatShortWeekday(dateStr) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
}

const THIS_WEEK_DATE = "2026-08-16";
const ADMIN_PASSWORD = "UCCMTH2K26-!";
const CHURCH_LOGO = "data:image/jpeg;base64,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";

const WEEK_SUNDAY_SEEDS = {
  "2026-08-02": { host: "Reclamation Group", songLeader: "Zia", backup: "Reclamation Group", guitar1: "Jan2x", guitar2: "Janrodin", bass: "Von", drummer: "Paul", organ: "Esther", violin: "", soundTech: "Clint", projector: "" },
  "2026-08-09": { host: "Kanipaan Group", songLeader: "Arlyn", backup: "Kanipaan group", guitar1: "Caleb", guitar2: "Paul", bass: "Jan2x", drummer: "Eliakim", organ: "Esther", violin: "Bethany", soundTech: "Clint", projector: "" },
};

const KNOWN_SUNDAYS = ["2026-07-19", "2026-08-02", "2026-08-09", "2026-08-16", "2026-08-23", "2026-08-30"];

const ROLE_META = {
  host: { label: "Host Group", icon: Users, bg: "bg-orange-100", text: "text-orange-700" },
  songLeader: { label: "Song Leader", icon: Mic, bg: "bg-indigo-100", text: "text-indigo-700" },
  backup: { label: "Back Up", icon: Music, bg: "bg-blue-100", text: "text-blue-700" },
  guitar1: { label: "Guitar 1", icon: Guitar, bg: "bg-rose-100", text: "text-rose-700" },
  guitar2: { label: "Guitar 2", icon: Guitar, bg: "bg-rose-100", text: "text-rose-700" },
  bass: { label: "Bass", icon: Guitar, bg: "bg-purple-100", text: "text-purple-700" },
  drummer: { label: "Drummer", icon: Drum, bg: "bg-pink-100", text: "text-pink-700" },
  organ: { label: "Organ / Keys", icon: Piano, bg: "bg-slate-100", text: "text-slate-700" },
  violin: { label: "Violin", icon: Music, bg: "bg-amber-100", text: "text-amber-700" },
  soundTech: { label: "Sound Tech", icon: Volume2, bg: "bg-cyan-100", text: "text-cyan-700" },
  projector: { label: "Projector", icon: Monitor, bg: "bg-sky-100", text: "text-sky-700" },
};

const ROLE_ORDER = [
  "host", "songLeader", "backup",
  "guitar1", "guitar2", "bass",
  "drummer", "organ", "violin",
  "soundTech", "projector",
];

// Icons available for roles — used both for built-in roles and the custom role picker
const ICON_LIBRARY = {
  Mic, Mic2, Music, Guitar, Piano, Drum, Volume2, Monitor,
  Users, Sparkles, BookOpen, Star, Heart, Radio, Disc3, Wand2,
  PersonStanding, HandHeart,
};
const ICON_PICKER_KEYS = [
  "Mic", "Music", "Guitar", "Piano", "Drum", "Volume2", "Monitor",
  "Sparkles", "Radio", "Disc3", "BookOpen", "Mic2", "Users",
  "Wand2", "Star", "Heart", "HandHeart", "PersonStanding",
];

const DEFAULT_ROLE_ICON_KEYS = {
  host: "Users",
  songLeader: "Mic",
  backup: "Music",
  guitar1: "Guitar",
  guitar2: "Guitar",
  bass: "Guitar",
  drummer: "Drum",
  organ: "Piano",
  violin: "Music",
  soundTech: "Volume2",
  projector: "Monitor",
};

const ROLE_COLOR_PALETTE = [
  { bg: "bg-orange-100", text: "text-orange-700" },
  { bg: "bg-indigo-100", text: "text-indigo-700" },
  { bg: "bg-blue-100", text: "text-blue-700" },
  { bg: "bg-rose-100", text: "text-rose-700" },
  { bg: "bg-purple-100", text: "text-purple-700" },
  { bg: "bg-pink-100", text: "text-pink-700" },
  { bg: "bg-slate-100", text: "text-slate-700" },
  { bg: "bg-amber-100", text: "text-amber-700" },
  { bg: "bg-cyan-100", text: "text-cyan-700" },
  { bg: "bg-sky-100", text: "text-sky-700" },
  { bg: "bg-emerald-100", text: "text-emerald-700" },
  { bg: "bg-teal-100", text: "text-teal-700" },
];

// Suggested roles shown in the "Manage Roles" modal, matching the church's typical team roles
const SUGGESTED_ROLE_CATALOG = [
  { label: "Worship Leader", iconKey: "Mic" },
  { label: "Speaker", iconKey: "BookOpen" },
  { label: "Emcee", iconKey: "Mic2" },
  { label: "Percussions", iconKey: "Drum" },
  { label: "Guitar", iconKey: "Guitar" },
  { label: "Bass Guitar", iconKey: "Guitar" },
  { label: "Acoustic Guitar", iconKey: "Guitar" },
  { label: "Piano", iconKey: "Piano" },
  { label: "Synthesizer", iconKey: "Piano" },
  { label: "Viola", iconKey: "Music" },
  { label: "Cello", iconKey: "Music" },
  { label: "Saxophone", iconKey: "Music" },
  { label: "Trumpet", iconKey: "Music" },
  { label: "Trombone", iconKey: "Music" },
  { label: "Flute", iconKey: "Music" },
  { label: "Clarinet", iconKey: "Music" },
  { label: "Tambourine", iconKey: "Music" },
  { label: "Ukulele", iconKey: "Guitar" },
  { label: "Harp", iconKey: "Music" },
  { label: "Sound System", iconKey: "Volume2" },
];

function slugifyRoleKey(label, existingKeys) {
  const base =
    label
      .trim()
      .split(/\s+/)
      .map((w, i) =>
        i === 0
          ? w.charAt(0).toLowerCase() + w.slice(1)
          : w.charAt(0).toUpperCase() + w.slice(1)
      )
      .join("")
      .replace(/[^a-zA-Z0-9]/g, "") || "role";
  let key = base;
  let n = 2;
  while (existingKeys.includes(key)) {
    key = `${base}${n}`;
    n++;
  }
  return key;
}

const INITIAL_ROLE_DEFS = ROLE_ORDER.map((key) => ({
  key,
  label: ROLE_META[key].label,
  iconKey: DEFAULT_ROLE_ICON_KEYS[key],
  bg: ROLE_META[key].bg,
  text: ROLE_META[key].text,
}));

const INITIAL_WEEKS = [
  { label: "Jul 19", start: "2026-07-19" },
  { label: "Aug 9", start: "2026-08-09" },
  { label: "Aug 16", start: "2026-08-16" },
  { label: "Aug 23", start: "2026-08-23" },
];

const DAYS = [
  { key: "special", label: "Special Events", icon: Sparkles },
  { key: "sunday", label: "Sunday", icon: Calendar },
];

const seedAssignments = () => ({
  host: "Barilea Bonifacio Group",
  songLeader: "Arlyn",
  backup: "BarBon Group",
  guitar1: "Jan2x",
  guitar2: "Janrodin",
  bass: "Von",
  drummer: "Eliakim",
  organ: "Paul",
  violin: "",
  soundTech: "Clint",
  projector: "Janrodin or Kath",
});

function makeInitialData() {
  const data = {};
  KNOWN_SUNDAYS.forEach((sundayStart) => {
    data[sundayStart] = {};
    DAYS.forEach((d) => {
      if (d.key === "sunday") {
        data[sundayStart][d.key] = WEEK_SUNDAY_SEEDS[sundayStart]
          ? { ...WEEK_SUNDAY_SEEDS[sundayStart] }
          : seedAssignments();
      } else {
        data[sundayStart][d.key] = {};
      }
    });
  });
  return data;
}

export default function MusicTeamHub() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [weeksList, setWeeksList] = useState(INITIAL_WEEKS);
  const [weekIndex, setWeekIndex] = useState(2);
  const [activeDay, setActiveDay] = useState("sunday");
  const [section, setSection] = useState("week");
  const [data, setData] = useState(makeInitialData);
  const [monthCursor, setMonthCursor] = useState({ year: 2026, month: 7 });

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [songs, setSongs] = useState(seedSongs);
  const [songSearch, setSongSearch] = useState("");
  const [songCategory, setSongCategory] = useState("All Categories");
  const [expandedSongId, setExpandedSongId] = useState(null);
  const [showAddSong, setShowAddSong] = useState(false);
  const [newSong, setNewSong] = useState({ title: "", artist: "", category: CATEGORIES[1], key: "", tempo: "", youtubeUrl: "", notes: "", lyrics: "" });

  const [librarySearch, setLibrarySearch] = useState("");
  const [libraryCategory, setLibraryCategory] = useState("All Categories");
  const [showAddToLibrary, setShowAddToLibrary] = useState(false);
  const [newLibrarySong, setNewLibrarySong] = useState({ title: "", artist: "", category: CATEGORIES[1], key: "", youtubeUrl: "" });
  const [editingSongId, setEditingSongId] = useState(null);
  const [editDraft, setEditDraft] = useState(null);
  const [copied, setCopied] = useState(false);

  const [roleDefs, setRoleDefs] = useState(INITIAL_ROLE_DEFS);
  const [showRolesModal, setShowRolesModal] = useState(false);
  const [draftRoleDefs, setDraftRoleDefs] = useState(INITIAL_ROLE_DEFS);
  const [roleSearch, setRoleSearch] = useState("");
  const [customRoleIconKey, setCustomRoleIconKey] = useState("Music");
  const [customRoleName, setCustomRoleName] = useState("");

  const week = weeksList[weekIndex];
  const dayAssignments = (data[week.start] && data[week.start][activeDay]) || {};

  const updateRole = (role, value) => {
    setData((prev) => {
      const weekData = prev[week.start] || {};
      const dayData = weekData[activeDay] || {};
      return {
        ...prev,
        [week.start]: {
          ...weekData,
          [activeDay]: { ...dayData, [role]: value },
        },
      };
    });
  };

  const submitLogin = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowLoginModal(false);
      setPasswordInput("");
      setLoginError("");
    } else {
      setLoginError("Incorrect password. Try again.");
    }
  };

  const cancelLogin = () => {
    setShowLoginModal(false);
    setPasswordInput("");
    setShowPassword(false);
    setLoginError("");
  };

  const logout = () => setIsAdmin(false);

  const goToWeek = (dateStr) => {
    setWeeksList((prev) => {
      let merged = prev;
      if (!prev.some((w) => w.start === dateStr)) {
        merged = [...prev, { start: dateStr, label: formatWeekLabel(dateStr) }].sort((a, b) =>
          a.start.localeCompare(b.start)
        );
      }
      const idx = merged.findIndex((w) => w.start === dateStr);
      setWeekIndex(idx);
      return merged;
    });
    setSection("week");
  };

  const dateHeading = new Date(week.start + "T00:00:00").toLocaleDateString(
    "en-US",
    { weekday: "long", month: "short", day: "numeric" }
  );

  const filledRoles = roleDefs.filter((r) => dayAssignments[r.key]);

  // Songs for the currently selected week
  const weekSongs = useMemo(
    () => songs.filter((s) => s.weeks.includes(week.start)),
    [songs, week.start]
  );
  const weekSongsWithYoutube = weekSongs.filter((s) => s.youtubeUrl).length;

  const copyWeekSongsForDeck = async () => {
    const text = weekSongs
      .map((s, i) => {
        const keyPart = s.key ? ` (Key: ${s.key})` : "";
        return `${i + 1}. ${s.title} — ${s.artist}${keyPart}`;
      })
      .join("\n");
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      // clipboard API unavailable — fail silently in this prototype
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const visibleSongs = useMemo(() => {
    return weekSongs.filter((s) => {
      const matchesCategory =
        songCategory === "All Categories" || s.category === songCategory;
      const q = songSearch.trim().toLowerCase();
      const matchesSearch =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.artist.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [weekSongs, songCategory, songSearch]);

  const addSongToWeek = () => {
    if (!newSong.title.trim()) return;
    const song = {
      id: nextSongId++,
      title: newSong.title.trim(),
      artist: newSong.artist.trim(),
      category: newSong.category,
      key: newSong.key.trim(),
      tempo: newSong.tempo.trim(),
      youtubeUrl: newSong.youtubeUrl.trim(),
      notes: newSong.notes.trim(),
      lyrics: newSong.lyrics.trim(),
      weeks: [week.start],
    };
    setSongs((prev) => [...prev, song]);
    setNewSong({ title: "", artist: "", category: CATEGORIES[1], key: "", tempo: "", youtubeUrl: "", notes: "", lyrics: "" });
    setShowAddSong(false);
  };

  const removeSongFromWeek = (id) => {
    setSongs((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, weeks: s.weeks.filter((w) => w !== week.start) } : s
      )
    );
  };

  // Library (full catalog, independent of week)
  const libraryCounts = useMemo(() => {
    const counts = {};
    songs.forEach((s) => {
      counts[s.category] = (counts[s.category] || 0) + 1;
    });
    return counts;
  }, [songs]);

  const visibleLibrarySongs = useMemo(() => {
    const q = librarySearch.trim().toLowerCase();
    return songs
      .filter((s) => {
        const matchesCategory =
          libraryCategory === "All Categories" || s.category === libraryCategory;
        const matchesSearch =
          !q ||
          s.title.toLowerCase().includes(q) ||
          s.artist.toLowerCase().includes(q);
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [songs, librarySearch, libraryCategory]);

  const addToLibrary = () => {
    if (!newLibrarySong.title.trim()) return;
    const song = {
      id: nextSongId++,
      title: newLibrarySong.title.trim(),
      artist: newLibrarySong.artist.trim(),
      category: newLibrarySong.category,
      key: newLibrarySong.key.trim(),
      youtubeUrl: newLibrarySong.youtubeUrl.trim(),
      weeks: [],
    };
    setSongs((prev) => [...prev, song]);
    setNewLibrarySong({ title: "", artist: "", category: CATEGORIES[1], key: "", youtubeUrl: "" });
    setShowAddToLibrary(false);
  };

  const deleteFromLibrary = (id) => {
    setSongs((prev) => prev.filter((s) => s.id !== id));
    if (editingSongId === id) setEditingSongId(null);
  };

  const startEditSong = (song) => {
    setEditingSongId(song.id);
    setEditDraft({ ...song });
  };

  const saveEditSong = () => {
    setSongs((prev) =>
      prev.map((s) => (s.id === editingSongId ? { ...editDraft } : s))
    );
    setEditingSongId(null);
    setEditDraft(null);
  };

  // Manage Roles modal
  const openRolesModal = () => {
    setDraftRoleDefs(roleDefs);
    setRoleSearch("");
    setCustomRoleName("");
    setCustomRoleIconKey("Music");
    setShowRolesModal(true);
  };

  const closeRolesModal = () => {
    setShowRolesModal(false);
    setRoleSearch("");
    setCustomRoleName("");
  };

  const nextRoleColor = (defs) => ROLE_COLOR_PALETTE[defs.length % ROLE_COLOR_PALETTE.length];

  const addSuggestedRole = (item) => {
    setDraftRoleDefs((prev) => {
      if (prev.some((r) => r.label.toLowerCase() === item.label.toLowerCase())) return prev;
      const key = slugifyRoleKey(item.label, prev.map((r) => r.key));
      const color = nextRoleColor(prev);
      return [...prev, { key, label: item.label, iconKey: item.iconKey, ...color }];
    });
  };

  const removeDraftRole = (key) => {
    setDraftRoleDefs((prev) => prev.filter((r) => r.key !== key));
  };

  const addCustomRole = () => {
    const name = customRoleName.trim();
    if (!name) return;
    setDraftRoleDefs((prev) => {
      if (prev.some((r) => r.label.toLowerCase() === name.toLowerCase())) return prev;
      const key = slugifyRoleKey(name, prev.map((r) => r.key));
      const color = nextRoleColor(prev);
      return [...prev, { key, label: name, iconKey: customRoleIconKey, ...color }];
    });
    setCustomRoleName("");
  };

  const saveRoles = () => {
    setRoleDefs(draftRoleDefs);
    setShowRolesModal(false);
  };

  const filteredSuggestedRoles = useMemo(() => {
    const q = roleSearch.trim().toLowerCase();
    const activeLabels = draftRoleDefs.map((r) => r.label.toLowerCase());
    return SUGGESTED_ROLE_CATALOG.filter((item) => {
      if (activeLabels.includes(item.label.toLowerCase())) return false;
      if (!q) return true;
      return item.label.toLowerCase().includes(q);
    });
  }, [roleSearch, draftRoleDefs]);

  return (
    <div className="w-full min-h-screen" style={{ background: "#eef1f7" }}>
      {/* Header */}
      <div style={{ background: "#1e3a5f" }} className="px-6 py-4">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <img
              src={CHURCH_LOGO}
              alt="Universal Church of Christ logo"
              className="w-11 h-11 rounded-xl object-cover"
            />
            <div>
              <h1 className="text-white font-semibold text-lg leading-tight">
                UCC Cadiz Music Team Hub
              </h1>
              <p className="text-blue-200 text-sm leading-tight">
                Universal Church of Christ Incorporated · Cadiz City
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-300 text-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Live
            </span>
            {isAdmin ? (
              <>
                <button
                  onClick={openRolesModal}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-white bg-white/10 hover:bg-white/20"
                >
                  <Settings className="w-4 h-4" />
                  Roles
                </button>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-white bg-white/10 hover:bg-white/20"
                >
                  <Unlock className="w-4 h-4" />
                  Log out
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-white bg-white/10 hover:bg-white/20"
              >
                <Lock className="w-4 h-4" />
                Admin Login
              </button>
            )}
          </div>
        </div>

        <div className="mt-3">
          {isAdmin ? (
            <span
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border"
              style={{ background: "rgba(201,147,46,0.15)", borderColor: "#c9932e", color: "#f0c674" }}
            >
              <Edit3 className="w-3 h-3" />
              Admin — full edit access
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-100 bg-white/10 px-2.5 py-1 rounded-full">
              <Eye className="w-3 h-3" />
              View only
            </span>
          )}
        </div>

        {/* Week navigator */}
        <div className="mt-5 flex items-center justify-between flex-wrap gap-3">
          <button
            onClick={() => setWeekIndex((i) => Math.max(0, i - 1))}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-white bg-white/10 hover:bg-white/20 text-sm"
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>
          <div className="text-center">
            <p className="text-amber-300 text-xs font-semibold tracking-wide">THIS WEEK</p>
            <p className="text-white font-medium">{dateHeading}, {week.start.slice(0,4)}</p>
          </div>
          <button
            onClick={() => setWeekIndex((i) => Math.min(weeksList.length - 1, i + 1))}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-white bg-white/10 hover:bg-white/20 text-sm"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-3 flex gap-2 flex-wrap">
          {weeksList.map((w, i) => (
            <button
              key={w.start}
              onClick={() => setWeekIndex(i)}
              className="px-3 py-1 rounded-full text-sm font-medium"
              style={{
                background: i === weekIndex ? "#c9932e" : "rgba(255,255,255,0.1)",
                color: "white",
              }}
            >
              {w.label}
            </button>
          ))}
        </div>

        {/* Section tabs */}
        <div className="mt-5 flex gap-1 bg-white/5 rounded-lg p-1 w-fit flex-wrap">
          {[
            { key: "month", label: "This Month", icon: Calendar },
            { key: "week", label: "This Week", icon: CalendarDays },
            { key: "songs", label: "Songs", icon: ListMusic },
            { key: "library", label: "Library", icon: Library },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setSection(t.key)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium"
              style={{
                background: section === t.key ? "white" : "transparent",
                color: section === t.key ? "#1e3a5f" : "#cbd5e1",
              }}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {section === "month" ? (
        <div className="max-w-5xl mx-auto px-6 py-6">
          {/* Month navigator */}
          <div className="flex items-center justify-between">
            <button
              onClick={() =>
                setMonthCursor((c) =>
                  c.month === 0 ? { year: c.year - 1, month: 11 } : { ...c, month: c.month - 1 }
                )
              }
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white shadow-sm text-sm font-medium text-slate-600"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>
            <p className="text-lg font-semibold text-slate-800">
              {new Date(monthCursor.year, monthCursor.month, 1).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>
            <button
              onClick={() =>
                setMonthCursor((c) =>
                  c.month === 11 ? { year: c.year + 1, month: 0 } : { ...c, month: c.month + 1 }
                )
              }
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white shadow-sm text-sm font-medium text-slate-600"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
            {getSundaysInMonth(monthCursor.year, monthCursor.month).map((sunday) => {
              const isThisWeek = sunday === THIS_WEEK_DATE;
              const sundayAssignments = (data[sunday] && data[sunday].sunday) || {};
              const filled = roleDefs.filter((r) => sundayAssignments[r.key]);
              const monthWeekSongs = songs.filter((s) => s.weeks.includes(sunday));
              const thursday = addDaysToDateStr(sunday, 4);
              const friday = addDaysToDateStr(sunday, 5);

              return (
                <div
                  key={sunday}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden"
                  style={isThisWeek ? { border: "2px solid #c9932e" } : undefined}
                >
                  {isThisWeek && (
                    <div className="px-4 pt-3">
                      <span className="text-xs font-bold tracking-wide" style={{ color: "#c9932e" }}>
                        THIS WEEK
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                    <p className="font-semibold text-slate-800 text-sm">
                      Week of Sunday, {formatLongDate(sunday)}
                    </p>
                    <button
                      onClick={() => goToWeek(sunday)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 shrink-0"
                    >
                      View Week <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-4 flex flex-col gap-3">
                    {/* Sunday card */}
                    <div className="rounded-xl p-3" style={{ background: "#f7f9fc" }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                            <Sun className="w-4 h-4" />
                          </span>
                          <div>
                            <p className="font-semibold text-slate-800 text-sm">Sunday</p>
                            <p className="text-xs text-slate-400">{formatShortWeekday(sunday)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="flex items-center gap-1 text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                            <Users className="w-3 h-3" /> {filled.length}
                          </span>
                          {monthWeekSongs.length > 0 && (
                            <span className="flex items-center gap-1 text-xs font-semibold bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full">
                              <Music className="w-3 h-3" /> {monthWeekSongs.length}
                            </span>
                          )}
                        </div>
                      </div>

                      {filled.length > 0 && (
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {filled.map((role) => {
                            return (
                              <span
                                key={role.key}
                                className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg ${role.bg}`}
                              >
                                <span className="text-[9px] font-semibold text-slate-500 uppercase">
                                  {role.label}
                                </span>
                                <span className={`font-semibold ${role.text}`}>
                                  {sundayAssignments[role.key]}
                                </span>
                              </span>
                            );
                          })}
                        </div>
                      )}

                      {monthWeekSongs.length > 0 && (
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {monthWeekSongs.map((s, i) => (
                            <span
                              key={s.id}
                              className="text-xs font-medium px-2 py-1 rounded-full bg-blue-50 text-blue-700"
                            >
                              {i + 1}. {s.title.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Thursday / Friday informational rows */}
                    <div className="rounded-xl border border-slate-100 flex items-center justify-between px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
                          <Sparkles className="w-4 h-4" />
                        </span>
                        <div>
                          <p className="text-sm font-medium text-slate-700">Thursday</p>
                          <p className="text-xs text-slate-400">{formatShortWeekday(thursday)}</p>
                        </div>
                      </div>
                      <span className="text-sm italic text-slate-300">Nothing yet</span>
                    </div>
                    <div className="rounded-xl border border-slate-100 flex items-center justify-between px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
                          <PartyPopper className="w-4 h-4" />
                        </span>
                        <div>
                          <p className="text-sm font-medium text-slate-700">Friday</p>
                          <p className="text-xs text-slate-400">{formatShortWeekday(friday)}</p>
                        </div>
                      </div>
                      <span className="text-sm italic text-slate-300">Nothing yet</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : section === "week" ? (
        <div className="max-w-5xl mx-auto px-6 py-6">
          {/* Day tabs */}
          <div className="bg-white rounded-xl p-1.5 flex flex-wrap gap-1 shadow-sm">
            {DAYS.map((d) => (
              <button
                key={d.key}
                onClick={() => setActiveDay(d.key)}
                className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition"
                style={{
                  background: activeDay === d.key ? "#1e3a5f" : "transparent",
                  color: activeDay === d.key ? "white" : "#475569",
                }}
              >
                <d.icon className="w-4 h-4" />
                {d.label}
              </button>
            ))}
          </div>

          <p className="mt-5 flex items-center gap-2 text-slate-700 font-medium">
            <Calendar className="w-4 h-4 text-slate-400" />
            {dateHeading}
          </p>

          {/* Assigned team chips */}
          <div className="mt-3 bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 tracking-wide mb-3">
              ASSIGNED TEAM
            </p>
            {filledRoles.length === 0 ? (
              <p className="text-sm text-slate-400">No one assigned yet for this day.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {filledRoles.map((role) => {
                  const Icon = ICON_LIBRARY[role.iconKey] || Music;
                  return (
                    <div
                      key={role.key}
                      className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full ${role.bg}`}
                    >
                      <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                        <Icon className={`w-3.5 h-3.5 ${role.text}`} />
                      </span>
                      <span>
                        <span className="block text-[10px] font-semibold text-slate-500 leading-none tracking-wide">
                          {role.label.toUpperCase()}
                        </span>
                        <span className={`text-sm font-medium ${role.text}`}>
                          {dayAssignments[role.key]}
                        </span>
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Editable roster grid */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {roleDefs.map((role) => {
              const Icon = ICON_LIBRARY[role.iconKey] || Music;
              return (
                <div key={role.key} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
                  <span className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${role.bg}`}>
                    <Icon className={`w-4 h-4 ${role.text}`} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-slate-400 tracking-wide">
                      {role.label.toUpperCase()}
                    </p>
                    <input
                      value={dayAssignments[role.key] || ""}
                      onChange={(e) => updateRole(role.key, e.target.value)}
                      readOnly={!isAdmin}
                      placeholder="—"
                      className="w-full mt-0.5 text-sm font-medium text-slate-800 bg-slate-50 rounded-lg px-2.5 py-1.5 outline-none"
                      style={{
                        cursor: isAdmin ? "text" : "default",
                        border: isAdmin ? "1px solid #c9932e55" : "1px solid transparent",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          {/* Song list for this week */}
          <div className="mt-4 bg-white rounded-2xl shadow-sm overflow-hidden">
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ background: "linear-gradient(90deg, #1c8a5c, #157a4f)" }}
            >
              <div className="flex items-center gap-3">
                <Music className="w-5 h-5 text-white" />
                <div>
                  <p className="text-white font-semibold leading-tight">Song List</p>
                  <p className="text-emerald-100 text-sm leading-tight">
                    {weekSongs.length} song{weekSongs.length === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
              <button
                onClick={copyWeekSongsForDeck}
                disabled={weekSongs.length === 0}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
                style={{ background: "#1e3a5f" }}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <ClipboardCopy className="w-4 h-4" />
                    Copy All for Deck
                  </>
                )}
              </button>
            </div>
            <div className="p-4 flex flex-col gap-2">
              {weekSongs.length === 0 ? (
                <p className="text-sm text-slate-400 px-2 py-3">
                  No songs added for this week yet — add some from the Songs tab.
                </p>
              ) : (
                weekSongs.map((song, i) => (
                  <div
                    key={song.id}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                    style={{ background: "#eef1fb" }}
                  >
                    <span className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <p className="flex-1 min-w-0 truncate">
                      <span className="font-semibold text-slate-800">{song.title}</span>
                      <span className="text-slate-400"> {song.artist}</span>
                    </p>
                    {song.key && (
                      <span className="text-sm text-slate-500 shrink-0">
                        Key: <span className="font-semibold text-slate-700">{song.key}</span>
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : section === "songs" ? (
        <div className="max-w-5xl mx-auto px-6 py-6">
          {/* Search + filter + add */}
          <div className="flex flex-wrap gap-3 items-stretch">
            <div className="flex-1 min-w-[220px] flex items-center gap-2 bg-white rounded-lg px-3 shadow-sm">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                value={songSearch}
                onChange={(e) => setSongSearch(e.target.value)}
                placeholder="Search song or artist..."
                className="w-full py-2.5 text-sm outline-none bg-transparent"
              />
            </div>
            <select
              value={songCategory}
              onChange={(e) => setSongCategory(e.target.value)}
              className="bg-white rounded-lg px-3 text-sm shadow-sm outline-none text-slate-700"
            >
              <option>All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            {isAdmin && (
              <button
                onClick={() => setShowAddSong((v) => !v)}
                className="flex items-center gap-1.5 px-4 rounded-lg text-sm font-semibold shrink-0"
                style={{ background: "#c9932e", color: "white" }}
              >
                <Plus className="w-4 h-4" />
                Add Song
              </button>
            )}
          </div>

          {/* Add Song modal */}
          {showAddSong && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ background: "rgba(15,23,42,0.55)" }}
              onClick={() => setShowAddSong(false)}
            >
              <div
                className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col"
                style={{ maxHeight: "90vh" }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div
                  className="px-6 py-4 flex items-center justify-between shrink-0"
                  style={{ background: "#1e3a5f" }}
                >
                  <p className="text-white font-semibold text-lg">Add Song</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setShowAddSong(false);
                        setSection("library");
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold"
                      style={{ background: "#2b4d78", color: "#e0a63f", border: "1px solid #e0a63f66" }}
                    >
                      <Library className="w-4 h-4" />
                      Browse Library
                    </button>
                    <button
                      onClick={() => setShowAddSong(false)}
                      className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Scrollable body */}
                <div className="px-6 py-5 overflow-y-auto flex flex-col gap-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 tracking-wide mb-1.5">
                      SONG TITLE <span className="text-rose-500">*</span>
                    </p>
                    <input
                      value={newSong.title}
                      onChange={(e) => setNewSong((s) => ({ ...s, title: e.target.value }))}
                      placeholder="Song title..."
                      autoFocus
                      className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2.5 outline-none"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-500 tracking-wide mb-1.5">
                      ARTIST / COMPOSER
                    </p>
                    <input
                      value={newSong.artist}
                      onChange={(e) => setNewSong((s) => ({ ...s, artist: e.target.value }))}
                      placeholder="Artist name..."
                      className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2.5 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 tracking-wide mb-1.5">
                        KEY
                      </p>
                      <select
                        value={newSong.key}
                        onChange={(e) => setNewSong((s) => ({ ...s, key: e.target.value }))}
                        className="w-full text-sm bg-white border border-slate-200 rounded-lg px-2.5 py-2.5 outline-none"
                      >
                        <option value="">—</option>
                        {KEY_OPTIONS.map((k) => (
                          <option key={k} value={k}>{k}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 tracking-wide mb-1.5">
                        TEMPO (BPM)
                      </p>
                      <input
                        type="number"
                        value={newSong.tempo}
                        onChange={(e) => setNewSong((s) => ({ ...s, tempo: e.target.value }))}
                        placeholder="120"
                        className="w-full text-sm bg-white border border-slate-200 rounded-lg px-2.5 py-2.5 outline-none"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 tracking-wide mb-1.5">
                        CATEGORY
                      </p>
                      <select
                        value={newSong.category}
                        onChange={(e) => setNewSong((s) => ({ ...s, category: e.target.value }))}
                        className="w-full text-sm bg-white border border-slate-200 rounded-lg px-2.5 py-2.5 outline-none"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-500 tracking-wide mb-1.5">
                      YOUTUBE LINK
                    </p>
                    <input
                      value={newSong.youtubeUrl}
                      onChange={(e) => setNewSong((s) => ({ ...s, youtubeUrl: e.target.value }))}
                      placeholder="https://youtu.be/..."
                      className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2.5 outline-none"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-500 tracking-wide mb-1.5">
                      TEAM NOTES
                    </p>
                    <textarea
                      value={newSong.notes}
                      onChange={(e) => setNewSong((s) => ({ ...s, notes: e.target.value }))}
                      placeholder="Arrangement notes, cues..."
                      rows={3}
                      className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2.5 outline-none resize-y"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-500 tracking-wide mb-1.5">
                      LYRICS / CHORD CHART
                    </p>
                    <textarea
                      value={newSong.lyrics}
                      onChange={(e) => setNewSong((s) => ({ ...s, lyrics: e.target.value }))}
                      placeholder="Paste lyrics here with [Verse 1] / [Chorus] / [Bridge] tags..."
                      rows={6}
                      className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2.5 outline-none resize-y font-mono"
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 flex gap-3 shrink-0">
                  <button
                    onClick={() => setShowAddSong(false)}
                    className="flex-1 py-2.5 rounded-lg text-sm font-semibold border border-slate-200 text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addSongToWeek}
                    disabled={!newSong.title.trim()}
                    className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
                    style={{ background: "#1e3a5f" }}
                  >
                    Add Song
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-2xl font-bold text-slate-800">{weekSongs.length}</p>
              <p className="text-xs text-slate-400 mt-0.5">Songs This Week</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-2xl font-bold text-slate-800">{weekSongsWithYoutube}</p>
              <p className="text-xs text-slate-400 mt-0.5">With YouTube</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-2xl font-bold text-slate-800">{songs.length}</p>
              <p className="text-xs text-slate-400 mt-0.5">In Library</p>
            </div>
          </div>

          {/* Song list */}
          <div className="mt-4 flex flex-col gap-3">
            {visibleSongs.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                <p className="text-sm text-slate-400">
                  {weekSongs.length === 0
                    ? "No songs added for this week yet."
                    : "No songs match your search."}
                </p>
              </div>
            ) : (
              visibleSongs.map((song, i) => {
                const expanded = expandedSongId === song.id;
                return (
                  <div key={song.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="flex items-center gap-4 p-4">
                      <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 text-sm font-semibold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-slate-800">{song.title}</p>
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                            {song.category}
                          </span>
                          {song.youtubeUrl && (
                            <Youtube className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                        <p className="text-sm text-slate-400 mt-0.5">
                          {song.artist}
                          {song.key && <span> · Key: {song.key}</span>}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {song.youtubeUrl ? (
                          <a
                            href={song.youtubeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-red-200 text-red-600"
                          >
                            <Youtube className="w-3.5 h-3.5" />
                            Watch
                          </a>
                        ) : (
                          <span className="text-xs text-slate-300 px-2">No link</span>
                        )}
                        <button
                          onClick={() =>
                            setExpandedSongId(expanded ? null : song.id)
                          }
                          className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center"
                        >
                          <ChevronDown
                            className="w-4 h-4 text-slate-500 transition-transform"
                            style={{ transform: expanded ? "rotate(180deg)" : "none" }}
                          />
                        </button>
                      </div>
                    </div>
                    {expanded && (
                      <div className="px-4 pb-4 pt-1 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
                        <div className="text-sm text-slate-500">
                          <p>Category: {song.category}</p>
                          <p>Key: {song.key || "—"}</p>
                        </div>
                        {isAdmin && (
                          <button
                            onClick={() => removeSongFromWeek(song.id)}
                            className="flex items-center gap-1.5 text-xs font-semibold text-rose-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Remove from this week
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : section === "library" ? (
        <div className="max-w-5xl mx-auto px-6 py-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-2xl font-bold text-slate-800">{songs.length}</p>
              <p className="text-xs text-slate-400 mt-0.5">Total Songs</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-2xl font-bold text-blue-600">
                {libraryCounts["Praise & Worship"] || 0}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Praise & Worship</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-2xl font-bold text-slate-800">
                {libraryCounts["Opening Worship"] || 0}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Opening Worship</p>
            </div>
          </div>

          {/* Search + filter + add */}
          <div className="mt-4 flex flex-wrap gap-3 items-stretch">
            <div className="flex-1 min-w-[220px] flex items-center gap-2 bg-white rounded-lg px-3 shadow-sm">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                value={librarySearch}
                onChange={(e) => setLibrarySearch(e.target.value)}
                placeholder="Search song or artist..."
                className="w-full py-2.5 text-sm outline-none bg-transparent"
              />
            </div>
            <select
              value={libraryCategory}
              onChange={(e) => setLibraryCategory(e.target.value)}
              className="bg-white rounded-lg px-3 text-sm shadow-sm outline-none text-slate-700"
            >
              <option>All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            {isAdmin && (
              <button
                onClick={() => setShowAddToLibrary((v) => !v)}
                className="flex items-center gap-1.5 px-4 rounded-lg text-sm font-semibold shrink-0"
                style={{ background: "#c9932e", color: "white" }}
              >
                <Plus className="w-4 h-4" />
                Add to Library
              </button>
            )}
          </div>

          {/* Add to library form */}
          {showAddToLibrary && (
            <div className="mt-3 bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-slate-700">Add a new song</p>
                <button onClick={() => setShowAddToLibrary(false)}>
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  value={newLibrarySong.title}
                  onChange={(e) => setNewLibrarySong((s) => ({ ...s, title: e.target.value }))}
                  placeholder="Song title"
                  className="text-sm bg-slate-50 rounded-lg px-3 py-2 outline-none"
                />
                <input
                  value={newLibrarySong.artist}
                  onChange={(e) => setNewLibrarySong((s) => ({ ...s, artist: e.target.value }))}
                  placeholder="Artist"
                  className="text-sm bg-slate-50 rounded-lg px-3 py-2 outline-none"
                />
                <select
                  value={newLibrarySong.category}
                  onChange={(e) => setNewLibrarySong((s) => ({ ...s, category: e.target.value }))}
                  className="text-sm bg-slate-50 rounded-lg px-3 py-2 outline-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <input
                  value={newLibrarySong.key}
                  onChange={(e) => setNewLibrarySong((s) => ({ ...s, key: e.target.value }))}
                  placeholder="Key (optional)"
                  className="text-sm bg-slate-50 rounded-lg px-3 py-2 outline-none"
                />
                <input
                  value={newLibrarySong.youtubeUrl}
                  onChange={(e) => setNewLibrarySong((s) => ({ ...s, youtubeUrl: e.target.value }))}
                  placeholder="YouTube link (optional)"
                  className="text-sm bg-slate-50 rounded-lg px-3 py-2 outline-none sm:col-span-2"
                />
              </div>
              <button
                onClick={addToLibrary}
                className="mt-3 px-4 py-2 rounded-lg text-sm font-semibold text-white"
                style={{ background: "#1e3a5f" }}
              >
                Save song
              </button>
            </div>
          )}

          {/* Library list */}
          <div className="mt-4 flex flex-col gap-3">
            {visibleLibrarySongs.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                <p className="text-sm text-slate-400">No songs match your search.</p>
              </div>
            ) : (
              visibleLibrarySongs.map((song, i) => {
                const isEditing = editingSongId === song.id;
                const avatarBg = i % 2 === 0 ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500";

                if (isEditing) {
                  return (
                    <div key={song.id} className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          value={editDraft.title}
                          onChange={(e) => setEditDraft((s) => ({ ...s, title: e.target.value }))}
                          className="text-sm bg-slate-50 rounded-lg px-3 py-2 outline-none"
                          placeholder="Song title"
                        />
                        <input
                          value={editDraft.artist}
                          onChange={(e) => setEditDraft((s) => ({ ...s, artist: e.target.value }))}
                          className="text-sm bg-slate-50 rounded-lg px-3 py-2 outline-none"
                          placeholder="Artist"
                        />
                        <select
                          value={editDraft.category}
                          onChange={(e) => setEditDraft((s) => ({ ...s, category: e.target.value }))}
                          className="text-sm bg-slate-50 rounded-lg px-3 py-2 outline-none"
                        >
                          {CATEGORIES.map((c) => (
                            <option key={c}>{c}</option>
                          ))}
                        </select>
                        <input
                          value={editDraft.key}
                          onChange={(e) => setEditDraft((s) => ({ ...s, key: e.target.value }))}
                          className="text-sm bg-slate-50 rounded-lg px-3 py-2 outline-none"
                          placeholder="Key"
                        />
                        <input
                          value={editDraft.youtubeUrl}
                          onChange={(e) => setEditDraft((s) => ({ ...s, youtubeUrl: e.target.value }))}
                          className="text-sm bg-slate-50 rounded-lg px-3 py-2 outline-none sm:col-span-2"
                          placeholder="YouTube link"
                        />
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={saveEditSong}
                          className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
                          style={{ background: "#1e3a5f" }}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => { setEditingSongId(null); setEditDraft(null); }}
                          className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-500 border border-slate-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={song.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
                    <span className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${avatarBg}`}>
                      <Music className="w-4 h-4" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-slate-800">{song.title}</p>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                          {song.category}
                        </span>
                        {song.youtubeUrl && (
                          <span className="flex items-center gap-1 text-[11px] font-semibold px-1.5 py-0.5 rounded bg-red-50 text-red-600">
                            <Youtube className="w-3 h-3" />
                            YT
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-400 mt-0.5">
                        {song.artist}
                        {song.key && <span> · Key: <span className="font-medium text-slate-500">{song.key}</span></span>}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {song.youtubeUrl ? (
                        <a
                          href={song.youtubeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-red-200 text-red-600"
                        >
                          <Youtube className="w-3.5 h-3.5" />
                          Watch
                        </a>
                      ) : (
                        <span className="text-xs text-slate-300 px-2">No link</span>
                      )}
                      {isAdmin && (
                        <>
                          <button
                            onClick={() => startEditSong(song)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteFromLibrary(song.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-rose-200 text-rose-600"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto px-6 py-16 text-center text-slate-400">
          <p className="text-sm">
            The "{section}" section isn't wired up in this prototype.
          </p>
        </div>
      )}

      {/* Admin login modal */}
      {showLoginModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(15,23,42,0.55)" }}
          onClick={cancelLogin}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="px-6 pt-7 pb-6 text-center"
              style={{ background: "linear-gradient(160deg, #2b4d78, #16304e)" }}
            >
              <div className="relative w-14 h-14 mx-auto mb-3">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: "#e0a63f" }}
                >
                  <Lock className="w-7 h-7 text-white" />
                </div>
                <div
                  className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: "#f0a0c0" }}
                >
                  <KeyRound className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              <p className="text-white font-semibold text-lg leading-tight">Admin Login</p>
              <p className="text-blue-200 text-sm mt-0.5">UCC Cadiz Music Team Hub</p>
            </div>

            <div className="px-6 py-6">
              <p className="text-xs font-semibold text-slate-500 tracking-wide mb-1.5">
                ADMIN PASSWORD
              </p>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (loginError) setLoginError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && submitLogin()}
                  placeholder="Enter admin password..."
                  autoFocus
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-10 py-2.5 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {loginError && (
                <p className="text-xs text-rose-500 mt-1.5">{loginError}</p>
              )}

              <div className="flex gap-3 mt-5">
                <button
                  onClick={cancelLogin}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold border border-slate-200 text-slate-600"
                >
                  Cancel
                </button>
                <button
                  onClick={submitLogin}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white"
                  style={{ background: "#1e3a5f" }}
                >
                  Login
                </button>
              </div>

              <div className="mt-4 flex items-start gap-2 bg-slate-50 rounded-lg px-3 py-2.5">
                <Eye className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-500">
                  Viewing without login? You can see everything — just can't edit.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manage Roles modal */}
      {showRolesModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(15,23,42,0.55)" }}
          onClick={closeRolesModal}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col"
            style={{ maxHeight: "90vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="px-6 py-5 flex items-start justify-between shrink-0"
              style={{ background: "linear-gradient(135deg, #2b4d78, #16304e)" }}
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-5 h-5 text-amber-300" />
                <div>
                  <p className="text-white font-semibold text-lg leading-tight">Manage Roles</p>
                  <p className="text-blue-200 text-sm mt-0.5">
                    Set which roles appear in team scheduling
                  </p>
                </div>
              </div>
              <button
                onClick={closeRolesModal}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="px-6 py-5 overflow-y-auto">
              {/* Active roles */}
              <p className="text-xs font-semibold text-slate-400 tracking-wide mb-2">
                ACTIVE ROLES ({draftRoleDefs.length})
              </p>
              <div className="flex flex-wrap gap-2 mb-5">
                {draftRoleDefs.length === 0 ? (
                  <p className="text-sm text-slate-400">No roles yet — add some below.</p>
                ) : (
                  draftRoleDefs.map((role) => {
                    const Icon = ICON_LIBRARY[role.iconKey] || Music;
                    return (
                      <span
                        key={role.key}
                        className={`flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full border border-slate-200 ${role.bg}`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${role.text}`} />
                        <span className={`text-sm font-medium ${role.text}`}>{role.label}</span>
                        <button
                          onClick={() => removeDraftRole(role.key)}
                          className="w-5 h-5 rounded-full bg-white/70 hover:bg-white flex items-center justify-center ml-0.5"
                        >
                          <X className={`w-3 h-3 ${role.text}`} />
                        </button>
                      </span>
                    );
                  })
                )}
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={roleSearch}
                  onChange={(e) => setRoleSearch(e.target.value)}
                  placeholder="Search instruments..."
                  className="w-full text-sm bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 outline-none"
                />
              </div>

              {/* Suggested roles */}
              {filteredSuggestedRoles.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {filteredSuggestedRoles.map((item) => {
                    const Icon = ICON_LIBRARY[item.iconKey] || Music;
                    return (
                      <button
                        key={item.label}
                        onClick={() => addSuggestedRole(item)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 text-sm font-medium text-slate-600 hover:border-amber-300 hover:bg-amber-50"
                      >
                        <Icon className="w-3.5 h-3.5 text-slate-500" />
                        {item.label}
                        <Plus className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    );
                  })}
                </div>
              )}
              {filteredSuggestedRoles.length === 0 && roleSearch.trim() && (
                <p className="text-sm text-slate-400 mb-5">
                  No matching instruments — add it as a custom role below.
                </p>
              )}

              {/* Add custom role */}
              <p className="text-xs font-semibold text-slate-400 tracking-wide mb-2">
                ADD CUSTOM ROLE
              </p>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-[11px] font-semibold text-slate-400 tracking-wide mb-2">ICON</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {ICON_PICKER_KEYS.map((key) => {
                    const Icon = ICON_LIBRARY[key];
                    const selected = customRoleIconKey === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setCustomRoleIconKey(key)}
                        className="w-9 h-9 rounded-lg flex items-center justify-center bg-white"
                        style={{
                          border: selected ? "2px solid #1e3a5f" : "1px solid #e2e8f0",
                        }}
                      >
                        <Icon className="w-4 h-4 text-slate-600" />
                      </button>
                    );
                  })}
                </div>

                <p className="text-[11px] font-semibold text-slate-400 tracking-wide mb-1.5">
                  ROLE NAME
                </p>
                <input
                  value={customRoleName}
                  onChange={(e) => setCustomRoleName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCustomRole()}
                  placeholder="e.g. Violin, Conga..."
                  className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2.5 outline-none mb-3"
                />

                <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-3">
                  <span>Preview:</span>
                  {(() => {
                    const PreviewIcon = ICON_LIBRARY[customRoleIconKey] || Music;
                    return <PreviewIcon className="w-4 h-4 text-slate-600" />;
                  })()}
                  <span className="font-medium text-slate-700">
                    {customRoleName.trim() || "Your Role"}
                  </span>
                </div>

                <button
                  onClick={addCustomRole}
                  disabled={!customRoleName.trim()}
                  className="w-full py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
                  style={{ background: "#64748b" }}
                >
                  + Add Custom Role
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex gap-3 shrink-0">
              <button
                onClick={closeRolesModal}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold border border-slate-200 text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={saveRoles}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white"
                style={{ background: "#1e3a5f" }}
              >
                Save Roles
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
