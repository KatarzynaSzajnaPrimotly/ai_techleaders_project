import { Bell, CalendarDays, Check, CircleHelp, FileCode2, Search } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import './foundations.css';

function Page({ title, children }: { title: string; children: ReactNode }) {
  return <main className="foundation-page"><h1>{title}</h1>{children}</main>;
}

const meta = { title: 'Foundations', parameters: { layout: 'fullscreen' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const contrastRows = {
  light: [
    ['Strong text', '14.77:1', '15.41:1', '13.74:1'],
    ['Muted text', '5.51:1', '5.75:1', '5.13:1'],
    ['Action / success', '5.68:1', '5.93:1', '5.29:1'],
    ['Warning', '5.58:1', '5.83:1', '5.20:1'],
    ['Error', '6.20:1', '6.47:1', '5.77:1'],
    ['Control stroke', '5.51:1', '5.75:1', '5.13:1'],
    ['Divider (decorative)', '1.19:1', '1.25:1', '1.11:1'],
  ],
  dark: [
    ['Strong text', '16.38:1', '15.17:1', '13.51:1'],
    ['Muted text', '5.66:1', '5.24:1', '4.67:1'],
    ['Action / success', '7.69:1', '7.12:1', '6.34:1'],
    ['Warning', '7.21:1', '6.68:1', '5.95:1'],
    ['Error', '6.57:1', '6.08:1', '5.42:1'],
    ['Control stroke', '5.66:1', '5.24:1', '4.67:1'],
    ['Divider', '5.66:1', '5.24:1', '4.67:1'],
  ],
};

function ContrastTable({ theme, rows }: { theme: string; rows: string[][] }) {
  return <div className="foundation-example"><h2>{theme} theme</h2><table className="foundation-table">
    <thead><tr><th scope="col">Foreground role</th><th scope="col">Canvas</th><th scope="col">Panel</th><th scope="col">Subtle</th></tr></thead>
    <tbody>{rows.map(([role, canvas, panel, subtle]) => <tr key={role}><th scope="row">{role}</th><td>{canvas}</td><td>{panel}</td><td>{subtle}</td></tr>)}</tbody>
  </table></div>;
}

export const Color: Story = {
  name: 'Color',
  render: () => <Page title="Color">
    <p>Color communicates surface, hierarchy, action, and status. Pair status color with text or an icon so color is never the only signal. Sources: P-COLOR.1, WCAG 1.4.1.</p>
    <div className="foundation-grid">
      {[
        ['Canvas', 'var(--surface-canvas)'], ['Panel', 'var(--surface-panel)'],
        ['Subtle group', 'var(--surface-subtle)'], ['Strong text', 'var(--text-strong)'],
        ['Muted text', 'var(--text-muted)'], ['Primary action', 'var(--action-primary)'],
        ['Success', 'var(--status-success)'], ['Warning', 'var(--status-warning)'], ['Error', 'var(--status-error)'],
      ].map(([label, color]) => <div className="foundation-swatch" key={label}>
        <div className="foundation-swatch__sample" style={{ '--swatch': color } as CSSProperties} />
        <strong className="foundation-swatch__label">{label}</strong><code>{color}</code>
      </div>)}
    </div>
    <h2>Measured contrast</h2>
    <p>Ratios were recalculated from the exact stored values with the WCAG relative-luminance formula. Text pairs meet 4.5:1; functional boundaries meet 3:1. The light divider is below both thresholds and is decorative only; use the control stroke token for a functional boundary. Primary-action label contrast is 5.68:1 in light and 7.69:1 in dark. Source: P-COLOR.1, WCAG 1.4.3 and 1.4.11.</p>
    <ContrastTable theme="Light" rows={contrastRows.light} />
    <ContrastTable theme="Dark" rows={contrastRows.dark} />
  </Page>,
};

export const Typography: Story = {
  name: 'Typography',
  render: () => <Page title="Typography">
    <p>Use each text role to make dense workspace information scannable while keeping conversation readable. System UI fonts are local; code and file names use the system monospace stack. Sources: P-TYPE.1, R01.2, R02.1.</p>
    <div className="foundation-example"><h2>Page heading · 32/40</h2><p>Section heading · 24/32</p><p>Body text · 16/24. Keep continuous text to about 65 characters per line.</p><p><strong>Label · 14/20</strong></p><p className="foundation-meta">Metadata · 12/16</p><p>Tabular numbers: <data value="1250">1,250</data></p><code>Code and file names · 14/20</code></div>
  </Page>,
};

export const SpacingAndLayout: Story = {
  name: 'Spacing and layout',
  render: () => <Page title="Spacing and layout">
    <p>Use 8 px within a related group, 16 px between related groups, 24 px inside a panel, and 48 px between page sections. Layout checks target 320, 768, and 1440 px viewports with gutters of 16, 24, and 32 px; content max is 1200 px. Sources: P-SPACE.1, R01.1.</p>
    <div className="foundation-layout"><div className="foundation-layout__side">320 / narrow navigation</div><div className="foundation-layout__main">768 / working content · 1440 / centered content</div></div>
  </Page>,
};

export const ShapeAndDepth: Story = {
  name: 'Shape and depth',
  render: () => <Page title="Shape and depth">
    <p>Controls use a 4 px radius; panels, cards, dialogs, and popovers use 8 px. Use a 1 px border for boundaries. Reserve the shadow token for overlays, not ordinary cards. Sources: P-SHAPE.1, R01.1.</p>
    <div className="foundation-row"><div className="foundation-example">Panel surface</div><div className="foundation-overlay">Overlay surface</div></div>
  </Page>,
};

export const Motion: Story = {
  name: 'Motion',
  render: () => <Page title="Motion">
    <p>Use 120 ms for small feedback, 180 ms for standard transitions, and 240 ms for larger changes, with the shared easing token. Reduce non-essential movement to zero when the operating system requests reduced motion. Sources: P-MOTION.1, WCAG 2.3.3.</p>
    <div className="foundation-example foundation-motion">This surface follows the reduced-motion preference.</div>
  </Page>,
};

export const Icons: Story = {
  name: 'Icons',
  render: () => <Page title="Icons">
    <p>Use Lucide React at 16 px in dense rows, 20 px for standard controls, and 24 px for prominent actions. Add a visible text label when the icon’s meaning is not universally clear or when the action needs context. Sources: P-ICONS.1, R01.1, R02.1.</p>
    <div className="foundation-row"><span><Search aria-hidden="true" size={16} /> <span className="foundation-meta">16</span></span><span><CalendarDays aria-hidden="true" size={20} /> <span className="foundation-meta">20</span></span><span><Bell aria-hidden="true" size={24} /> <span className="foundation-meta">24</span></span></div>
    <div className="foundation-row"><button className="foundation-action" type="button"><Check aria-hidden="true" size={20} /> Save profile</button><CircleHelp aria-hidden="true" size={20} /><FileCode2 aria-hidden="true" size={20} /></div>
  </Page>,
};

export const Themes: Story = {
  name: 'Themes',
  render: () => <Page title="Themes">
    <p>Use the toolbar’s Light and Dark options to change the root document theme. Dialogs, menus, and popovers mounted outside the story inherit the same semantic variables. Sources: P-THEME.1, WCAG 1.4.3.</p>
    <div className="foundation-example"><strong>Current theme preview</strong><hr className="foundation-divider" /><p>Canvas, panel, text, action, and status roles update together.</p></div>
  </Page>,
};
