import React from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { SiteMedia } from '@/lib/types'

export function MediaCarousal({ slides }: { slides: SiteMedia[] }) {
  // Autoplay is great for luxury sites to keep the page "alive"
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })])

  return (
    <div className="overflow-hidden h-full rounded-xl z-[2] bg-gray-100" ref={emblaRef}>
      <div className="flex h-full">
        {slides.map((slide) => (
          <div className="relative flex-[0_0_100%] min-w-0 h-full" key={slide.id}>
            {slide.type === 'video' ? (
              <video
                src={slide.url}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover aspect-[3/4] transition-transform duration-500 ease-in-out hover:scale-[1.2]"
              />
            ) : (
              <img
                src={slide.url}
                alt="Studio Preview"
                className="w-full h-full object-cover aspect-[3/4] transition-transform duration-500 ease-in-out hover:scale-[1.2]"
              />
            )}
            
            {/* Optional Overlay to make text pop */}
            <div className="absolute inset-0 bg-black/10 pointer-events-none" />
          </div>
        ))}
      </div>
    </div>
  )
}