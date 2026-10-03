import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

export interface CarouselItem {
  id: number;
  title: string;
  category: string;
  image: string;
  rating?: number;
  description: string;
}

const DEFAULT_ITEMS: CarouselItem[] = [
  {
    id: 1,
    title: "Luxury Villa Renovation",
    category: "Interior & Renovation",
    image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    rating: 5,
    description: "Complete interior overhaul including smart home integration and marble flooring."
  },
  {
    id: 2,
    title: "Skyline Corporate Tower",
    category: "Construction Services",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    rating: 5,
    description: "Structural framework and glass facade installation for a 20-story complex."
  },
  {
    id: 3,
    title: "Building Repair & Structural Restoration",
    category: "Building Society Services",
    image: "/src/assets/images/building_repair_1782069406615.jpg",
    rating: 5,
    description: "Comprehensive exterior plastering, structural concrete repairs, waterproofing, and high-rise scaffolding."
  },
  {
    id: 4,
    title: "Hassle-Free Labour Provision",
    category: "Labor & Placement Services",
    image: "/src/assets/images/hassle_free_labour_1782069648076.jpg",
    rating: 5,
    description: "Reliable and fully vetted contract laborers for major projects, completely managed and supported by Construction Mart SHK."
  },
  {
    id: 5,
    title: "Instant Labour (Labour Naka) Provision",
    category: "On-Demand Resource Care",
    image: "/src/assets/images/instant_labour_ready_1782069663895.jpg",
    rating: 5,
    description: "Rapid dispatch of skilled masons, civil carpenters, steel fitters, and helpers directly to your active construction sites."
  },
  {
    id: 6,
    title: "Modern Open Kitchen",
    category: "Home Services",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    rating: 5,
    description: "Custom cabinetry and island installation with premium granite finish."
  }
];

interface ServiceCarouselProps {
  items?: CarouselItem[];
  autoPlayInterval?: number;
}

const ServiceCarousel: React.FC<ServiceCarouselProps> = ({ items = DEFAULT_ITEMS, autoPlayInterval = 5000 }) => {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [items, autoPlayInterval]);

  if (!items || items.length === 0) return null;

  return (
    <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden shadow-lg mb-8 group bg-gray-900">
      {/* Slides */}
      <div 
        className="flex transition-transform duration-700 ease-out h-full"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {items.map((item) => (
          <div key={item.id} className="min-w-full h-full relative">
            <img 
              src={item.image} 
              alt={item.title} 
              className="w-full h-full object-cover opacity-90"
              referrerPolicy="no-referrer"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-12">
              <div className="transform transition-all duration-500 translate-y-0">
                <span className="inline-block px-3 py-1 bg-orange-600 text-white text-xs font-bold rounded-full mb-3 shadow-lg shadow-orange-900/50">
                  {item.category}
                </span>
                <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 drop-shadow-md">{item.title}</h2>
                <div className="flex items-center gap-2 mb-3">
                  {item.rating && (
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={18} fill={i < item.rating! ? "currentColor" : "none"} strokeWidth={i < item.rating! ? 0 : 2} />
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-gray-200 text-sm md:text-lg max-w-3xl leading-relaxed drop-shadow-sm hidden md:block">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md hover:bg-white text-white hover:text-gray-900 p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 z-10"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md hover:bg-white text-white hover:text-gray-900 p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 z-10"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 rounded-full transition-all shadow-sm ${
              current === index ? 'bg-orange-500 w-8' : 'bg-white/40 hover:bg-white w-2'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ServiceCarousel;