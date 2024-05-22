import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function Greeting({ greetings }: { greetings: string[] }) {
    function getRandomIndex(): number {return Math.floor(Math.random() * greetings.length)};
    const [currentGreeting, setCurrentGreeting] = useState(greetings[0]);

    useEffect(() => {
        const interval = setInterval(() => {
            getRandomGreeting();
        }, 3000); // Change every 3 seconds

        // Cleanup function to clear the interval when the component unmounts
        return () => clearInterval(interval);
    }, []); // Empty dependency array means this effect runs once on mount and cleanup on unmount

    function getRandomGreeting():void {
        const randomIndex = getRandomIndex();
        setCurrentGreeting(greetings[randomIndex]);
    };

    return (
        <motion.div 
            key={currentGreeting}
            initial={{ opacity: 0, x: -100}} 
            animate={{ opacity: 1, x: 0}} 
            transition={{ type: "spring", duration: 1}}
        >
            {currentGreeting}!
        </motion.div>
    );
};

export default Greeting;