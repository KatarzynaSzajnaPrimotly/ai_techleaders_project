import type { Preview } from '@storybook/react-vite';
import { useEffect } from 'react';
import { setupWorker } from 'msw/browser';
import { mswLoader } from 'msw-storybook-addon/csf3';
import './preview.css';

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'DevMentor color theme',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: import.meta.env.VITE_STORYBOOK_THEME === 'light' ? 'light' : 'dark',
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme === 'light' ? 'light' : 'dark';
      useEffect(() => {
        document.documentElement.dataset.theme = theme;
        document.documentElement.style.colorScheme = theme;
        return () => {
          delete document.documentElement.dataset.theme;
          document.documentElement.style.removeProperty('color-scheme');
        };
      }, [theme]);
      return <Story />;
    },
  ],
  loaders: [
    mswLoader(async () => {
      const worker = setupWorker();
      await worker.start({ onUnhandledRequest: 'bypass' });
      return worker;
    }),
  ],
  parameters: {
    a11y: { test: 'error' },
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: { toc: true },
  },
};

export default preview;
