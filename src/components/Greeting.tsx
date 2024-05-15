import { useState } from 'react';

function Greeting({ greetings }: { greetings: string[] }) {
    function getRandomIndex(): number {return Math.floor(Math.random() * greetings.length)};
    const [currentGreeting, setCurrentGreeting] = useState(greetings[getRandomIndex()]);

    function getRandomGreeting():void {
        const randomIndex = Math.floor(getRandomIndex());
        setCurrentGreeting(greetings[randomIndex]);
    };

    return (
        <div>
            <h3>{currentGreeting}! Thank you for visiting!</h3>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={getRandomGreeting}>New Greeting</button>
        </div>
    );
};


export default Greeting;