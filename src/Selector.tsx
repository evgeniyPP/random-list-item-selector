import { useState, useEffect, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useListStore } from './list-store';

const Selector: FC = () => {
  const [, setCount] = useState(0);
  const list = useListStore(state => state.list);
  const itemsPerSelect = useListStore(state => state.itemsPerSelect);
  const items = [];

  for (let i = 0; i < itemsPerSelect; i++) {
    const item = list[Math.floor(Math.random() * list.length)];
    items.push(item);
  }

  const navigate = useNavigate();

  useEffect(() => {
    if (!items?.length) {
      navigate('/');
    }
  }, [items?.length, navigate]);

  return (
    <div className="bg-white">
      <div className="min-h-screen flex flex-col justify-center px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="flex flex-col gap-4 text-xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {items.map(item => (
              <p key={item}>{item}</p>
            ))}
          </h1>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <button
              onClick={() => setCount(n => n + 1)}
              autoFocus
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Get next one{items.length > 1 ? 's' : ''}
            </button>
            <a href="/" className="text-sm font-semibold leading-6 text-gray-900">
              Change
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Selector;
