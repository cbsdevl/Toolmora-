import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Wrench,
  Search,
  Star,
  History,
  Sparkles,
  FileText,
  Image,
  Type,
  Code,
  GraduationCap,
  Coins,
  RefreshCw,
  Clock,
  ArrowRight,
  ChevronRight,
  BookOpen,
  Settings,
  Mail,
  Shield,
  FileSpreadsheet,
  AlertCircle,
  Share2,
  Check,
  ChevronDown,
  ChevronUp,
  X,
  Menu,
  Sun,
  Moon,
  Youtube,
  Scissors,
  FileImage,
  LayoutGrid,
  Edit3
} from "lucide-react";

import { CategoryItem, ToolItem, BlogPost, SEOSettings } from "./types";
import { CATEGORIES, INITIAL_TOOLS, DEFAULT_BLOGS, DEFAULT_SEO_SETTINGS } from "./data";

// Admin Dashboard import
import AdminDashboard from "./components/AdminDashboard";

// Tools imports
import QRCodeGenerator from "./components/tools/QRCodeGenerator";
import PasswordGenerator from "./components/tools/PasswordGenerator";
import WordCounter from "./components/tools/WordCounter";
import CharacterCounter from "./components/tools/CharacterCounter";
import TextCaseConverter from "./components/tools/TextCaseConverter";
import RemoveDuplicateLines from "./components/tools/RemoveDuplicateLines";
import JSONFormatter from "./components/tools/JSONFormatter";
import Base64Encoder from "./components/tools/Base64Encoder";
import Base64Decoder from "./components/tools/Base64Decoder";
import URLEncoder from "./components/tools/URLEncoder";
import URLDecoder from "./components/tools/URLDecoder";
import UUIDGenerator from "./components/tools/UUIDGenerator";
import ColorPickerTool from "./components/tools/ColorPickerTool";
import BMICalculator from "./components/tools/BMICalculator";
import AgeCalculator from "./components/tools/AgeCalculator";
import PercentageCalculator from "./components/tools/PercentageCalculator";
import BinaryConverter from "./components/tools/BinaryConverter";
import CurrencyConverter from "./components/tools/CurrencyConverter";
import ImageCompressorTool from "./components/tools/ImageCompressorTool";
import ImageResizerTool from "./components/tools/ImageResizerTool";

// PDF tools imports
import PdfMerger from "./components/tools/PdfMerger";
import PdfSplitter from "./components/tools/PdfSplitter";
import ImageToPdf from "./components/tools/ImageToPdf";
import TextToPdf from "./components/tools/TextToPdf";
import PdfPageOrganizer from "./components/tools/PdfPageOrganizer";
import PdfMetadataEditor from "./components/tools/PdfMetadataEditor";

// YouTube tools imports
import YoutubeSeo from "./components/tools/youtube/YoutubeSeo";
import YoutubeThumbnail from "./components/tools/youtube/YoutubeThumbnail";
import YoutubeAnalytics from "./components/tools/youtube/YoutubeAnalytics";

