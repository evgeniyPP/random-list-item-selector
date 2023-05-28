import { useState, useRef, useEffect, type FC } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useListStore } from './list-store';

import defaultLists from './lists';

const App: FC = () => {
  const [file, setFile] = useState<File>();
  const list = useListStore(state => state.list);
  const filename = useListStore(state => state.filename);
  const itemsPerSelect = useListStore(state => state.itemsPerSelect);
  const setFilename = useListStore(state => state.setFilename);
  const setList = useListStore(state => state.setList);
  const setItemsPerSelect = useListStore(state => state.setItemsPerSelect);
  const clear = useListStore(state => state.clear);

  const [params] = useSearchParams();

  useEffect(() => {
    const listName = params.get('list');

    if (!listName) {
      return;
    }

    if (!(listName in defaultLists)) {
      return;
    }

    fetch(defaultLists[listName])
      .then(res => res.text())
      .then(list => {
        setList(list.split('\n'));
        setFilename(listName + '.txt');
      });
  }, [params, setList, setFilename]);

  useEffect(() => {
    const count = params.get('count');

    if (!count) {
      return;
    }

    setItemsPerSelect(+count);
  }, [params, setItemsPerSelect]);

  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    if (!file && list?.length) {
      navigate('/selector');
      return;
    }

    if (!file) {
      console.error('No file');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (!reader.result) {
        console.error('No file reader result');
        return;
      }

      const list = reader.result.toString().split('\n');
      setList(list);
      navigate('/selector');
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl min-h-screen flex flex-col justify-center px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Random List Item Selector
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
          Upload your list and get random items from it.
        </p>
        <div className="mt-11 flex flex-col items-start gap-5">
          <div>
            <button
              onClick={() => hiddenFileInput.current?.click()}
              className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Upload a file
            </button>
            <span className="pl-3 text-sm">{file?.name ?? filename}</span>
          </div>
          <input
            type="file"
            ref={hiddenFileInput}
            onChange={e => {
              if (!e.target.files) {
                return;
              }

              const file = e.target.files[0];
              setFile(file);
              setFilename(file.name);
            }}
            accept=".txt"
            className="hidden"
          />
          <div>
            <label
              htmlFor="items-count"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Items per select
            </label>
            <div className="mt-2">
              <input
                type="number"
                value={itemsPerSelect}
                onChange={e => setItemsPerSelect(e.target.valueAsNumber)}
                min={1}
                id="items-count"
                className="block w-[108px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleGetStartedClick}
              disabled={!file && !list?.length}
              className="rounded-md bg-indigo-600 px-5 py-2.5 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-60"
            >
              Get started
            </button>
            {!!(list?.length || itemsPerSelect > 1) && (
              <button
                onClick={() => clear()}
                className="rounded-md bg-white px-5 py-2.5 font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
