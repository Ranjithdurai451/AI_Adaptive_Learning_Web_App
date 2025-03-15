import { createBrowserRouter, RouterProvider } from 'react-router';
import RootLayout from './Layouts/Root/RootLayout';
import MainQuiz from './features/quiz/routes/MainQuiz';
import MainRoadMap from './features/roadmap/routes/MainRoadMap';
import SkillSelector from './Layouts/Root/components/SkillSelector';
import { ThemeProvider } from './components/ui/ThemeProvider';
import Home from './Layouts/Root/components/Home';
import RoadmapLayout from './features/roadmap/routes/RoadmapLayout';
import TopicExplanation from './features/roadmap/routes/TopicExplanation';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/skill-selector',
        element: <SkillSelector />,
      },
      {
        path: '/quiz',
        element: <MainQuiz />,
      },
      {
        path: '/roadmap',
        element: <RoadmapLayout />,
        children: [
          {
            index: true,
            element: <MainRoadMap />,
          },
          {
            path: '/roadmap/:title',
            element: <TopicExplanation />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router}></RouterProvider>
    </ThemeProvider>
  );
}

export default App;
