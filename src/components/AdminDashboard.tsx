import React, { useState } from "react";
import { ToolItem, BlogPost, CategoryItem, SEOSettings } from "../types";
import { Settings, FileText, LayoutGrid, Check, Plus, Trash2, Edit2, ShieldAlert } from "lucide-react";

interface AdminDashboardProps {
  tools: ToolItem[];
  setTools: React.Dispatch<React.SetStateAction<ToolItem[]>>;
  blogs: BlogPost[];
  setBlogs: React.Dispatch<React.SetStateAction<BlogPost[]>>;
  seo: SEOSettings;
  setSeo: React.Dispatch<React.SetStateAction<SEOSettings>>;
  categories: CategoryItem[];
}

export default function AdminDashboard({
  tools,
  setTools,
  blogs,
  setBlogs,
  seo,
  setSeo,
  categories
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"tools" | "blogs" | "seo">("tools");
  
  // Blog Form States
  const [newTitle, setNewTitle] = useState("");
  const [newExcerpt, setNewExcerpt] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newAuthor, setNewAuthor] = useState("Elena Vance");
  const [newCategory, setNewCategory] = useState("Text Tools");
  const [newTags, setNewTags] = useState("Productivity, Tools");
  const [blogSuccess, setBlogSuccess] = useState(false);

  // SEO Form States
  const [metaTitle, setMetaTitle] = useState(seo.metaTitle);
  const [metaDesc, setMetaDesc] = useState(seo.metaDescription);
  const [keywords, setKeywords] = useState(seo.keywords);
  const [robots, setRobots] = useState(seo.robotsTxt);
  const [sitemap, setSitemap] = useState(seo.sitemapXml);
  const [seoSuccess, setSeoSuccess] = useState(false);

  // Tool Edit States
  const [editingToolId, setEditingToolId] = useState<string | null>(null);
  const [editToolName, setEditToolName] = useState("");
  const [editToolDesc, setEditToolDesc] = useState("");

  const handleAddBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    const post: BlogPost = {
      id: Date.now().toString(),
      title: newTitle,
      slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      content: newContent,
      excerpt: newExcerpt || newContent.slice(0, 150) + "...",
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      author: newAuthor,
      category: newCategory,
      readTime: `${Math.max(1, Math.ceil(newContent.split(/\s+/).length / 200))} min read`,
      tags: newTags.split(",").map(t => t.trim()).filter(Boolean)
    };

    setBlogs([post, ...blogs]);
    setNewTitle("");
    setNewExcerpt("");
    setNewContent("");
    setBlogSuccess(true);
    setTimeout(() => setBlogSuccess(false), 3000);
  };

  const handleDeleteBlog = (id: string) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      setBlogs(blogs.filter(b => b.id !== id));
    }
  };

  const handleSaveSEO = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SEOSettings = {
      metaTitle,
      metaDescription: metaDesc,
      keywords,
      robotsTxt: robots,
      sitemapXml: sitemap
    };
    setSeo(updated);
    setSeoSuccess(true);
    setTimeout(() => setSeoSuccess(false), 3000);
  };

  const handleStartEditTool = (tool: ToolItem) => {
    setEditingToolId(tool.id);
    setEditToolName(tool.name);
    setEditToolDesc(tool.description);
  };

  const handleSaveTool = (id: string) => {
    setTools(tools.map(t => {
      if (t.id === id) {
        return {
          ...t,
          name: editToolName,
          description: editToolDesc
        };
      }
      return t;
    }));
    setEditingToolId(null);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-850 shadow-sm" id="admin-dashboard-panel">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="md:w-64 space-y-2 flex-shrink-0">
          <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider block px-3 mb-2">Admin Panel Controls</span>
          <button
            onClick={() => setActiveTab("tools")}
            className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-semibold transition cursor-pointer ${
              activeTab === "tools"
                ? "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/50"
                : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            Manage Tools
          </button>
          <button
            onClick={() => setActiveTab("blogs")}
            className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-semibold transition cursor-pointer ${
              activeTab === "blogs"
                ? "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/50"
                : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
            }`}
          >
            <FileText className="w-4 h-4" />
            Manage Blog Posts
          </button>
          <button
            onClick={() => setActiveTab("seo")}
            className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-semibold transition cursor-pointer ${
              activeTab === "seo"
                ? "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/50"
                : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
            }`}
          >
            <Settings className="w-4 h-4" />
            SEO & System Setup
          </button>

          <div className="bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/50 p-4 rounded-xl text-xs text-red-800 dark:text-red-400 space-y-1.5 mt-6">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldAlert className="w-4 h-4 text-red-500" />
              <span>Sandbox Notice:</span>
            </div>
            <p className="leading-relaxed text-gray-600 dark:text-gray-400">All additions, modifications and file layouts exist in dynamic browser memory. They reset only if you clear browser caches.</p>
          </div>
        </div>

        {/* Content Panel */}
        <div className="flex-1 min-w-0">
          {/* TAB 1: MANAGE TOOLS */}
          {activeTab === "tools" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-gray-800 dark:text-gray-100">Available Platform Tools</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Directly edit the metadata titles and public descriptors of your 20 built-in core tools.</p>
              </div>

              <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-2">
                {tools.map((tool) => (
                  <div key={tool.id} className="p-4 bg-gray-50 dark:bg-gray-850 rounded-xl border border-gray-100 dark:border-gray-800 text-sm space-y-3">
                    {editingToolId === tool.id ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">Tool Title</label>
                            <input
                              type="text"
                              className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-blue-500 text-xs font-bold"
                              value={editToolName}
                              onChange={(e) => setEditToolName(e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">Category (Immutable)</label>
                            <input
                              type="text"
                              disabled
                              className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 outline-none text-xs"
                              value={tool.category}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">Public Description</label>
                          <textarea
                            rows={2}
                            className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-blue-500 text-xs resize-none"
                            value={editToolDesc}
                            onChange={(e) => setEditToolDesc(e.target.value)}
                          />
                        </div>
                        <div className="flex justify-end gap-2 text-xs">
                          <button
                            onClick={() => setEditingToolId(null)}
                            className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-md font-medium hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveTool(tool.id)}
                            className="px-3 py-1.5 bg-blue-600 text-white rounded-md font-semibold cursor-pointer"
                          >
                            Save Updates
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-800 dark:text-gray-100">{tool.name}</span>
                            <span className="px-2 py-0.5 bg-gray-200/50 dark:bg-gray-800 rounded-full text-[9px] font-mono font-bold text-gray-600 dark:text-gray-400 uppercase">
                              {tool.category}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">{tool.description}</p>
                        </div>

                        <button
                          onClick={() => handleStartEditTool(tool)}
                          className="flex-shrink-0 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
                          title="Edit Tool"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: MANAGE BLOGS */}
          {activeTab === "blogs" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-gray-800 dark:text-gray-100">Add New Blog Post</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Publish content to boost SEO indexing and long-term Google AdSense monetization.</p>
              </div>

              {blogSuccess && (
                <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/50 text-green-700 dark:text-green-300 font-bold text-xs rounded-xl flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Blog article published successfully! Check the Blog tab.
                </div>
              )}

              <form onSubmit={handleAddBlog} className="space-y-4 bg-gray-50 dark:bg-gray-850 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">Article Title</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-1 focus:ring-blue-500 outline-none text-xs bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. How to leverage QR Codes in Retail"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">Author</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-1 focus:ring-blue-500 outline-none text-xs bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">Topic Category</label>
                    <select
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-1 focus:ring-blue-500 outline-none text-xs bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                    >
                      <option value="Developer Tools">Developer Tools</option>
                      <option value="Image Tools">Image Tools</option>
                      <option value="Text Tools">Text Tools</option>
                      <option value="Student Tools">Student Tools</option>
                      <option value="SEO Guidance">SEO Guidance</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">Search Keywords (Comma separated)</label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-1 focus:ring-blue-500 outline-none text-xs bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                      value={newTags}
                      onChange={(e) => setNewTags(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">Short Excerpt Summary</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-1 focus:ring-blue-500 outline-none text-xs bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                    value={newExcerpt}
                    onChange={(e) => setNewExcerpt(e.target.value)}
                    placeholder="Short description snippet of the article (SEO description)..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">Full Markdown Content</label>
                  <textarea
                    rows={6}
                    required
                    className="w-full p-3.5 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-1 focus:ring-blue-500 outline-none text-xs bg-white dark:bg-gray-800 font-mono text-gray-800 dark:text-gray-100"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Write detailed body of the blog article here..."
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Publish Article
                  </button>
                </div>
              </form>

              {/* Published articles lists */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Currently Published Articles</span>
                <div className="space-y-2.5 max-h-40 overflow-y-auto pr-2">
                  {blogs.map((b) => (
                    <div key={b.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-850 rounded-lg border border-gray-100 dark:border-gray-800 text-xs text-gray-700 dark:text-gray-300">
                      <div>
                        <span className="font-bold text-gray-800 dark:text-gray-100">{b.title}</span>
                        <span className="text-gray-600 dark:text-gray-400 text-[10px] ml-2">by {b.author} ({b.date})</span>
                      </div>
                      <button
                        onClick={() => handleDeleteBlog(b.id)}
                        className="text-red-500 hover:text-red-700 p-1.5 cursor-pointer"
                        title="Delete Article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SYSTEM SEO SETUP */}
          {activeTab === "seo" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-gray-800 dark:text-gray-100">System SEO & Monetization Configs</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Configure site titles, description metadata, robots parameters and dynamic sitemap tags.</p>
              </div>

              {seoSuccess && (
                <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/50 text-green-700 dark:text-green-300 font-bold text-xs rounded-xl flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  SEO meta and system text files saved successfully!
                </div>
              )}

              <form onSubmit={handleSaveSEO} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">Meta Site Title Prefix</label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-1 focus:ring-blue-500 outline-none text-xs bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">Global Search Keywords</label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-1 focus:ring-blue-500 outline-none text-xs bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">Meta Description Tag</label>
                  <textarea
                    rows={2}
                    className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-1 focus:ring-blue-500 outline-none text-xs bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                    value={metaDesc}
                    onChange={(e) => setMetaDesc(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">robots.txt Layout file</label>
                    <textarea
                      rows={6}
                      className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-1 focus:ring-blue-500 outline-none text-xs font-mono bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                      value={robots}
                      onChange={(e) => setRobots(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">sitemap.xml Layout file</label>
                    <textarea
                      rows={6}
                      className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-1 focus:ring-blue-500 outline-none text-xs font-mono bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                      value={sitemap}
                      onChange={(e) => setSitemap(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm active:scale-95 cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
