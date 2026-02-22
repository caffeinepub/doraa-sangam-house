export default function HeroBanner() {
  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-2xl mb-12">
      <img
        src="/assets/generated/product-banarasi.dim_800x1000.png"
        alt="New Arrivals Showcase"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-center pb-16">
        <div className="text-center space-y-4 px-4">
          <h2
            className="text-4xl md:text-6xl font-serif font-bold"
            style={{
              color: '#D4AF37',
              textShadow: '0 0 20px rgba(212,175,55,0.8)',
            }}
          >
            New Arrivals
          </h2>
          <p className="text-2xl md:text-3xl font-semibold text-white">Flat 60% Off</p>
        </div>
      </div>
    </div>
  );
}
