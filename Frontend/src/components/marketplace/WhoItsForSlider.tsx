import { useState, useEffect } from "react";

const slides = [
  {
    id: 1,
    label: "The BuildSpora Way",
    isBuildSporaWay: true,
    points: [
      "Funds locked in a dedicated project vault",
      "Contractor captures live GPS-stamped updates",
      "Photos taken live on camera — no uploads from gallery",
      "You approve every naira before it moves",
      "Full transaction history. Every naira tracked.",
      "Find verified talents and buy from verified marketplace",
    ],
  },
  {
    id: 2,
    label: "Who It's For",
    title: "Diaspora Clients",
    subtitle: "Fund and monitor your property from anywhere in the world",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80",
  },
  {
    id: 3,
    label: "Who It's For",
    title: "Contractors",
    subtitle: "Get paid milestone by milestone as you complete verified work",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
  },
  {
    id: 4,
    label: "Who It's For",
    title: "Suppliers & Talent",
    subtitle: "Find talents and easily purchase materials from verified vendors",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80",
  },
];

export default function WhoItsForSlider() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      goTo((current + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [current]);

  function goTo(index: number) {
    if (animating || index === current) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setAnimating(false);
    }, 300);
  }

  const slide = slides[current];

  return (
    <div style={styles.card as React.CSSProperties}>

      {/* Slide 1 — solid emerald green */}
      {slide.isBuildSporaWay && (
        <div style={{
          ...styles.bgSolid,
          opacity: animating ? 0 : 1,
          transition: "opacity 0.3s ease",
        } as React.CSSProperties} />
      )}

      {/* Slides 2-4 — image + dark overlay */}
      {!slide.isBuildSporaWay && (
        <>
          <div style={{
            ...styles.bgImage,
            backgroundImage: `url(${slide.image})`,
            opacity: animating ? 0 : 1,
            transition: "opacity 0.3s ease",
          } as React.CSSProperties} />
          <div style={styles.overlay as React.CSSProperties} />
        </>
      )}

      {/* Content */}
      <div style={styles.content as React.CSSProperties}>

        {/* Top badge */}
        <div style={{
          ...styles.badge,
          color: slide.isBuildSporaWay ? "#065f46" : "#ffffff",
          background: slide.isBuildSporaWay ? "rgba(5, 150, 105, 0.1)" : "rgba(255,255,255,0.18)",
          borderColor: slide.isBuildSporaWay ? "rgba(5, 150, 105, 0.2)" : "rgba(255,255,255,0.3)",
        } as React.CSSProperties}>{slide.label}</div>

        {/* Middle Content */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          justifyContent: slide.isBuildSporaWay ? "center" : "flex-end",
          paddingBottom: "24px"
        }}>
          {slide.isBuildSporaWay ? (
            <div style={{
              opacity: animating ? 0 : 1,
              transform: animating ? "translateY(8px)" : "translateY(0)",
              transition: "opacity 0.3s ease, transform 0.3s ease",
            }}>
              <h2 style={{ ...styles.title, color: "#065f46", fontSize: "clamp(20px, 2.2vw, 28px)", marginBottom: "20px" } as React.CSSProperties}>
                The BuildSpora Way
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {slide.points.map((point, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                    <div style={{
                      ...styles.checkCircle as React.CSSProperties,
                      background: "#059669",
                      borderColor: "transparent",
                      boxShadow: "0 4px 6px -1px rgba(5, 150, 105, 0.2)",
                    }}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span style={{ color: "#1f2937", fontSize: "14px", fontFamily: "Inter, sans-serif", lineHeight: 1.5, fontWeight: 500 }}>
                      {point}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <h2 style={{
                ...styles.title,
                opacity: animating ? 0 : 1,
                transform: animating ? "translateY(8px)" : "translateY(0)",
                transition: "opacity 0.3s ease, transform 0.3s ease",
              } as React.CSSProperties}>
                {slide.title}
              </h2>
              <p style={{
                ...styles.subtitle,
                opacity: animating ? 0 : 1,
                transition: "opacity 0.3s ease 0.05s",
              } as React.CSSProperties}>
                {slide.subtitle}
              </p>
            </>
          )}
        </div>

        {/* Dots — equal circles, no expanding */}
        <div style={styles.dots as React.CSSProperties}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                ...styles.dot,
                background: i === current 
                  ? (slide.isBuildSporaWay ? "#059669" : "#ffffff") 
                  : (slide.isBuildSporaWay ? "rgba(5,150,105,0.2)" : "rgba(255,255,255,0.4)"),
                transform: i === current ? "scale(1.25)" : "scale(1)",
                transition: "all 0.3s ease",
              } as React.CSSProperties}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    position: "relative",
    borderRadius: "32px", // Changed to match the problem solution card radius
    overflow: "hidden",
    height: "100%", // Changed to 100% to fill the parent height nicely
    minHeight: "480px",
    minWidth: "0", // Removed 300px to prevent overflow on very small screens
    width: "100%",
    flex: 1,
    userSelect: "none",
  },
  bgSolid: {
    position: "absolute",
    inset: 0,
    background: "#ecfdf5",
    zIndex: 0,
  },
  bgImage: {
    position: "absolute",
    inset: 0,
    backgroundSize: "cover",
    backgroundPosition: "center",
    zIndex: 0,
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.65) 100%)",
    zIndex: 1,
  },
  content: {
    position: "relative",
    zIndex: 2,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "28px",
  },
  badge: {
    display: "inline-block",
    alignSelf: "flex-start",
    background: "rgba(255,255,255,0.18)",
    backdropFilter: "blur(8px)",
    border: "1px solid rgba(255,255,255,0.3)",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "500",
    padding: "6px 14px",
    borderRadius: "20px",
    fontFamily: "Inter, sans-serif",
  },
  bottom: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  title: {
    color: "#ffffff",
    fontSize: "clamp(28px, 3.5vw, 40px)",
    fontWeight: "800",
    fontFamily: "Inter, sans-serif",
    margin: "0 0 8px 0",
    lineHeight: 1.15,
    letterSpacing: "-0.5px",
  },
  subtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: "15px",
    fontFamily: "Inter, sans-serif",
    margin: "0 0 16px 0",
    lineHeight: 1.55,
    fontWeight: "400",
    maxWidth: "340px",
  },
  dots: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    padding: 0,
  },
  checkCircle: {
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.25)",
    border: "1.5px solid rgba(255,255,255,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: "1px",
  },
};
