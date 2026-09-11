import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import SubGeneralHeader from "./SubGeneralHeader";
import SubGeneralGrid from "./SubGeneralGrid";
import { fetchMembers } from "../../../axioscontroller";

// Map route IDs to exact database class values
const CLASS_MAP = {
  "1": "Toddlers",
  "2": "Children",
  "3": "Pre-teens",
  "4": "Teenagers",
};

export default function SubGeneral() {
  // Support both classId and id from router params
  const params = useParams();
  const routeParam = params.classId || params.id || "1";
  
  // Resolve the correct class name dynamically
  const currentClass = CLASS_MAP[routeParam] || routeParam;

  const [activeTab, setActiveTab] = useState("members");
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadMembers = useCallback(async () => {
    setLoading(true);
    setHasError(false);
    try {
      // Pass the correct dynamic class name to the backend controller
      const response = await fetchMembers({ className: currentClass });
      const membersArray = Array.isArray(response) ? response : response.data || [];
      console.log(response);
      
      setData(membersArray);
    } catch (err) {
      console.error("Failed to fetch members ledger:", err);
      setData([]);
      setHasError(true);
    } finally {
      setLoading(false);
    }
  }, [currentClass]);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const handleDownload = (imageSrc, filename) => {
    if (!imageSrc) return;

    const link = document.createElement("a");
    link.href = imageSrc;
    link.download = filename || `sanctuary-member-${Date.now()}.jpg`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Download started!", {
      style: { borderRadius: "12px", border: "1px solid #d97706", background: "#fff", color: "#1c1917" },
    });
  };

  const filteredData = data.filter((item) => {
    const role = (item.role || "").trim().toLowerCase();
    const isTeacherRole = role === "teacher" || item.isteacher === true;

    if (activeTab === "teachers" && !isTeacherRole) return false;
    if (activeTab === "members" && isTeacherRole) return false;

    if (searchQuery.trim()) {
      const name = (item.name || item.title || "").toLowerCase();
      return name.includes(searchQuery.toLowerCase().trim());
    }

    return true;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto bg-stone-50 dark:bg-zinc-950 min-h-screen text-stone-800 dark:text-zinc-100 font-sans transition-colors duration-300 flex flex-col gap-6">
      <SubGeneralHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentClass={currentClass}
      />

      <SubGeneralGrid
        data={filteredData}
        loading={loading}
        hasError={hasError}
        onDownload={handleDownload}
      />
    </div>
  );
}