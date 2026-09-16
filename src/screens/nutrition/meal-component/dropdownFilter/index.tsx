// components/DropdownFilter.tsx
import { useState, useRef, useEffect } from "react";
import { ChevronsUpDown, X } from "lucide-react";

const DropdownFilter = ({ label, items, selectedItems = [], setSelectedItems }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full justify-between h-10 border border-gray-200 hover:bg-gray-50 flex items-center px-4 rounded-md"
      >
        {selectedItems.length === 0 ? `Select ${label}...` : selectedItems.map(id => items.find(item => item.id === id)?.name).join(", ")}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </button>

      {open && (
        <div
          role="listbox"
          aria-multiselectable="true"
          className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          <div className="p-2">
            {items.length === 0 ? (
              <div className="p-2 text-center text-gray-500">No {label} found.</div>
            ) : (
              items.map((item) => (
                <label key={item.id} className="flex items-center p-2 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => {
                      setSelectedItems((prev) =>
                        prev.includes(item.id)
                          ? prev.filter((id) => id !== item.id)
                          : [...prev, item.id]
                      );
                    }}
                    className="mr-2 border border-gray-200"
                  />
                  {item.name}
                </label>
              ))
            )}
          </div>
        </div>
      )}

      {selectedItems.length > 0 && (
        <div className="flex gap-2 flex-wrap mt-2">
          {selectedItems.map((id) => {
            const item = items.find((i) => i.id === id);
            return (
              <span key={id} className="px-2 py-1 bg-gray-100 text-gray-700 border border-gray-200 rounded-full flex items-center gap-1">
                {item?.name}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedItems(selectedItems.filter((selectedId) => selectedId !== id));
                  }}
                  className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                  aria-label={`Remove ${item?.name}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DropdownFilter;