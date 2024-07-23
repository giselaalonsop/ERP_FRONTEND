import { useState } from 'react';
import { ChevronDownIcon, SearchIcon } from '@heroicons/react/solid';
import { useTheme } from '@/context/ThemeProvider';
import { useCategories } from '@/hooks/useCategories';

const SearchWithDropdown = ({ onCategorySelect, onLocationSelect, onSearchTextChange }) => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All categories');
  const [selectedLocation, setSelectedLocation] = useState('General');
  const { isDark } = useTheme();
  const { categories, isLoading, isError } = useCategories();

  const toggleCategoryDropdown = () => {
    setIsCategoryOpen(!isCategoryOpen);
  };

  const toggleLocationDropdown = () => {
    setIsLocationOpen(!isLocationOpen);
  };

  const selectCategory = (category) => {
    setSelectedCategory(category.nombre);
    setIsCategoryOpen(false);
    onCategorySelect(category.nombre === 'All categories' ? '' : category.nombre);
  };

  const selectLocation = (location) => {
    setSelectedLocation(location);
    setIsLocationOpen(false);
    onLocationSelect(location);
  };

  const handleSearchChange = (e) => {
    onSearchTextChange(e.target.value);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading categories</div>;

  return (
    <div className="relative flex justify-start space-x-4">
      <div className="relative">
        <button
          onClick={toggleCategoryDropdown}
          className="flex items-center py-2 px-4 rounded-r-lg focus:outline-none"
        >
          {selectedCategory} <ChevronDownIcon className="h-5 w-5 ml-2" />
        </button>
        {isCategoryOpen && (
          <div className="absolute mt-2 w-full rounded-md z-10">
            <ul className="py-1">
              <li
                className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} block px-4 py-2 cursor-pointer`}
                onClick={() => selectCategory({ nombre: 'All categories' })}
              >
                All categories
              </li>
              {categories.map((category) => (
                <li
                  key={category.id}
                  className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} block px-4 py-2 cursor-pointer`}
                  onClick={() => selectCategory(category)}
                >
                  {category.nombre}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="relative">
        <button
          onClick={toggleLocationDropdown}
          className="flex items-center py-2 px-4 rounded-r-lg focus:outline-none"
        >
          {selectedLocation} <ChevronDownIcon className="h-5 w-5 ml-2" />
        </button>
        {isLocationOpen && (
          <div className="absolute mt-2 w-full rounded-md z-10">
            <ul className="py-1">
              <li
               className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} block px-4 py-2 cursor-pointer`}
                onClick={() => selectLocation('General')}
              >
                General
              </li>
              <li
                className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} block px-4 py-2 cursor-pointer`}
                onClick={() => selectLocation('Bejuma')}
              >
                Bejuma
              </li>
              <li
               className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} block px-4 py-2 cursor-pointer`}
                onClick={() => selectLocation('Montalban')}
              >
                Montalban
              </li>
            </ul>
          </div>
        )}
      </div>
      <div className="relative w-64">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <SearchIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true" />
        </div>
        <input
          type="text"
          id="table-search"
          className={`block w-full p-2 pl-10 text-sm  ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-lg }`}
          placeholder="Nombre o código del producto..."
          onChange={handleSearchChange}
        />
      </div>
    </div>
  );
};

export default SearchWithDropdown;
