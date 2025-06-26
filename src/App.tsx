import React, { useState, useCallback, useEffect, useMemo } from 'react'; // Added useMemo
import './App.css'; // Keep App.css for any global app styles or remove if not needed

import Navigator, { PageItem } from './components/NavigationPanel';

// Import new icons
import InfoIcon from './components/icons/InfoIcon';
import DetailsIcon from './components/icons/DetailsIcon';
import OtherIcon from './components/icons/OtherIcon';
import EndingIcon from './components/icons/EndingIcon';
import AddPageIcon from './components/icons/AddPageIcon';
import { DragEndEvent } from '@dnd-kit/core'; // Added
import { arrayMove } from '@dnd-kit/sortable'; // Added
import DocumentIcon from './components/icons/DocumentIcon'; // Example for newly added pages
import { ActionMenuItem } from './components/ContextMenu'; // Import ActionMenu


// Import new icons for the settings menu
import SetAsFirstPageIcon from './components/icons/SetAsFirstPageIcon';
import RenameIcon from './components/icons/RenameIcon';
import CopyIcon from './components/icons/CopyIcon';
import DuplicateIcon from './components/icons/DuplicateIcon';
import DeleteIcon from './components/icons/DeleteIcon';

// Define menu items outside the component to ensure they are stable references
const settingsMenuItems: ActionMenuItem[] = [
    { id: 'set-first', type: 'item', label: 'Set as first page', icon: <SetAsFirstPageIcon />, onClick: () => {} },
    { id: 'rename', type: 'item', label: 'Rename', icon: <RenameIcon />, onClick: () => {} },
    { id: 'copy', type: 'item', label: 'Copy', icon: <CopyIcon />, onClick: () => {} },
    { id: 'duplicate', type: 'item', label: 'Duplicate', icon: <DuplicateIcon />, onClick: () => {} },
    { id: 'sep1', type: 'separator' },
    { id: 'delete', type: 'item', label: 'Delete', icon: <DeleteIcon />, iconColor: '#EF494F', onClick: () => {} },
  ];

function App() {

  // settingsMenuItems definition removed from here
  // The array above was erroneously re-inserted here and is now removed.

  // Define handlers before initialPageItems
  const [pageItems, setPageItems] = useState<PageItem[]>([]); // Initialize with empty array first

  const handlePageClick = useCallback((clickedId: string | number) => {
    setPageItems((prevItems) => {
      const newItems = prevItems.map((item) => {
        const isActive = item.id === clickedId;
        if (item.id === clickedId) {
        } else if (item.isActive && item.id !== clickedId) {
        }
        return { ...item, isActive: isActive };
      });
      return newItems;
    });
  }, []); // No dependencies needed as setPageItems updater form is used

  const handleAddItem = useCallback((indexAfter: number) => {
    const newPageId = `page-${Date.now()}`;
    const newPageTitle = `New Page ${pageItems.filter(item => item.type !== 'addPageAction').length + 1}`;
    const newPage: PageItem = {
      id: newPageId,
      title: newPageTitle,
      icon: <DocumentIcon className="w-5 h-5" />,
      type: 'page',
      isActive: true,
      onPageClick: handlePageClick,
      actionItems: settingsMenuItems,
      popoverHeaderTitle: `${newPageTitle} Settings`,
    };

    setPageItems((prevItems) => {
      const newItems = [...prevItems];
      newItems.splice(indexAfter + 1, 0, newPage);
      return newItems.map((item) => ({ ...item, isActive: item.id === newPageId }));
    });
  }, [pageItems, handlePageClick]); // settingsMenuItems is stable, handlePageClick is a dep

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setPageItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, []);

  // Define initialPageItems after handlers, using useMemo for stability
  const initialPageItems = useMemo((): PageItem[] => [
    {
      id: 'info',
      title: 'Info',
      icon: <InfoIcon className="w-5 h-5" />,
      type: 'page', // Explicitly set type
      isActive: true,
      onPageClick: handlePageClick,
      actionItems: settingsMenuItems,
      popoverHeaderTitle: 'Info Settings',
    },
    {
      id: 'details',
      title: 'Details',
      icon: <DetailsIcon className="w-5 h-5" />,
      type: 'page',
      isActive: false,
      onPageClick: handlePageClick,
      actionItems: settingsMenuItems,
      popoverHeaderTitle: 'Details Settings',
    },
    {
      id: 'other',
      title: 'Other',
      icon: <OtherIcon className="w-5 h-5" />,
      type: 'page',
      isActive: false,
      onPageClick: handlePageClick,
      actionItems: settingsMenuItems,
      popoverHeaderTitle: 'Other Settings',
    },
    {
      id: 'ending',
      title: 'Ending',
      icon: <EndingIcon className="w-5 h-5" />,
      type: 'page',
      isActive: false,
      onPageClick: handlePageClick,
      actionItems: settingsMenuItems,
      popoverHeaderTitle: 'Ending Settings',
    },
    {
      id: 'addPageBtn',
      title: 'Add Page',
      icon: <AddPageIcon className="w-4 h-4" />,
      type: 'addPageAction',
      isActive: false,
      onPageClick: (id: string | number) => {},
    },
  ], [handlePageClick]); // settingsMenuItems is stable from outer scope, handlePageClick is the key dependency

  // Effect to set initial page items after component mounts and handlers are defined
  useEffect(() => {
    setPageItems(initialPageItems);
  }, [initialPageItems]); // Depend on the memoized initialPageItems

  // Effect to monitor pageItems changes
  useEffect(() => {
  }, [pageItems]);

  return (
    <div className="flex flex-col items-center bg-gradient-to-br from-slate-50 to-sky-100 p-6 pb-40 relative min-h-screen"> 
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-800">Dynamic Page Navigator</h1>
        <p className="text-gray-600 mt-2">Seamlessly manage your application's flow with our intuitive, drag-and-drop navigation component.</p>
      </div>



      {/* Fixed Footer Section */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 w-full flex flex-col items-center">
        <div className="w-full overflow-x-auto overflow-y-visible"> {/* Allow navigator container to take full width and ensure vertical overflow is visible */}
          <Navigator pageItems={pageItems} onAddItemClick={handleAddItem} onDragEnd={handleDragEnd} />
        </div>

      </div>
    </div>
  );
}

export default App;
