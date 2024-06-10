import { useState, useEffect } from 'react';
import { ChevronDownIcon, SearchIcon } from '@heroicons/react/solid';
import { useTheme } from '@/context/ThemeProvider';
import { useCategories } from '@/hooks/useCategories';

const SearchWithDropdown = ({ onCategorySelect, onSearchTextChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All categories');
  const { isDark } = useTheme();
  const { categories, getCategoria } = useCategories();

  useEffect(() => {
    getCategoria();
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectCategory = (category) => {
    setSelectedCategory(category.nombre);
    setIsOpen(false);
    onCategorySelect(category.nombre === 'All categories' ? '' : category.nombre);
  };

  const handleSearchChange = (e) => {
    onSearchTextChange(e.target.value);
  };

  return (
    <div className={`relative flex justify-start  `}>
      <div className={`relative flex items-center shadow-sm`}>
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center py-2 px-4 rounded-r-lg focus:outline-none"
          >
            {selectedCategory} <ChevronDownIcon className="h-5 w-5 ml-2" />
          </button>
          {isOpen && (
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
      </div>
      <div className="relative ml-auto w-64">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <SearchIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true" />
        </div>
        <input
          type="text"
          id="table-search"
          className={`block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 ${isDark ? 'dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' : ''}`}
          placeholder="Nombre o codigo del producto..."
          onChange={handleSearchChange}
        />
      </div>
    </div>
  );
};

export default SearchWithDropdown;