export default function App() {
  // Global States (with localStorage persistence)
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("toolmora_theme");
    if (saved === "light" || saved === "dark") return saved;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  });

  const [tools, setTools] = useState<ToolItem[]>(() => {
    const saved = localStorage.getItem("toolmora_tools");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as ToolItem[];
        // Merge missing default tools from INITIAL_TOOLS into the user's saved list
        const existingIds = new Set(parsed.map((t) => t.id));
        const missingDefaultTools = INITIAL_TOOLS.filter((t) => !existingIds.has(t.id));
        if (missingDefaultTools.length > 0) {
          const merged = [...parsed, ...missingDefaultTools];
          localStorage.setItem("toolmora_tools", JSON.stringify(merged));
          return merged;
        }
        return parsed;
      } catch (e) {
        console.error("Error parsing saved tools", e);
        return INITIAL_TOOLS;
      }
    }
    return INITIAL_TOOLS;
  });

  const [blogs, setBlogs] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem("toolmora_blogs");
    return saved ? JSON.parse(saved) : DEFAULT_BLOGS;
  });

  const [seo, setSeo] = useState<SEOSettings>(() => {
    const saved = localStorage.getItem("toolmora_seo");
    return saved ? JSON.parse(saved) : DEFAULT_SEO_SETTINGS;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("toolmora_favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const [recentlyUsed, setRecentlyUsed] = useState<string[]>(() => {
    const saved = localStorage.getItem("toolmora_recently");
    return saved ? JSON.parse(saved) : [];
  });

  // Navigation states
  const [currentView, setCurrentView] = useState<string>("home");
  const [activeToolId, setActiveToolId] = useState<string>("");
  const [activeBlogSlug, setActiveBlogSlug] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  // Search & Accordion UI states
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  // Admin view access control: hide from public view unless ?admin=true or previously set
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("toolmora_admin") === "true" || new URLSearchParams(window.location.search).has("admin");
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has("admin")) {
        const val = urlParams.get("admin");
        if (val === "false") {
          localStorage.removeItem("toolmora_admin");
          setIsAdminMode(false);
        } else {
          localStorage.setItem("toolmora_admin", "true");
          setIsAdminMode(true);
        }
      }
    }
  }, []);

  // Hash-based client router for SEO routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      
      if (!hash || hash === "#" || hash === "#/") {
        setCurrentView("home");
        setActiveToolId("");
        setActiveBlogSlug("");
        setCategoryFilter("");
      } else if (hash.startsWith("#/tool/")) {
        const toolId = hash.replace("#/tool/", "");
        setCurrentView("tool");
        setActiveToolId(toolId);
        setActiveBlogSlug("");
        setCategoryFilter("");
        
        setRecentlyUsed((prev) => {
          const filtered = prev.filter((id) => id !== toolId);
          return [toolId, ...filtered].slice(0, 4);
        });
        setSearchQuery("");
        setOpenFaqIndex(null);
      } else if (hash.startsWith("#/blog/")) {
        const slug = hash.replace("#/blog/", "");
        setCurrentView("blog-post");
        setActiveBlogSlug(slug);
        setActiveToolId("");
        setCategoryFilter("");
      } else if (hash.startsWith("#/category/")) {
        const catId = hash.replace("#/category/", "");
        setCurrentView("all-tools");
        setCategoryFilter(catId);
        setActiveToolId("");
        setActiveBlogSlug("");
      } else {
        const route = hash.replace("#/", "");
        const validRoutes = [
          "all-tools",
          "categories",
          "blog",
          "about",
          "contact",
          "admin",
          "privacy-policy",
          "terms-of-service",
          "disclaimer"
        ];
        if (validRoutes.includes(route)) {
          setCurrentView(route);
          setActiveToolId("");
          setActiveBlogSlug("");
          if (route !== "all-tools") {
            setCategoryFilter("");
          }
        } else {
          setCurrentView("home");
          setActiveToolId("");
          setActiveBlogSlug("");
          setCategoryFilter("");
        }
      }
    };

    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Sync state to localStorage on modification
  useEffect(() => {
    localStorage.setItem("toolmora_theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("toolmora_tools", JSON.stringify(tools));
  }, [tools]);

  useEffect(() => {
    localStorage.setItem("toolmora_blogs", JSON.stringify(blogs));
  }, [blogs]);

  useEffect(() => {
    localStorage.setItem("toolmora_seo", JSON.stringify(seo));
  }, [seo]);

  useEffect(() => {
    localStorage.setItem("toolmora_favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("toolmora_recently", JSON.stringify(recentlyUsed));
  }, [recentlyUsed]);

  // Dynamic document header title and meta tags modifier for SEO indexability
  useEffect(() => {
    let title = "ToolMora";
    let description = seo.metaDescription || "Free, secure, offline-first client-side web tools. No tracking, no latency.";

    if (currentView === "home") {
      title = seo.metaTitle;
      description = seo.metaDescription;
    } else if (currentView === "tool" && activeToolId) {
      const tool = tools.find((t) => t.id === activeToolId);
      title = tool ? `${tool.name} – Free Online Tool` : "ToolMora";
      description = tool ? `${tool.description} ${tool.detailedDescription.slice(0, 150)}` : description;
    } else if (currentView === "blog") {
      title = "Blog & Security Updates – ToolMora";
      description = "Stay up to date with the latest privacy guides, utility software engineering articles, and search engine optimization guideposts.";
    } else if (currentView === "blog-post" && activeBlogSlug) {
      const post = blogs.find((b) => b.slug === activeBlogSlug);
      title = post ? `${post.title} – ToolMora Blog` : "Blog – ToolMora";
      description = post ? `${post.excerpt}` : description;
    } else {
      const uppercaseName = currentView.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
      title = `${uppercaseName} – ToolMora`;
    }

    document.title = title;

    // Dynamically update/create SEO meta tags
    let metaDescriptionEl = document.querySelector('meta[name="description"]');
    if (!metaDescriptionEl) {
      metaDescriptionEl = document.createElement("meta");
      metaDescriptionEl.setAttribute("name", "description");
      document.head.appendChild(metaDescriptionEl);
    }
    metaDescriptionEl.setAttribute("content", description);

    // Update Open Graph tags for rich social sharing
    const ogTags = {
      "og:title": title,
      "og:description": description,
      "og:type": currentView === "blog-post" ? "article" : "website",
      "og:url": window.location.href,
    };

    Object.entries(ogTags).forEach(([property, content]) => {
      let el = document.querySelector(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", property);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    });
  }, [currentView, activeToolId, activeBlogSlug, seo, tools, blogs]);

  // Utility actions
  const toggleFavorite = (toolId: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setFavorites((prev) =>
      prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId]
    );
  };

  const registerRecentUse = (toolId: string) => {
    setRecentlyUsed((prev) => {
      const filtered = prev.filter((id) => id !== toolId);
      return [toolId, ...filtered].slice(0, 4); // Keep top 4 recent
    });
  };

  const navigateToTool = (toolId: string) => {
    window.location.hash = `#/tool/${toolId}`;
  };

  const navigateToBlog = (slug: string) => {
    window.location.hash = `#/blog/${slug}`;
  };

  const handleShare = (toolName: string) => {
    const shareUrl = `${window.location.origin}/#/tool/${activeToolId}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    });
  };

  // Icon mapping helper
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "Sparkles": return <Sparkles className="w-5 h-5 text-blue-500" />;
      case "FileText": return <FileText className="w-5 h-5 text-amber-500" />;
      case "Image": return <Image className="w-5 h-5 text-emerald-500" />;
      case "Type": return <Type className="w-5 h-5 text-blue-500" />;
      case "Search": return <Search className="w-5 h-5 text-emerald-500" />;
      case "Code": return <Code className="w-5 h-5 text-amber-500" />;
      case "GraduationCap": return <GraduationCap className="w-5 h-5 text-blue-500" />;
      case "Coins": return <Coins className="w-5 h-5 text-emerald-500" />;
      case "RefreshCw": return <RefreshCw className="w-5 h-5 text-amber-500" />;
      default: return <Wrench className="w-5 h-5 text-gray-500" />;
    }
  };

  const getToolIcon = (iconName: string, className = "w-5 h-5") => {
    switch (iconName) {
      case "Youtube": return <Youtube className={`${className} text-red-500`} />;
      case "Search": return <Search className={`${className} text-emerald-500`} />;
      case "Image": return <Image className={`${className} text-blue-500`} />;
      case "QrCode": return <Code className={`${className} text-blue-500`} />;
      case "Key": return <Code className={`${className} text-indigo-500`} />;
      case "FileText": return <FileText className={`${className} text-amber-500`} />;
      case "Scissors": return <Scissors className={`${className} text-rose-500`} />;
      case "FileImage": return <FileImage className={`${className} text-blue-500`} />;
      case "LayoutGrid": return <LayoutGrid className={`${className} text-purple-500`} />;
      case "Edit3": return <Edit3 className={`${className} text-amber-500`} />;
      case "AlignLeft": return <Type className={`${className} text-orange-500`} />;
      case "ALargeSmall": return <Type className={`${className} text-indigo-500`} />;
      case "Filter": return <Type className={`${className} text-purple-500`} />;
      case "Braces": return <Code className={`${className} text-emerald-500`} />;
      case "Lock": return <Code className={`${className} text-amber-500`} />;
      case "Unlock": return <Code className={`${className} text-emerald-500`} />;
      case "CornerDownRight": return <Code className={`${className} text-indigo-500`} />;
      case "CornerDownLeft": return <Code className={`${className} text-purple-500`} />;
      case "Binary": return <Code className={`${className} text-blue-500`} />;
      case "Palette": return <Image className={`${className} text-pink-500`} />;
      case "Activity": return <GraduationCap className={`${className} text-emerald-500`} />;
      case "Calendar": return <GraduationCap className={`${className} text-orange-500`} />;
      case "Percent": return <Coins className={`${className} text-amber-500`} />;
      case "Cpu": return <Code className={`${className} text-indigo-500`} />;
      case "DollarSign": return <Coins className={`${className} text-emerald-500`} />;
      case "ChevronsDown": return <Image className={`${className} text-blue-500`} />;
      case "Maximize": return <Image className={`${className} text-purple-500`} />;
      default: return <Wrench className={`${className} text-gray-500`} />;
    }
  };

  // Search filtering logic
  const filteredTools = tools.filter((t) => {
    const matchesQuery = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter ? t.category === categoryFilter : true;
    return matchesQuery && matchesCategory;
  });

  // Render Tool Router
  const renderSelectedTool = (id: string) => {
    switch (id) {
      case "qr-code-generator": return <QRCodeGenerator />;
      case "password-generator": return <PasswordGenerator />;
      case "word-counter": return <WordCounter />;
      case "character-counter": return <CharacterCounter />;
      case "text-case-converter": return <TextCaseConverter />;
      case "remove-duplicate-lines": return <RemoveDuplicateLines />;
      case "json-formatter": return <JSONFormatter />;
      case "base64-encoder": return <Base64Encoder />;
      case "base64-decoder": return <Base64Decoder />;
      case "url-encoder": return <URLEncoder />;
      case "url-decoder": return <URLDecoder />;
      case "uuid-generator": return <UUIDGenerator />;
      case "color-picker": return <ColorPickerTool />;
      case "bmi-calculator": return <BMICalculator />;
      case "age-calculator": return <AgeCalculator />;
      case "percentage-calculator": return <PercentageCalculator />;
      case "binary-converter": return <BinaryConverter />;
      case "currency-converter": return <CurrencyConverter />;
      case "image-compressor": return <ImageCompressorTool />;
      case "image-resizer": return <ImageResizerTool />;
      case "pdf-merger": return <PdfMerger />;
      case "pdf-splitter": return <PdfSplitter />;
      case "image-to-pdf": return <ImageToPdf />;
      case "text-to-pdf": return <TextToPdf />;
      case "pdf-page-organizer": return <PdfPageOrganizer />;
      case "pdf-metadata-editor": return <PdfMetadataEditor />;
      case "youtube-seo": return <YoutubeSeo />;
      case "youtube-thumbnail": return <YoutubeThumbnail />;
      case "youtube-analytics": return <YoutubeAnalytics />;
      default: return <div className="text-gray-600 dark:text-gray-400 text-center py-8">Component coming soon!</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-gray-950 flex flex-col font-sans antialiased text-gray-800 dark:text-gray-100 transition-colors duration-150">
      
      {/* 1. GOOGLE ADSENSE PLACEHOLDER (HEADER BANNER) */}
      <div className="w-full bg-gray-100 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800 text-center py-2.5 px-4 text-[10px] text-gray-600 dark:text-gray-400 font-semibold tracking-wider flex flex-col sm:flex-row justify-center items-center gap-1">
        <span>SPONSORED LINK ADVERTISEMENT:</span>
        <span className="bg-white dark:bg-gray-800 px-2 py-0.5 rounded shadow-sm border border-gray-200 dark:border-gray-700 text-blue-500 dark:text-blue-400 font-mono text-[9px]">
          [728x90 Google AdSense Responsive Leaderboard Banner Position]
        </span>
      </div>

      {/* 2. MAIN HEADER NAVIGATION */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm" id="toolmora-nav-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          
          {/* Logo Brand */}
          <a
            href="#/"
            className="flex items-center gap-2.5 group cursor-pointer text-current decoration-none"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white transition duration-150 group-hover:scale-105 shadow-sm shadow-blue-500/20">
              <Wrench className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="font-extrabold text-lg text-gray-900 dark:text-white tracking-tight block">ToolMora</span>
              <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 tracking-wide uppercase -mt-1 block">One Place. Every Tool.</span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-600 dark:text-gray-300">
            <a
              href="#/"
              className={`hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer py-1.5 ${currentView === "home" ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400" : ""}`}
            >
              Home
            </a>
            <a
              href="#/all-tools"
              className={`hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer py-1.5 ${currentView === "all-tools" ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400" : ""}`}
            >
              All Tools
            </a>
            <a
              href="#/categories"
              className={`hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer py-1.5 ${currentView === "categories" ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400" : ""}`}
            >
              Categories
            </a>
            <a
              href="#/blog"
              className={`hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer py-1.5 ${currentView === "blog" ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400" : ""}`}
            >
              Blog
            </a>
            {isAdminMode && (
              <a
                href="#/admin"
                className={`flex items-center gap-1.5 px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition text-xs font-bold cursor-pointer ${currentView === "admin" ? "bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800" : ""}`}
              >
                <Settings className="w-3.5 h-3.5" />
                Admin
              </a>
            )}
            
            {/* Desktop Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition cursor-pointer relative overflow-hidden"
              aria-label="Toggle Theme"
              id="theme-toggle-desktop"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme}
                  initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="flex items-center justify-center"
                >
                  {theme === "light" ? <Moon className="w-4 h-4 text-gray-600" /> : <Sun className="w-4 h-4 text-amber-400" />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </nav>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-3">
            {/* Mobile Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition cursor-pointer relative overflow-hidden"
              aria-label="Toggle Theme"
              id="theme-toggle-mobile"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme}
                  initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="flex items-center justify-center"
                >
                  {theme === "light" ? <Moon className="w-4 h-4 text-gray-600" /> : <Sun className="w-4 h-4 text-amber-400" />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile dropdown panel */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 py-3 px-4 space-y-2.5 text-sm font-bold shadow-inner">
            <a
              href="#/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block w-full text-left py-2 px-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg ${currentView === "home" ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-200"}`}
            >
              Home
            </a>
            <a
              href="#/all-tools"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full text-left py-2 px-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-200"
            >
              All Tools
            </a>
            <a
              href="#/categories"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full text-left py-2 px-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-200"
            >
              Categories
            </a>
            <a
              href="#/blog"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full text-left py-2 px-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-200"
            >
              Blog
            </a>
            {isAdminMode && (
              <a
                href="#/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-left py-2 px-3 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Admin Dashboard
              </a>
            )}
          </div>
        )}
      </header>

      {/* 3. MAIN CONTAINER BODY */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8" id="toolmora-main-content">
        
        {/* VIEW A: HOME VIEW */}
        {currentView === "home" && (
          <div className="space-y-12">
            
            {/* HERO SECTION */}
            <section className="text-center py-10 space-y-6" id="home-hero">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-full text-blue-700 dark:text-blue-400 text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 animate-bounce" />
                <span>20 Free, Secure Offline Utilities</span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-black text-gray-900 dark:text-white tracking-tight leading-none max-w-3xl mx-auto">
                One Place. <span className="text-blue-600 dark:text-blue-400 bg-clip-text">Every Tool.</span>
              </h1>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                ToolMora provides high-speed, client-side online tools for students, creators, and developers. No file limits, 100% private.
              </p>

              {/* SEARCH BOX WITH AUTOCOMPLETE */}
              <div className="max-w-xl mx-auto relative group">
                <div className="relative">
                  <input
                    type="text"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 shadow-sm transition group-hover:border-gray-300 dark:group-hover:border-gray-700 text-sm font-sans text-gray-900 dark:text-white"
                    placeholder="Search over 20+ free utility calculators, formatted tools..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="w-5.5 h-5.5 text-gray-600 dark:text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Autocomplete suggestions dropdown */}
                {searchQuery && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden z-40 max-h-72 overflow-y-auto text-left py-2">
                    {filteredTools.length > 0 ? (
                      filteredTools.map((tool) => (
                        <button
                          key={tool.id}
                          onClick={() => navigateToTool(tool.id)}
                          className="w-full px-4 py-2.5 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 flex items-center gap-3 transition text-sm cursor-pointer"
                        >
                          {getToolIcon(tool.icon, "w-4 h-4 flex-shrink-0")}
                          <div className="truncate">
                            <span className="font-bold text-gray-800 dark:text-gray-100 block">{tool.name}</span>
                            <span className="text-xs text-gray-600 dark:text-gray-400 truncate block">{tool.description}</span>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-4 text-center text-xs text-gray-600 dark:text-gray-400 font-medium">
                        No matches found. Try "QR", "Image" or "JSON".
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Popular quick-jump chips */}
              <div className="flex flex-wrap gap-2 justify-center text-xs font-semibold text-gray-600 dark:text-gray-400">
                <span>Popular jump:</span>
                {tools.slice(0, 4).map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => navigateToTool(tool.id)}
                    className="hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 border border-gray-200 dark:border-gray-800 rounded-full px-2.5 py-0.5 cursor-pointer bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 transition"
                  >
                    {tool.name}
                  </button>
                ))}
              </div>
            </section>

            {/* AD BANNER: HEADER RECTANGLE */}
            <div className="max-w-4xl mx-auto bg-gray-100 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl py-3 px-4 text-center text-[10px] text-gray-600 dark:text-gray-400 font-bold">
              [AD POSITION: 970x250 Large Google AdSense Top Content Billboard]
            </div>

            {/* SECTION: FAVORITES (ONLY SHOWN IF ADDED) */}
            {favorites.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <h3 className="text-base font-extrabold text-gray-900 dark:text-white tracking-tight">Your Starred Favorites</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {tools
                    .filter((t) => favorites.includes(t.id))
                    .map((tool) => (
                      <a
                        key={tool.id}
                        href={`#/tool/${tool.id}`}
                        className="p-4 bg-white dark:bg-gray-900 hover:bg-slate-50/50 dark:hover:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm text-left relative group transition duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 block text-current no-underline"
                      >
                        <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center mb-3">
                          {getToolIcon(tool.icon)}
                        </div>
                        <h4 className="font-bold text-sm text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition truncate pr-6">{tool.name}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mt-1 leading-relaxed">{tool.description}</p>
                        <button
                          onClick={(e) => toggleFavorite(tool.id, e)}
                          className="absolute top-4 right-4 p-1 rounded-full text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/50 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        >
                          <Star className="w-4 h-4 fill-amber-500" />
                        </button>
                      </a>
                    ))}
                </div>
              </section>
            )}

            {/* SECTION: RECENTLY USED */}
            {recentlyUsed.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-blue-500" />
                  <h3 className="text-base font-extrabold text-gray-900 dark:text-white tracking-tight">Recently Visited Tools</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {tools
                    .filter((t) => recentlyUsed.includes(t.id))
                    .slice(0, 4)
                    .map((tool) => (
                      <a
                        key={tool.id}
                        href={`#/tool/${tool.id}`}
                        className="p-4 bg-white dark:bg-gray-900 hover:bg-slate-50/50 dark:hover:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm text-left group transition duration-150 cursor-pointer block text-current no-underline"
                      >
                        <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center mb-3">
                          {getToolIcon(tool.icon)}
                        </div>
                        <h4 className="font-bold text-sm text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition truncate">{tool.name}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mt-1 leading-relaxed">{tool.description}</p>
                      </a>
                    ))}
                </div>
              </section>
            )}

            {/* CATEGORIES GRID */}
            <section className="space-y-6">
              <div className="text-center max-w-lg mx-auto">
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">Explore Categories</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Sift through our tailored compartments to find target utilities instantly.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {CATEGORIES.map((cat) => {
                  const count = tools.filter((t) => t.category === cat.id).length;
                  return (
                    <a
                      key={cat.id}
                      href={`#/category/${cat.id}`}
                      className="p-5 bg-white dark:bg-gray-900 hover:bg-slate-50/50 dark:hover:bg-gray-800/50 border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 rounded-2xl shadow-sm text-left flex items-start gap-4 transition duration-150 group cursor-pointer block text-current no-underline"
                    >
                      <div className="w-11 h-11 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition">
                        {getCategoryIcon(cat.icon)}
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-sm text-gray-900 dark:text-white block group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">{cat.name}</span>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">{cat.description}</p>
                        <span className="inline-block mt-2 px-2 py-0.5 bg-blue-50/50 dark:bg-blue-950/40 text-[10px] font-bold text-blue-700 dark:text-blue-300 rounded-full">
                          {count} fully active tools
                        </span>
                      </div>
                    </a>
                  );
                })}
              </div>
            </section>

            {/* POPULAR TOOLS */}
            <section className="space-y-6">
              <div className="text-center max-w-lg mx-auto">
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">Featured Popular Utilities</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">High-end developer formatting, image compressors, and password vaults.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
                {tools
                  .filter((t) => t.isPopular)
                  .map((tool) => (
                    <a
                      key={tool.id}
                      href={`#/tool/${tool.id}`}
                      className="p-5 bg-white dark:bg-gray-900 hover:bg-slate-50/50 dark:hover:bg-gray-800/50 border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 rounded-2xl shadow-sm text-left relative group transition duration-150 flex flex-col justify-between h-48 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 block text-current no-underline"
                    >
                      <div>
                        <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition">
                          {getToolIcon(tool.icon)}
                        </div>
                        <h4 className="font-extrabold text-sm text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition truncate pr-6">
                          {tool.name}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mt-1 leading-relaxed">
                          {tool.description}
                        </p>
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-gray-50 dark:border-gray-800 mt-2 text-[10px] font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition duration-150">
                        <span>Launch Tool</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>

                      <button
                        onClick={(e) => toggleFavorite(tool.id, e)}
                        className="absolute top-4 right-4 p-1.5 rounded-full text-gray-300 dark:text-gray-600 hover:text-amber-500 dark:hover:text-amber-400 transition focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <Star className={`w-4 h-4 ${favorites.includes(tool.id) ? "text-amber-500 fill-amber-500" : ""}`} />
                      </button>
                    </a>
                  ))}
              </div>
            </section>

            {/* AD BANNER: BETWEEN CONTENT MIDDLE */}
            <div className="max-w-4xl mx-auto bg-gray-100 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl py-3 px-4 text-center text-[10px] text-gray-600 dark:text-gray-400 font-bold">
              [AD POSITION: 300x250 Google AdSense Rectangular In-Content Grid Block]
            </div>

          </div>
        )}

        {/* VIEW B: ALL TOOLS VIEW */}
        {currentView === "all-tools" && (
          <div className="space-y-6">
            
            {/* Header filters */}
            <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-extrabold text-gray-900 dark:text-white tracking-tight">All Online Tools ({filteredTools.length})</h2>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Search, filter, star and launch any of our 20+ active utility services.</p>
                </div>

                <div className="relative max-w-xs w-full">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 dark:text-white"
                    placeholder="Search tools list..."
                  />
                  <Search className="w-4 h-4 text-gray-600 dark:text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Category pills */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-50 dark:border-gray-800">
                <a
                  href="#/all-tools"
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
                    categoryFilter === ""
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  All Categories
                </a>
                {CATEGORIES.map((cat) => (
                  <a
                    key={cat.id}
                    href={`#/category/${cat.id}`}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
                      categoryFilter === cat.id
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    {cat.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Grid display */}
            {filteredTools.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredTools.map((tool) => (
                  <a
                    key={tool.id}
                    href={`#/tool/${tool.id}`}
                    className="p-5 bg-white dark:bg-gray-900 hover:bg-slate-50/50 dark:hover:bg-gray-800/50 border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 rounded-2xl shadow-sm text-left relative group transition duration-150 flex flex-col justify-between h-48 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 block text-current no-underline"
                  >
                    <div>
                      <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center mb-3">
                        {getToolIcon(tool.icon)}
                      </div>
                      <h4 className="font-extrabold text-sm text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition truncate pr-6">
                        {tool.name}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mt-1 leading-relaxed">
                        {tool.description}
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-gray-50 dark:border-gray-800 mt-2 text-[10px] font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition duration-150">
                      <span>Launch Tool</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>

                    <button
                      onClick={(e) => toggleFavorite(tool.id, e)}
                      className="absolute top-4 right-4 p-1.5 rounded-full text-gray-300 dark:text-gray-600 hover:text-amber-500 dark:hover:text-amber-400 transition focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <Star className={`w-4 h-4 ${favorites.includes(tool.id) ? "text-amber-500 fill-amber-500" : ""}`} />
                    </button>
                  </a>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl py-12 text-center text-gray-600 dark:text-gray-400 text-sm">
                No tools match your query criteria.
              </div>
            )}
          </div>
        )}

        {/* VIEW C: CATEGORIES VIEW */}
        {currentView === "categories" && (
          <div className="space-y-8">
            <div className="text-center max-w-lg mx-auto space-y-2">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Browse Utility Compartments</h2>
              <p className="text-xs text-gray-600 dark:text-gray-400">Discover tools categorized by professional application and student study requirements.</p>
            </div>

            <div className="space-y-10">
              {CATEGORIES.map((cat) => {
                const list = tools.filter((t) => t.category === cat.id);
                if (list.length === 0) return null;

                return (
                  <div key={cat.id} className="space-y-3.5">
                    <div className="flex items-center gap-2.5 border-b border-gray-100 dark:border-gray-800 pb-2">
                      <div className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg">{getCategoryIcon(cat.icon)}</div>
                      <h3 className="font-extrabold text-gray-800 dark:text-gray-100 text-sm">{cat.name}</h3>
                      <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400">({list.length} tools)</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {list.map((tool) => (
                        <a
                          key={tool.id}
                          href={`#/tool/${tool.id}`}
                          className="p-4 bg-white dark:bg-gray-900 hover:bg-slate-50/50 dark:hover:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-xl shadow-sm text-left group transition cursor-pointer block text-current no-underline"
                        >
                          <span className="font-bold text-xs text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 block transition truncate">{tool.name}</span>
                          <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">{tool.description}</p>
                        </a>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW D: INDIVIDUAL TOOL LAYOUT (SEO & FAQ ENHANCED) */}
        {currentView === "tool" && activeToolId && (
          (() => {
            const tool = tools.find((t) => t.id === activeToolId);
            if (!tool) return <div className="text-center py-12 text-gray-600 dark:text-gray-400">Tool not found.</div>;

            // Related tools logic (same category excluding self)
            const related = tools.filter((t) => t.category === tool.category && t.id !== tool.id).slice(0, 3);

            return (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                
                {/* Center / Left Panel: Tool & SEO Details */}
                <div className="lg:col-span-3 space-y-8">
                  
                  {/* BREADCRUMBS */}
                  <nav className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 font-semibold mb-2">
                    <a href="#/" className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">Home</a>
                    <ChevronRight className="w-3 h-3" />
                    <a
                      href={`#/category/${tool.category}`}
                      className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer truncate max-w-[120px] sm:max-w-none"
                    >
                      {CATEGORIES.find((c) => c.id === tool.category)?.name || "Tools"}
                    </a>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-gray-600 dark:text-gray-300 truncate max-w-[150px] sm:max-w-none">{tool.name}</span>
                  </nav>

                  {/* HEADER SUMMARY PANEL */}
                  <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start sm:items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-xl flex items-center justify-center flex-shrink-0">
                        {getToolIcon(tool.icon, "w-6 h-6")}
                      </div>
                      <div>
                        <h2 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">{tool.name}</h2>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{tool.description}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => toggleFavorite(tool.id)}
                        className={`flex items-center gap-1.5 px-3.5 py-2 border rounded-xl text-xs font-bold transition cursor-pointer ${
                          favorites.includes(tool.id)
                            ? "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-400"
                            : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
                        }`}
                      >
                        <Star className={`w-4 h-4 ${favorites.includes(tool.id) ? "fill-amber-500 text-amber-500" : ""}`} />
                        <span>{favorites.includes(tool.id) ? "Favorite" : "Star"}</span>
                      </button>

                      <button
                        onClick={() => handleShare(tool.name)}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-850 text-gray-600 dark:text-gray-300 rounded-xl text-xs font-bold transition cursor-pointer relative"
                      >
                        {shareCopied ? (
                          <>
                            <Check className="w-4 h-4 text-green-500" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="w-4 h-4" />
                            <span>Share</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* ACTIVE COMPONENT STAGE */}
                  <div className="animate-fade-in" id="active-tool-workspace">
                    {renderSelectedTool(tool.id)}
                  </div>

                  {/* SEO DETAILED DESCRIPTION BLOCK */}
                  <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
                    <h3 className="text-sm font-extrabold text-gray-800 dark:text-gray-100 uppercase tracking-wider">How to use our free {tool.name} online?</h3>
                    <div className="prose prose-sm text-xs text-gray-600 dark:text-gray-400 leading-relaxed space-y-3">
                      <p>{tool.detailedDescription}</p>
                      <p>Our online services are configured to run with high-entropy cryptographic security or canvas modules operating 100% inside your memory context. This guarantees that your proprietary data, codes, coordinates or text inputs are never dispatched to remote servers, preventing structural leaks.</p>
                    </div>
                  </div>

                  {/* FAQ ACCORDION SECTION */}
                  <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
                    <h3 className="text-sm font-extrabold text-gray-800 dark:text-gray-100 uppercase tracking-wider">Frequently Asked Questions (FAQ)</h3>
                    <div className="space-y-3">
                      {tool.faqs.map((faq, index) => (
                        <div key={index} className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
                          <button
                            onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                            className="w-full text-left p-4 bg-gray-50/50 dark:bg-gray-850/50 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition flex justify-between items-center text-xs font-bold text-gray-700 dark:text-gray-300 cursor-pointer"
                          >
                            <span>{faq.question}</span>
                            {openFaqIndex === index ? <ChevronUp className="w-4 h-4 text-gray-600 dark:text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />}
                          </button>
                          {openFaqIndex === index && (
                            <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-50 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-400 leading-relaxed animate-slide-down">
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Right Panel: AdSense & Related Tools */}
                <div className="lg:col-span-1 space-y-6">
                  
                  {/* GOOGLE ADSENSE: SIDEBAR BLOCK */}
                  <div className="bg-gray-100 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 text-center min-h-[250px] flex flex-col justify-between items-center text-[10px] text-gray-600 dark:text-gray-400 font-bold">
                    <span>SPONSORED SIDEBAR BANNER</span>
                    <div className="bg-white dark:bg-gray-800 px-3 py-4 rounded shadow-sm border border-gray-200 dark:border-gray-700 text-blue-500 dark:text-blue-400 font-mono my-4 text-[9px] w-full">
                      [300x600 Google AdSense Responsive SkyScraper ad position]
                    </div>
                    <span>Sponsored Content</span>
                  </div>

                  {/* RELATED TOOLS */}
                  {related.length > 0 && (
                    <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
                      <span className="text-xs font-extrabold text-gray-800 dark:text-gray-100 uppercase tracking-wider block">Related Tools</span>
                      <div className="space-y-3">
                        {related.map((rt) => (
                          <a
                            key={rt.id}
                            href={`#/tool/${rt.id}`}
                            className="w-full text-left p-3 hover:bg-slate-50/50 dark:hover:bg-gray-800/50 rounded-xl border border-gray-50 dark:border-gray-800/50 transition flex items-center gap-3 cursor-pointer group block text-current no-underline"
                          >
                            <div className="w-8 h-8 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                              {getToolIcon(rt.icon, "w-4 h-4")}
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="font-bold text-xs text-gray-800 dark:text-gray-100 block truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">{rt.name}</span>
                              <span className="text-[10px] text-gray-600 dark:text-gray-400 truncate block">{rt.description}</span>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

              </div>
            );
          })()
        )}

        {/* VIEW E: BLOG LIST VIEW */}
        {currentView === "blog" && (
          <div className="space-y-8">
            <div className="text-center max-w-lg mx-auto space-y-2">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center justify-center gap-2">
                <BookOpen className="w-6 h-6 text-blue-500" />
                Blog & Security Updates
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-400">Technical insights on privacy systems, web tools utility engineering and SEO guides.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogs.map((post) => (
                <div key={post.id} className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between hover:shadow-md transition duration-150">
                  <div className="p-5 space-y-3.5">
                    <div className="flex justify-between items-center text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      <span>{post.category}</span>
                      <span>{post.readTime}</span>
                    </div>

                    <a
                      href={`#/blog/${post.slug}`}
                      className="text-base font-extrabold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition tracking-tight cursor-pointer leading-snug line-clamp-2 block text-current no-underline"
                    >
                      {post.title}
                    </a>

                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">{post.excerpt}</p>
                  </div>

                  <div className="p-5 border-t border-gray-50 dark:border-gray-800 bg-gray-50/25 dark:bg-gray-900/50 flex justify-between items-center text-xs">
                    <span className="font-semibold text-gray-600 dark:text-gray-300">by {post.author}</span>
                    <a
                      href={`#/blog/${post.slug}`}
                      className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 cursor-pointer no-underline"
                    >
                      Read post
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW F: BLOG POST DETAIL VIEW */}
        {currentView === "blog-post" && activeBlogSlug && (
          (() => {
            const post = blogs.find((b) => b.slug === activeBlogSlug);
            if (!post) return <div className="text-center py-12 text-gray-600 dark:text-gray-400">Article not found.</div>;

            return (
              <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-10 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
                
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 font-semibold">
                  <a href="#/" className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">Home</a>
                  <ChevronRight className="w-3 h-3" />
                  <a href="#/blog" className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">Blog</a>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-gray-600 dark:text-gray-300 truncate">{post.title}</span>
                </nav>

                <div className="space-y-3 border-b border-gray-100 dark:border-gray-800 pb-5">
                  <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block">
                    {post.category}
                  </span>
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">{post.title}</h1>
                  
                  <div className="flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400 font-semibold pt-1">
                    <span>By {post.author}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>

                {/* Article content */}
                <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed space-y-4 whitespace-pre-wrap font-sans">
                  {post.content}
                </div>

                {/* Keywords Tags list */}
                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-gray-50 dark:border-gray-800">
                  {post.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-[10px] font-bold text-gray-600 dark:text-gray-400 font-mono">
                      #{tag}
                    </span>
                  ))}
                </div>

              </div>
            );
          })()
        )}

        {/* VIEW G: ADMIN DASHBOARD */}
        {currentView === "admin" && (
          isAdminMode ? (
            <div className="space-y-6">
              <div className="text-center max-w-lg mx-auto">
                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center justify-center gap-2">
                  <Settings className="w-6 h-6 text-blue-500 animate-spin-slow" />
                  ToolMora Sandbox Console
                </h2>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Simulate real-time full-stack parameters including metadata setups and live post blogs.</p>
              </div>

              <AdminDashboard
                tools={tools}
                setTools={setTools}
                blogs={blogs}
                setBlogs={setBlogs}
                seo={seo}
                setSeo={setSeo}
                categories={CATEGORIES}
              />
            </div>
          ) : (
            <div className="text-center py-20 space-y-4">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Page Not Found</h2>
              <p className="text-xs text-gray-600 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">The requested resource could not be found or you do not have permission to access this section.</p>
              <button
                onClick={() => setCurrentView("home")}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer transition inline-block shadow-sm"
              >
                Back to Home
              </button>
            </div>
          )
        )}

        {/* VIEW H: ABOUT PAGE */}
        {currentView === "about" && (
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight border-b border-gray-100 dark:border-gray-800 pb-3">About ToolMora</h1>
            <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed space-y-4">
              <p>ToolMora was established with a singular objective: <strong>"One Place. Every Tool."</strong> We aim to provide students, researchers, developers, copywriters, and daily internet browsers with instant, high-speed online solutions absolutely free of charge.</p>
              <p>Historically, converting formats, formatting JSON payloads, or compressing PNG files required uploading your confidential content to remote clouds. This posed extensive bandwidth constraints and massive data leakage exposures.</p>
              <p>ToolMora leverages modern web browsers to run 100% of these algorithms client-side. Using HTML5 canvas encoders, cryptographic arrays, and standard math functions, your inputs never leave your device context. This is high-speed processing, high security, and offline support combined.</p>
            </div>
          </div>
        )}

        {/* VIEW I: CONTACT PAGE */}
        {currentView === "contact" && (
          <div className="max-w-xl mx-auto bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
            <div>
              <h1 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">Contact ToolMora Support</h1>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Submit bug reports, request new utility calculators, or discuss monetization deals.</p>
            </div>

            {contactSuccess ? (
              <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900 text-green-700 dark:text-green-300 rounded-xl flex items-center gap-3 text-xs font-bold animate-fade-in">
                <Check className="w-5 h-5 text-green-500" />
                <span>Message received! Our web admins will review and get back to you shortly.</span>
              </div>
            ) : (
              <form
                onSubmit={(e) => { e.preventDefault(); setContactSuccess(true); }}
                className="space-y-4 text-xs font-semibold text-gray-600 dark:text-gray-300"
              >
                <div>
                  <label className="block mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-850 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-850 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block mb-1.5 font-bold">Message Content</label>
                  <textarea
                    rows={4}
                    required
                    className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-800 outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-850 text-gray-900 dark:text-white font-sans text-xs"
                    placeholder="Describe how we can assist you..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition shadow-sm cursor-pointer"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        )}

        {/* VIEW J: PRIVACY POLICY */}
        {currentView === "privacy-policy" && (
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6 text-sm text-gray-600 dark:text-gray-300">
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight border-b border-gray-100 dark:border-gray-800 pb-3">Privacy Policy</h1>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-bold -mt-2">Last Updated: July 8, 2026</p>
            <div className="space-y-4 leading-relaxed">
              <p>At ToolMora, protecting visitor privacy is our primary priority. We do NOT retain files, images, code lines, or text inputs that you paste or drag into our utilities. All processing, calculations, compressing, and formatting are completed entirely locally within your browser context.</p>
              <h3 className="font-extrabold text-gray-800 dark:text-gray-100 text-base mt-4">1. Information Collection</h3>
              <p>We do not require account registrations or logs to access our free tools. We do not gather or transmit data from your uploaded files, coordinates, or inputs.</p>
              <h3 className="font-extrabold text-gray-800 dark:text-gray-100 text-base mt-4">2. Cookies & Third-Party Advertisement</h3>
              <p>We employ standard analytical tools to review traffic. Long-term AdSense vendors may place cookies on your browser to deliver tailored advertisements. You may opt to disable cookies via your specific web browser configurations.</p>
            </div>
          </div>
        )}

        {/* VIEW K: TERMS OF SERVICE */}
        {currentView === "terms-of-service" && (
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6 text-sm text-gray-600 dark:text-gray-300">
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight border-b border-gray-100 dark:border-gray-800 pb-3">Terms of Service</h1>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-bold -mt-2">Last Updated: July 8, 2026</p>
            <div className="space-y-4 leading-relaxed">
              <p>By accessing and utilizing ToolMora services, you agree to comply with standard internet safety terms and compliance structures described below.</p>
              <h3 className="font-extrabold text-gray-800 dark:text-gray-100 text-base mt-4">1. License of Use</h3>
              <p>Permission is granted to utilize any of our 20+ active online utility tools for personal, academic, or commercial professional objectives. You are strictly prohibited from automating requests to disrupt platform availability.</p>
              <h3 className="font-extrabold text-gray-800 dark:text-gray-100 text-base mt-4">2. Service Modifications</h3>
              <p>We reserve the right to modify, adjust, or retire tools, calculators, or layouts at any time without issuing prior warning.</p>
            </div>
          </div>
        )}

        {/* VIEW L: DISCLAIMER */}
        {currentView === "disclaimer" && (
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6 text-sm text-gray-600 dark:text-gray-300">
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight border-b border-gray-100 dark:border-gray-800 pb-3">Disclaimer</h1>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-bold -mt-2">Last Updated: July 8, 2026</p>
            <div className="space-y-4 leading-relaxed">
              <p>The materials, calculations, metrics, and conversion utilities listed on ToolMora are delivered on an "as is" and "as available" basis, without expressing warranties or guarantees of any kind.</p>
              <h3 className="font-extrabold text-gray-800 dark:text-gray-100 text-base mt-4">No Medical or Financial Advice</h3>
              <p>The outputs generated by health calculators (like the BMI Calculator) or financial percentage structures are formulated for baselines and general reference purposes only. They must never be treated as direct medical diagnostics or professional financial counsel. Consult certified doctors or certified financial brokers before implementing substantial modifications to your routine.</p>
            </div>
          </div>
        )}

      </main>

      {/* 4. GOOGLE ADSENSE: FOOTER LEADERBOARD PLACEHOLDER */}
      <div className="w-full bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 py-4 px-4 text-center text-[10px] text-gray-600 dark:text-gray-400 font-semibold flex flex-col items-center justify-center gap-2">
        <span>SPONSORED LINK ADVERTISEMENT</span>
        <div className="bg-gray-50 dark:bg-gray-900 px-3 py-3 rounded border border-gray-100 dark:border-gray-800 text-blue-500 dark:text-blue-400 font-mono text-[9px] max-w-4xl w-full">
          [728x90 Google AdSense Footer Responsive Banner Placement Position]
        </div>
      </div>

      {/* 5. MAIN SITE FOOTER */}
      <footer className="bg-gray-950 text-gray-600 dark:text-gray-400 py-12 border-t border-gray-900" id="toolmora-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo & Slogan */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white">
              <Wrench className="w-5 h-5 text-blue-500" />
              <span className="font-extrabold text-base tracking-tight">ToolMora</span>
            </div>
            <p className="text-xs leading-relaxed">
              Free, modern, secure client-side utility tools. No file logs, no network delays. Beautiful and lightweight.
            </p>
            <span className="block text-[10px] text-gray-600">© 2026 ToolMora Inc. All Rights Reserved.</span>
          </div>

          {/* Quick jump to tools */}
          <div className="space-y-3 text-xs">
            <span className="font-bold text-white uppercase tracking-wider block">Quick Jump Tools</span>
            <div className="grid grid-cols-1 gap-2">
              <a href="#/tool/qr-code-generator" className="text-left hover:text-white transition">QR Code Generator</a>
              <a href="#/tool/password-generator" className="text-left hover:text-white transition">Secure Passwords</a>
              <a href="#/tool/image-compressor" className="text-left hover:text-white transition">Image Compressor</a>
              <a href="#/tool/color-picker" className="text-left hover:text-white transition">Designer Color Picker</a>
            </div>
          </div>

          {/* Utility routing */}
          <div className="space-y-3 text-xs">
            <span className="font-bold text-white uppercase tracking-wider block">Company Resources</span>
            <div className="grid grid-cols-1 gap-2">
              <a href="#/about" className="text-left hover:text-white transition">About ToolMora</a>
              <a href="#/blog" className="text-left hover:text-white transition">SEO & Tech Blog</a>
              <a href="#/contact" className="text-left hover:text-white transition">Support & Contact</a>
              {isAdminMode && (
                <a href="#/admin" className="text-left hover:text-white transition">AdSense Sandbox console</a>
              )}
            </div>
          </div>

          {/* Compliance policies */}
          <div className="space-y-3 text-xs">
            <span className="font-bold text-white uppercase tracking-wider block">Compliances & Terms</span>
            <div className="grid grid-cols-1 gap-2">
              <a href="#/privacy-policy" className="text-left hover:text-white transition">Privacy Policy</a>
              <a href="#/terms-of-service" className="text-left hover:text-white transition">Terms of Service</a>
              <a href="#/disclaimer" className="text-left hover:text-white transition">System Disclaimer</a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
