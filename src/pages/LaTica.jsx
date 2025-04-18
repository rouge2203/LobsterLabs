import React, { useRef, useState } from "react";
import Confetti from "react-confetti"; // Confetti Library
import Logo from "../assets/img/oil.png";
import CarLogo from "../assets/img/45.png"; // Last card image
import LogoTica from "../assets/img/latica-logo2.png";

function LaTica() {
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [winners, setWinners] = useState(Array(6).fill(null)); // State to store winners per card
  const [loading, setLoading] = useState(Array(6).fill(false)); // Loading state for each card
  const [showConfetti, setShowConfetti] = useState(false); // Confetti state
  const totalCards = 6;

  const scrollNext = () => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.firstChild.offsetWidth;
      scrollRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });

      setCurrentIndex((prev) => (prev < totalCards - 1 ? prev + 1 : prev));
    }
  };

  const scrollPrev = () => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.firstChild.offsetWidth;
      scrollRef.current.scrollBy({ left: -cardWidth, behavior: "smooth" });

      setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
    }
  };

  // Function to handle "Sortear" button click
  const handleSortear = async (index) => {
    try {
      // Set loading state for the clicked card
      const newLoadingState = [...loading];
      newLoadingState[index] = true;
      setLoading(newLoadingState);

      console.log(`Fetching winner for card ${index + 1}...`);

      const response = await fetch(
        "http://192.168.50.233:8000/api/admin/get_winner/"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      // Update winner state for the card
      const newWinners = [...winners];
      newWinners[index] = {
        firstName: data.user.first_name,
        numero: data.numero,
      };
      setWinners(newWinners);

      // Reset loading state
      newLoadingState[index] = false;
      setLoading(newLoadingState);

      // Trigger confetti if it's the last card
      if (index === totalCards - 1) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 50000000); // Stop confetti after 5 seconds
      }
    } catch (error) {
      console.error("Error fetching winner:", error);

      // Reset loading state in case of an error
      const newLoadingState = [...loading];
      newLoadingState[index] = false;
      setLoading(newLoadingState);
    }
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center bg-slate-100 p-4">
      {showConfetti && <Confetti />} {/* Confetti Effect */}
      <img src={LogoTica} className="w-1/6 opacity-80" alt="La Tica" />
      {/* Scrollable Container */}
      <div className="relative w-full py-8 max-w-2xl flex items-center">
        {/* Previous Button */}
        {currentIndex > 0 && (
          <button
            onClick={scrollPrev}
            className="absolute -left-20 z-10 bg-white text-red-800 font-medium py-2 px-4 rounded-full shadow-lg"
          >
            ←
          </button>
        )}

        {/* Scrollable List */}
        <div
          ref={scrollRef}
          className="w-full overflow-hidden flex px-4 py-10"
          style={{ scrollSnapType: "x mandatory", whiteSpace: "nowrap" }}
        >
          {Array.from({ length: totalCards }).map((_, index) => (
            <div
              key={index}
              className="bg-[#C23144] mr-10 rounded-xl bg-opacity-100 shadow-xl flex flex-row min-w-full max-w-full h-32 p-0"
              style={{ scrollSnapAlign: "center" }}
            >
              {/* Logo Section */}
              <div className="w-1/6 bg-white rounded-r-full flex items-center justify-center p-0">
                <img
                  src={index === totalCards - 1 ? CarLogo : Logo}
                  className="w-full aspect-square p-1"
                  alt="La Tica"
                />
              </div>

              {/* Content Section */}
              <div className="w-4/6 flex pl-4 flex-col justify-center">
                <h1 className="font-semibold text-xl tracking-tight text-white">
                  {index === totalCards - 1
                    ? "¡Gane un Todoterreno!"
                    : "Vale por ₡ 30 000 de combustible"}
                </h1>

                {/* Show winner or loading message */}
                {loading[index] ? (
                  <h1 className="font-medium text-base tracking-tight text-white">
                    Obteniendo Ganador...
                  </h1>
                ) : winners[index] ? (
                  <>
                    <h1 className="font-medium text-base tracking-tight text-white">
                      {winners[index].firstName}
                    </h1>
                    <h1 className="font-bold text-lg tracking-tight text-white">
                      {winners[index].numero}
                    </h1>
                  </>
                ) : null}
              </div>

              {/* Button Section */}
              <div className="w-1/6 flex items-center justify-center pr-8">
                <button
                  className="bg-white text-red-800 font-medium py-1 px-6 rounded-full disabled:opacity-50"
                  onClick={() => handleSortear(index)}
                  disabled={loading[index]} // Disable button while loading
                >
                  {loading[index] ? "..." : "Sortear"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Next Button */}
        {currentIndex < totalCards - 1 && (
          <button
            onClick={scrollNext}
            className="absolute -right-20 z-10 bg-white text-red-800 font-medium py-2 px-4 rounded-full shadow-lg"
          >
            →
          </button>
        )}
      </div>
    </div>
  );
}

export default LaTica;
