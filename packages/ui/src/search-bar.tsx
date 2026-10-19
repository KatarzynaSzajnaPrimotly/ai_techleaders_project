import { useId } from "react";

export interface SearchBarProps {
  action: string;
  name: string;
  label: string;
  placeholder: string;
  suggestions?: readonly string[];
}

/** A plain GET form: works without JavaScript; suggestions use the browser's native datalist. */
export function SearchBar({ action, name, label, placeholder, suggestions = [] }: SearchBarProps) {
  const listId = useId();

  return (
    <form action={action} method="get" role="search" className="relative flex items-center">
      <span aria-hidden="true" className="pointer-events-none absolute left-4 opacity-60">
        🔍
      </span>
      <input
        type="search"
        name={name}
        aria-label={label}
        placeholder={placeholder}
        autoComplete="off"
        list={listId}
        className="w-full rounded-2xl border border-mentora-line bg-white py-4 pr-4 pl-11 text-[15px] text-mentora-ink shadow-md outline-none focus:outline-2 focus:outline-mentora"
      />
      <datalist id={listId}>
        {suggestions.map((suggestion) => (
          <option key={suggestion} value={suggestion} />
        ))}
      </datalist>
    </form>
  );
}
