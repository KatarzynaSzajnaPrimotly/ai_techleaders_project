import { useEffect, useState } from "react";
import { NOW_LABEL } from "./data";
import { SCREENS } from "./screens";
import { reset, update, useStore, visit, type ScreenId } from "./store";
import { ScenarioPanel } from "./ScenarioPanel";

type Theme = "dark" | "light";

function Toolbar({ current }: { current: ScreenId }) {
  const [theme, setTheme] = useState<Theme>("dark");

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    setTheme(next);
  }

  return (
    <div className="doc-toolbar">
      <span className="badge badge-warning">Prototyp</span>
      <nav className="screen-nav" aria-label="Screens">
        {SCREENS.map((screen) => (
          <a key={screen.id} href={`#${screen.id}`} aria-current={screen.id === current ? "page" : undefined}>
            {screen.id} {screen.nav}
          </a>
        ))}
      </nav>
      <span className="t-hint">Now: {NOW_LABEL}</span>
      <ScenarioPanel />
      <button type="button" className="btn btn-outline btn-sm" onClick={() => { reset(); visit("s01"); }}>
        Reset demo
      </button>
      <button id="theme-toggle" type="button" className="btn btn-outline btn-sm" aria-pressed={theme === "light"} onClick={toggleTheme}>
        Theme: {theme}
      </button>
    </div>
  );
}

export function App() {
  const epoch = useStore((state) => state.epoch);
  const [current, setCurrent] = useState<ScreenId>("s01");

  useEffect(() => {
    window.__PROTOTYPE_START__?.();
    const onChange = (event: Event) => {
      const id = (event as CustomEvent<ScreenId>).detail;
      setCurrent(id);
      update({ currentScreen: id });
    };
    document.addEventListener("prototype:screen-change", onChange);
    return () => document.removeEventListener("prototype:screen-change", onChange);
  }, []);

  // After a reset the screens are remounted; send the engine back to the start screen.
  useEffect(() => {
    if (epoch > 0) visit("s01");
  }, [epoch]);

  return (
    <div className="doc">
      <Toolbar current={current} />
      <div key={epoch}>
        {SCREENS.map(({ id, title, path, component: Screen }) => (
          <section key={id} className="screen" id={id} aria-label={`${id} ${title}`}>
            <div className="screen-meta">
              <span className="t-overline">{id}</span>
              <span className="t-card-title">{title}</span>
              <span className="t-hint">{path}</span>
            </div>
            <div className="frame">
              <div className="frame-url">{path}</div>
              <Screen />
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
