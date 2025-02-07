import { useState, useEffect } from "react";

interface CarouselProps {
  images: { src: string; alt: string }[];
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // Tự động chuyển ảnh sau mỗi 5 giây
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
  }, [currentIndex]);

  return (
    <div className="relative w-full overflow-hidden">
      <div className="relative h-56 md:h-96">
        {images.map((image, index) => (
          <img
            key={index}
            src={image.src}
            alt={image.alt}
            className={`absolute w-full h-full object-contain transition-opacity duration-700 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      {/* Indicators */}
      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? "bg-white" : "bg-gray-400"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>

      {/* Controls */}
      <button
        className="absolute top-1/2 left-2 -translate-y-1/2 p-2 bg-gray-800/30 text-white rounded-full"
        onClick={prevSlide}
      >
        ❮
      </button>
      <button
        className="absolute top-1/2 right-2 -translate-y-1/2 p-2 bg-gray-800/30 text-white rounded-full"
        onClick={nextSlide}
      >
        ❯
      </button>
    </div>
  );
};

// Sử dụng component
const images = [
  {
    src: "https://sihospital.com.vn/uploads/202408/34/GoyBFj-banner-web-donghanhcungme.jpg",
    alt: "Banner 1",
  },
  {
    src: "https://sihospital.com.vn/uploads/202405/19/Gtb3Zy-banner-top-3.jpg",
    alt: "Banner 2",
  },
  {
    src: "https://sihospital.com.vn/uploads/202501/00/6sUJyR-banner-web-trangchu-tet.jpg",
    alt: "Banner 3",
  },
  {
    src: "https://sihospital.com.vn/uploads/202411/48/WyeQHo-z6069886499276-de38ee5fafc544594cd857f15239e7c2.jpg",
    alt: "Banner 4",
  },
  {
    src: "https://sihospital.com.vn/uploads/202408/34/LUSFin-banner-web-nhatkydisinh.jpg",
    alt: "Banner 5",
  },
];

const App = () => {
  return (
    <div className=" mt-10">
      <Carousel images={images} />
    </div>
  );
};

export default App;
