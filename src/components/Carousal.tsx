'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { ReactNode } from 'react';

interface SliderProps<T> {
  data: T[];
  renderItem: (item: T) => ReactNode;
  containerClassName?: string;
  slideClassName?: string;
}

export function Slider<T>({ 
  data, 
  renderItem, 
  containerClassName = "flex gap-4", 
  slideClassName = ""
}: SliderProps<T>) {
  const [emblaRef] = useEmblaCarousel({ loop: false, align: 'start' });

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className={containerClassName}>
        {data.map((item, index) => (
          <div key={index} className={slideClassName}>
            {renderItem(item)}
          </div>
        ))}
      </div>
    </div>
  );
}