import ExportedImage from 'next-image-export-optimizer';
import DragScroll from './DragScroll';
import { galleryImages } from '@/lib/data';

export default function Gallery() {
  return (
    <DragScroll className="scrollbar-hide carousel-mask overflow-x-auto pb-2">
      <div className="flex w-max gap-4 px-1">
        {galleryImages.map((img) => (
          <div
            key={img.src}
            className="relative h-56 flex-shrink-0 overflow-hidden rounded-2xl bg-sand sm:h-72"
            style={{ aspectRatio: '3 / 2' }}
          >
            <ExportedImage
              src={img.src}
              alt={img.alt}
              fill
              draggable={false}
              sizes="(min-width: 640px) 432px, 336px"
              className="pointer-events-none object-cover"
            />
          </div>
        ))}
      </div>
    </DragScroll>
  );
}
