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
      style={{ scaleX: scrollYProgress }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.2 }}
    >
      <hr className="border-4 border-orange-600" />
    </motion.div>
  );
}
