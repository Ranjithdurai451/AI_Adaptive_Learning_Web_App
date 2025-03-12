import { Link, Outlet } from 'react-router';

const RootLayout = () => {
  return (
    <div className="w-dvw h-dvh  flex  flex-col overflow-hidden ">
      <header className="p-3  bg-transparent">
        <Link to={'/'} className=" text-black font-bold  text-3xl">
          SparkLearn
        </Link>
      </header>
      <div className="w-full  flex-grow overflow-y-auto ">
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
