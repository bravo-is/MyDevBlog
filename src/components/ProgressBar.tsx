import { motion, useScroll } from "framer-motion";
import { useState, useEffect } from "react";

export default function ScorllSection() {
  const { scrollYProgress } = useScroll();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show progress bar after scrolling 200px
      setIsVisible(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="h-1 bg-[linear-gradient(90deg,hsl(30_100%_50%),hsl(30_100%_70%))] dark:bg-[linear-gradient(90deg,hsl(265_55%_30%),hsl(265_55%_60%))]" />
    </motion.div>
  );
}
