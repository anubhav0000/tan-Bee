import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useFiles } from "../hooks/useFiles";
import FileCard from "../components/FileManagement/FileCard";
import { Search } from "lucide-react";

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: "Programs — Tan bee" },
      { name: "description", content: "Access study programs and resources." },
    ],
  }),
  component: ProgramsPage,
});

function ProgramsPage() {
  const { files, loading } = useFiles();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const categories = ["All", ...new Set(files.map((f: any) => f.category))];

  const filteredFiles = files.filter((file: any) => {
    const matchesSearch =
      file.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" || file.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto">
      <p className="font-mono text-[10px] tracking-[0.25em] text-mint mb-2">// PROGRAMS</p>
      <h1 className="font-display text-4xl sm:text-5xl text-ice leading-[0.9] mb-7">Programs & Resources</h1>

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 animate-rise">
        <div className="flex gap-4 w-full">
          <div className="relative flex-grow md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ice/40 w-5 h-5" />
            <input
              type="text"
              placeholder="Search resources..."
              className="w-full pl-10 pr-4 py-2 border border-white/10 rounded-lg bg-panel focus:outline-none focus:border-mint text-ice"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="py-2 px-4 border border-white/10 rounded-lg bg-panel text-ice focus:outline-none focus:border-mint"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map((cat: any) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mint"></div>
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="text-center py-20 bg-panel rounded-lg border border-white/10 border-dashed animate-rise">
          <h3 className="text-xl font-medium text-ice/60">No resources found</h3>
          <p className="text-ice/40 mt-2">Try adjusting your search or category filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-rise [animation-delay:40ms]">
          {filteredFiles.map((file: any) => (
            <FileCard
              key={file.$id}
              fileData={file}
              isAdmin={false}
              onEdit={(data: any) => console.log("Edit requested for", data)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
