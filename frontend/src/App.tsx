import { createBrowserRouter, RouterProvider } from 'react-router';
import RootLayout from './Layouts/Root/RootLayout';
import MainQuiz from './features/quiz/routes/MainQuiz';
import MainRoadMap from './features/roadmap/routes/MainRoadMap';
import SkillSelector from './Layouts/Root/components/SkillSelector';

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
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
