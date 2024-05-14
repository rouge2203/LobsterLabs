import React from "react";

const Divs = () => {
  return (
    <div className="dark flex flex-col min-h-screen bg-neutral-950">
      <main className="flex-grow">
        {/* <div className="h-[65vh] w-full bg-black  bg-grid-small-white/[0.2] relative flex items-center justify-center">
          {/* Radial gradient for the container to give a faded look 
          <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black  [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
          <div className="flex flex-col items-center justify-center z-20 ">
            <img src={Logo} alt="Lobster Labs" className=" w-32 h-auto" />
            <h1 className="text-4xl sm:text-7xl font-bold relative bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500">
              Lobster Labs
            </h1>
          </div>
        </div>
        <div className="w-full h-16 bg-white"></div>
        <div className="h-[65vh] w-full  bg-neutral-950 relative overflow-hidden flex justify-center items-center ">
          <Boxes />
          <div className="flex flex-col items-center justify-center z-20  ">
            <img src={Logo} alt="Lobster Labs" className=" w-32 h-auto" />
            <h1 className="text-4xl font-varienoutline font-bold mt-3 relative bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500">
              Lobster Labs
            </h1>
          </div>
        </div>
        <div className="w-full h-16 bg-white"></div> */}
        {/* AuroraBackground */}
        <div className="w-full bg-neutral-800 ">
          <AuroraBackground>
            <div className="flex flex-col items-center justify-center z-20  ">
              <img src={Logo} alt="Lobster Labs" className=" w-32 h-auto" />
              <h1 className="text-5xl font-varienoutline font-extrabold mt-2 relative bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500">
                Lobster Labs
              </h1>
            </div>
          </AuroraBackground>
        </div>
        {/* <div className="w-full h-16 bg-white"></div>
        <div className="h-[65vh] w-full dark:bg-black bg-white  dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center justify-center">
          {/* Radial gradient for the container to give a faded look 
          <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
          <div className="flex flex-col items-center justify-center z-20 ">
            <img src={Logo} alt="Lobster Labs" className=" w-32 h-auto" />
            <h1 className="text-5xl font-varienoutline font-extrabold mt-2 relative bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500">
              Lobster Labs
            </h1>
            <p className="text-xl mt-2 font-thin text-white font-default">
              Soluciones en software
            </p>
          </div>
        </div> */}
      </main>
    </div>
  );
};

export default Divs;
