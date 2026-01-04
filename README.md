# Video App - React Single Page Application

A modern React single-page web application with YouTube video playback capabilities.

## Features

- YouTube video integration using `react-youtube`
- Custom video controls overlay
- Responsive fullscreen design
- TailwindCSS styling
- Vite for fast development and building

## Project Structure

```
phillipe/
├── src/
│   ├── main.jsx              # Application entry point
│   ├── App.jsx               # Root component
│   ├── VideoFirstPage.jsx    # Main video player component
│   └── index.css             # Global styles with Tailwind
├── index.html                # HTML entry point
├── package.json              # Dependencies and scripts
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── postcss.config.js         # PostCSS configuration
```

## Getting Started

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

Create a production build:

```bash
npm run build
```

### Preview

Preview the production build:

```bash
npm run preview
```

## Customization

### Change YouTube Video

Edit `src/VideoFirstPage.jsx` and update the `videoId` variable:

```javascript
const videoId = "YOUR_YOUTUBE_VIDEO_ID";
```

To get a YouTube video ID, take the URL like `https://www.youtube.com/watch?v=dQw4w9WgXcQ` and extract the part after `v=` (in this case: `dQw4w9WgXcQ`).

### Styling

The app uses TailwindCSS for styling. Modify classes in the components or extend the theme in `tailwind.config.js`.

## Technologies

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **react-youtube** - YouTube player component for React
