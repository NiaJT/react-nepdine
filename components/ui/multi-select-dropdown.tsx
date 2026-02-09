"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface MultiSelectProps<T> {
  items?: T[];
  placeholder?: string;
  getLabel: (item: T) => string;
  onChange: (selected: T[]) => void;

  // ✅ New optional prop for controlled usage
  selectedItems?: T[];
}

export default function FloatingSearchDropdown<T>({
  items = [],
  placeholder = "Select...",
  getLabel,
  onChange,
  selectedItems: controlledSelectedItems, // ✅ optional
}: MultiSelectProps<T>) {
  const [search, setSearch] = useState("");
  const [internalSelectedItems, setInternalSelectedItems] = useState<T[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isControlled = controlledSelectedItems !== undefined;
  const selectedItems = isControlled
    ? controlledSelectedItems
    : internalSelectedItems;

  const containerRef = useRef<HTMLDivElement>(null);

  // ✅ Sync internal state when controlled
  useEffect(() => {
    if (isControlled) {
      setInternalSelectedItems(controlledSelectedItems!);
    }
  }, [controlledSelectedItems, isControlled]);

  const toggleItem = (item: T) => {
    let updated: T[];
    if (selectedItems.includes(item)) {
      updated = selectedItems.filter((i) => i !== item);
    } else {
      updated = [...selectedItems, item];
    }

    if (!isControlled) {
      setInternalSelectedItems(updated);
    }

    onChange(updated);
    setSearch("");
    setDropdownOpen(true);
  };

  const filteredItems =
    items?.filter(
      (item) =>
        getLabel(item).toLowerCase().includes(search.toLowerCase()) &&
        !selectedItems.includes(item)
    ) || [];

  return (
    <div className="relative w-full" ref={containerRef}>
      <div
        className="flex flex-wrap items-center gap-1 px-2 py-1 border border-[#DFDFDF] rounded-lg bg-white cursor-text"
        onClick={() => setDropdownOpen(true)}
      >
        {selectedItems.map((item) => (
          <span
            key={getLabel(item)}
            className="bg-orange-200 text-orange-800 px-2 py-1 rounded text-sm flex items-center gap-1"
          >
            {getLabel(item)}
            <span
              className="cursor-pointer font-bold"
              onClick={() => toggleItem(item)}
            >
              ×
            </span>
          </span>
        ))}

        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setDropdownOpen(true);
          }}
          placeholder={selectedItems.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[60px] py-1 px-1 text-sm outline-none border-none"
        />

        <ChevronDown
          className="w-5 h-5 text-gray-500 ml-1 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setDropdownOpen((prev) => !prev);
          }}
        />
      </div>

      {dropdownOpen && filteredItems.length > 0 && (
        <ul className="absolute top-full left-0 w-full bg-white border rounded-lg shadow-lg mt-1 max-h-45 overflow-auto z-50">
          {filteredItems.map((item) => (
            <li
              key={getLabel(item)}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm"
              onClick={() => toggleItem(item)}
            >
              {getLabel(item)}
            </li>
          ))}
        </ul>
      )}

      {dropdownOpen && filteredItems.length === 0 && (
        <div className="absolute top-full left-0 w-full bg-white border rounded-lg shadow-lg mt-1 px-3 py-2 z-50 text-gray-400">
          No results
        </div>
      )}
    </div>
  );
}
