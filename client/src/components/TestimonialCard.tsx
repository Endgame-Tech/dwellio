interface TestimonialCardProps {
  quote: string;
  name: string;
  title: string;
  image: string;
}

export default function TestimonialCard({ quote, name, title, image }: TestimonialCardProps) {
  return (
    <div className="group relative bg-white/10 rounded-[3rem] shadow-lg hover:shadow-xl border border-white/15 overflow-hidden h-[28rem] cursor-pointer transition-all duration-500">
      {/* Quote Side (Default State) */}
      <div className="absolute inset-0 p-8 flex flex-col justify-between opacity-100 group-hover:opacity-0 transition-opacity duration-500">
        {/* Quote Text */}
        <div className="flex-1 flex items-center">
          <p className="text-white leading-relaxed text-lg font-medium">
            "{quote}"
          </p>
        </div>

        {/* Author Info at Bottom */}
        <div className="flex items-center pt-6 border-t border-white/20">
          <div className="w-14 h-14 rounded-full overflow-hidden mr-4 flex-shrink-0">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover bg-top"
            />
          </div>
          <div>
            <p className="font-bold text-ubani-yellow text-base mb-1">
              {name}
            </p>
            <p className="text-white/80 text-sm">
              {title}
            </p>
          </div>
        </div>
      </div>

      {/* Image Side (Hover State) */}
      <div className="absolute inset-0 bg-top opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover bg-top"
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