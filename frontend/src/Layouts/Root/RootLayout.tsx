import { Link, Outlet } from 'react-router';

const RootLayout = () => {
  return (
    <div className="w-dvw h-dvh  flex  flex-col">
      <header className="p-3">
        <Link to={'/'} className="text-black font-bold  text-3xl">
          SparkLearn
        </Link>
      </header>
      <div className="w-full flex justify-center items-center h-full p-5">
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
