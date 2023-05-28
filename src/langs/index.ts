import ru from './ru.json';
import { useStore, type Lang } from '../store';

const langs = {
  en: null,
  ru,
} as Record<Lang, Record<string, string> | null>;

export function useTranslator() {
  const lang = useStore(state => state.lang);

  return (phrase: string) => langs[lang]?.[phrase] ?? phrase;
}
