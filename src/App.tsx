import { useState, useRef, useEffect, type FC } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useStore, type Lang } from './store';
import { useTranslator } from './langs';

import defaultLists from './lists';

const App: FC = () => {
  const [file, setFile] = useState<File | null>();
  const isDarkMode = useStore(state => state.isDarkMode);
  const lang = useStore(state => state.lang);
  const list = useStore(state => state.list);
  const filename = useStore(state => state.filename);
  const itemsPerSelect = useStore(state => state.itemsPerSelect);
  const setIsDarkMode = useStore(state => state.setIsDarkMode);
  const setLang = useStore(state => state.setLang);
  const setFilename = useStore(state => state.setFilename);
  const setList = useStore(state => state.setList);
  const setItemsPerSelect = useStore(state => state.setItemsPerSelect);
  const clear = useStore(state => state.clear);

  const [params] = useSearchParams();

  useEffect(() => {
    document.body.classList[isDarkMode ? 'add' : 'remove']('dark');
  }, [isDarkMode]);

  useEffect(() => {
    const langParam = params.get('lang');

    if (!langParam) {
      return;
    }

    if (!['en', 'ru'].includes(langParam)) {
      console.error('Invalid lang param');
      return;
    }

    setLang(langParam as Lang);
  }, [params, setLang]);

  useEffect(() => {
    const modeParam = params.get('mode');

    if (!modeParam) {
      return;
    }

    if (!['light', 'dark'].includes(modeParam)) {
      console.error('Invalid model param');
      return;
    }

    setIsDarkMode(modeParam === 'dark');
  }, [params, setIsDarkMode]);

  useEffect(() => {
    const listParam = params.get('list');

    if (!listParam) {
      return;
    }

    if (!(listParam in defaultLists)) {
      console.error('Invalid list param');
      return;
    }

    fetch(defaultLists[listParam])
      .then(res => res.text())
      .then(list => {
        setList(list.split('\n'));
        setFilename(listParam + '.txt');
      });
  }, [params, setList, setFilename]);

  useEffect(() => {
    const countParam = params.get('count');

    if (!countParam) {
      return;
    }

    const count = +countParam;

    if (isNaN(count)) {
      console.error('Invalid count param');
      return;
    }

    setItemsPerSelect(count);
  }, [params, setItemsPerSelect]);

  useEffect(() => {
    if (!file && !list?.length) {
      setFilename('');
    }
  }, [file, list?.length, setFilename]);

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

  const $t = useTranslator();

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50">
      <header className="h-24">
        <nav className="mx-auto flex max-w-7xl justify-end p-6 lg:px-8">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="rounded-lg px-3 py-2.5 mr-4 text-base font-semibold leading-7 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            {isDarkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
          </button>
          <select
            value={lang}
            onChange={e => setLang(e.target.value as Lang)}
            className="text-black dark:bg-gray-800 dark:text-white rounded-md"
          >
            <option value="en">En</option>
            <option value="ru">Ру</option>
          </select>
        </nav>
      </header>

      <div className="mx-auto max-w-7xl min-h-screen flex flex-col justify-center px-6 lg:px-8 -mt-24">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {$t('Random List Item Selector')}
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600 dark:text-gray-400">
          {$t('Upload your list and get random items from it.')}
        </p>
        <div className="mt-11 flex flex-col items-start gap-5">
          <div className="flex">
            <div className="flex flex-col justify-start items-start">
              <button
                onClick={() => hiddenFileInput.current?.click()}
                className="rounded-md bg-white dark:bg-gray-800 px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {$t('Upload a TXT file')}
              </button>
              <span className="text-xs leading-6 text-gray-600 dark:text-gray-400">
                {$t('1 line – 1 item')}
              </span>
            </div>
            <span className="pl-3 pt-2 text-sm">{file?.name ?? filename}</span>
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
            <label htmlFor="items-count" className="block text-sm font-medium leading-6">
              {$t('Items per select')}
            </label>
            <div className="mt-2">
              <input
                type="number"
                value={itemsPerSelect}
                onChange={e => setItemsPerSelect(e.target.valueAsNumber)}
                min={1}
                id="items-count"
                className="block w-[108px] text-black dark:bg-gray-800 dark:text-white rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleGetStartedClick}
              disabled={!file && !list?.length}
              className="rounded-md bg-indigo-600 px-5 py-2.5 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-60"
            >
              {$t('Get started')}
            </button>
            {!!(list?.length || itemsPerSelect > 1) && (
              <button
                onClick={() => clear()}
                className="rounded-md bg-white dark:bg-gray-800 px-5 py-2.5 font-semibold shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {$t('Clear')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
