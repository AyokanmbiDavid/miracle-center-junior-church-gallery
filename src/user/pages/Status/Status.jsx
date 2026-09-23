import React, { useState } from "react";
import ClassDropDown from "./ClassDropdown";
import CardGrid from "./Cards";
import { PartyPopper } from "lucide-react";
import ClassDropDown2 from "./ClassDropdown2";

const Status = () => {
  const [currentFilter, setCurrentFilter] = useState("All");
  const [classFilter,setclassFilter] = useState("All")

  return (
    <div className="relative p-3 overflow-y-auto mb-20">
      {/* Header Bar */}
      <div className="w-full flex max-sm:flex-col justify-between items-start sm:items-center dark:text-white mb-4 gap-4">
        <div>
          <h1 className="text-lg flex gap-3 font-bold items-center">
            <span className="flex ">
              Recent Service Photos (STATUS)
            </span>

            <PartyPopper size={20}/>

          </h1>
          <h2 className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              year: "numeric",
            })}
          </h2>
        </div>

        <div className="flex gap-2 items-center">
        <ClassDropDown2 setFilter={setclassFilter}/>

        {/* Filter Dropdown Selector */}
        <ClassDropDown setFilter={setCurrentFilter} />
        </div>
      </div>

      {/* Grid Display */}
      <CardGrid filter={currentFilter} classfilt={classFilter} />
    </div>
  );
};

export default Status;