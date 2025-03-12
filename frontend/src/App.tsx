import { createBrowserRouter, RouterProvider } from 'react-router';
import RootLayout from './Layouts/Root/RootLayout';
import MainQuiz from './features/quiz/routes/MainQuiz';
import MainRoadMap from './features/roadmap/routes/MainRoadMap';
import SkillSelector from './Layouts/Root/components/SkillSelector';
import { ThemeProvider } from './components/ui/ThemeProvider';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <SkillSelector />
      },
      {
        path: '/quiz',
        element: <MainQuiz />
      }, {
        path: '/roadmap',
        element: <MainRoadMap />
      }

    ]
  },
]);

function App() {
  return (<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <RouterProvider router={router}></RouterProvider>

  </ThemeProvider >);
}

export default App;
