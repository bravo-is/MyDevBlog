import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function Greeting({ greetings }: { greetings: string[] }) {
    const [currentGreetingIndex, setCurrentGreeting] = useState(0);
    
    function getNextGreetingIndex():void {
        const nextIndex = currentGreetingIndex + 1;
        if (nextIndex >= greetings.length) {
            setCurrentGreeting(0);
            return;
        }
        setCurrentGreeting(currentGreetingIndex+1);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            getNextGreetingIndex();
        }, 3000); // Change every 3 seconds

        // Cleanup function to clear the interval when the component unmounts
        return () => clearInterval(interval);
    }, [currentGreetingIndex]); // Add currentGreetingIndex to the dependency array

    return (
        <motion.div 
            key={currentGreetingIndex}
            initial={{ opacity: 0, x: -100}} 
            animate={{ opacity: 1, x: 0}} 
            transition={{ type: "spring", duration: 1}}
        >
            {greetings[currentGreetingIndex]}!
        </motion.div>
    );
};

export default Greeting;