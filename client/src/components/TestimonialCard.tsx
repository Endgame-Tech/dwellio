interface TestimonialCardProps {
  quote: string;
  name: string;
  title: string;
  image: string;
}

export default function TestimonialCard({ quote, name, title, image }: TestimonialCardProps) {
  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 overflow-hidden h-[28rem] cursor-pointer transition-all duration-500">
      {/* Quote Side (Default State) */}
      <div className="absolute inset-0 p-8 flex flex-col justify-between opacity-100 group-hover:opacity-0 transition-opacity duration-500">
        {/* Quote Text */}
        <div className="flex-1 flex items-center">
          <p className="text-gray-700 leading-relaxed text-lg font-medium">
            "{quote}"
          </p>
        </div>
        
        {/* Author Info at Bottom */}
        <div className="flex items-center pt-6 border-t border-gray-100">
          <div className="w-12 h-12 rounded-full overflow-hidden mr-4 flex-shrink-0">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-base mb-1">
              {name}
            </p>
            <p className="text-gray-500 text-sm">
              {title}
            </p>
          </div>
        </div>
      </div>

      {/* Image Side (Hover State) */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
        
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        {/* Person Info Overlay */}
        <div className="absolute bottom-8 left-8 right-8 text-white">
          <p className="font-bold text-2xl mb-2 leading-tight">
            {name}
          </p>
          <p className="text-white/90 text-lg">
            {title}
          </p>
        </div>
      </div>
    </div>
  );
}