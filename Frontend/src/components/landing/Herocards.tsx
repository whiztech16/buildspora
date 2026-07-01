import { useEffect, useState } from "react";
import landSecuredImg from "../../assets/images/land secured.png";
import sitePreparationImg from "../../assets/images/sitepreparation.jpg";
import foundationImg from "../../assets/images/foundation.jpg";
import blockworkImg from "../../assets/images/blockwork.jpg";
import roofingImg from "../../assets/images/roofing.jpg";

interface Milestone {
  title: string;
  rotate: number;
  translateY: number;
  image: string;
}

const milestones: Milestone[] = [
  {
    title: "Land Secured",
    rotate: -6,
    translateY: 32,
    image: landSecuredImg,
  },
  {
    title: "Site Preparation",
    rotate: -4.2,
    translateY: 17,
    image: sitePreparationImg,
  },
  {
    title: "Foundation",
    rotate: -2.2,
    translateY: 6,
    image: foundationImg,
  },
  {
    title: "Block Work",
    rotate: -0.9,
    translateY: 0,
    image: blockworkImg,
  },
  {
    title: "Roofing",
    rotate: 1.9,
    translateY: 1,
    image: roofingImg,
  },
  {
    title: "Electrical",
    rotate: 2,
    translateY: 6,
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=600&fit=crop",
  },
  {
    title: "Finishing",
    rotate: 4.4,
    translateY: 17,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=600&fit=crop",
  },
  {
    title: "Completed",
    rotate: 4.3,
    translateY: 32,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=600&fit=crop",
  },
];

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 768 : true
  );
  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return isDesktop;
}

export default function MilestoneCards() {
  const isDesktop = useIsDesktop();

  return (
    <div>
      {/* Cards row */}
      <div
        style={{
          /* Moved gap into padding so the scroll container has room for rotated cards/shadows */
          paddingTop: isDesktop ? "28px" : "24px",
          paddingBottom: "40px",
          display: "flex",
          justifyContent: isDesktop ? "center" : "flex-start",
          alignItems: "flex-start",
          gap: isDesktop ? "10px" : "12px",
          overflowX: isDesktop ? "visible" : "auto",
          paddingLeft: isDesktop ? "0" : "32px",
          paddingRight: isDesktop ? "0" : "32px",
          scrollSnapType: isDesktop ? "none" : "x mandatory",
          WebkitOverflowScrolling: "touch",
        }}
        className={isDesktop ? "" : "[&::-webkit-scrollbar]:hidden"}
      >
        {milestones.map((item) => (
          <div
            key={item.title}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flexShrink: 0,
              scrollSnapAlign: isDesktop ? "none" : "start",
            }}
          >
            {/* Card with bent top */}
            <div
              className={
                isDesktop
                  ? "relative w-[140px] h-[210px] overflow-hidden rounded-t-2xl rounded-b-xl"
                  : "relative w-[120px] h-[180px] overflow-hidden rounded-t-2xl rounded-b-lg"
              }
              style={{
                transform: `rotate(${item.rotate}deg) translateY(${item.translateY}px)`,
                boxShadow: "0 6px 18px rgba(20,30,60,0.13)",
              }}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover block"
              />
            </div>

            {/* Label */}
            <p
              style={{
                marginTop: "14px",
                fontSize: isDesktop ? "13px" : "11px",
                fontWeight: 500,
                color: "#334155",
                textAlign: "center",
                whiteSpace: "nowrap",
                transform: `translateY(${item.translateY}px)`,
              }}
            >
              {item.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}