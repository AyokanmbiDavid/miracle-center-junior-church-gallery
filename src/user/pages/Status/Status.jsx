import React, { useState } from "react";
import ClassDropDown from "./ClassDropdown";
import CardGrid from "./Cards";

const Status = () => {
  const [currentFilter, setCurrentFilter] = useState("All");

  return (
    <div className="relative p-3 overflow-y-auto mb-20">
      {/* Header Bar */}
      <div className="w-full flex max-sm:flex-col justify-between items-start sm:items-center dark:text-white mb-4 gap-4">
        <div>
          <h1 className="text-lg font-bold">Recent Service Photos</h1>
          <h2 className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              year: "numeric",
            })}
          </h2>
        </div>

        {/* Filter Dropdown Selector */}
        <ClassDropDown setFilter={setCurrentFilter} />
      </div>

      {/* Grid Display */}
      <CardGrid filter={currentFilter} />
    </div>
  );
};

export default Status;