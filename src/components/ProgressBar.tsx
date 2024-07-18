import { motion, useScroll } from "framer-motion";

export default function ScorllSection() {
  const { scrollYProgress } = useScroll();

  return (
    <>
      <motion.div style={{ scaleX: scrollYProgress }}>
        <hr className="border-4 border-orange-600" />
      </motion.div>
    </>
  );
}
