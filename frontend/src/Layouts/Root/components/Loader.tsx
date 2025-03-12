const Loader = ({ text }: { text: string }) => {
  return (
    <div className=" w-full h-full flex justify-center items-center">
      <div className=" w-full flex-col  flex  gap-4">
        <h1 className=" text-2xl font-bold text-center">{text}</h1>
        <div className="loader"></div>
      </div>
    </div>
  );
};

export default Loader;
