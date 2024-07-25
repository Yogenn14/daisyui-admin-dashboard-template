import React from "react";

function SearchBar({
  searchText,
  styleClass,
  placeholderText,
  setSearchText,
  setFilterType,
}) {
  const updateSearchInput = (value) => {
    setSearchText(value);
  };

  const updateFilterType = (value) => {
    setFilterType(value);
    setSearchText("");
  };

  return (
    <div className={"inline-block " + styleClass}>
      <div className="join flex ">
        <input
          className="input input-bordered join-item w-1/4 md:w-full"
          value={searchText}
          placeholder={placeholderText || "Search"}
          onChange={(e) => updateSearchInput(e.target.value)}
        />
        <select
          className="select select-bordered join-item"
          onChange={(e) => updateFilterType(e.target.value)}
        >
          <option value="partDescription">Part Desc</option>
          <option value="partNumber">Part Num</option>
          <option value="serialNumber">Serial Num</option>
        </select>
      </div>
    </div>
  );
}

export default SearchBar;
