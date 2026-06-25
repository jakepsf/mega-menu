export default function DotsIcon() {
    return (
        <svg 
            width="40" 
            height="40" 
            viewBox="0 0 100 100" 
            className="fill-accent overflow-visible" // Added overflow-visible just in case
        >
            {[...Array(8)].map((_, i) => {
                // We only want the top-ish dots (indices 4, 5, 6, 7, 0 are usually the top half)
                // Based on your image, it looks like 6 dots in a horseshoe shape.
                if (i === 2 || i === 3) return null; 

                return (
                    <circle
                        key={i}
                        cx={50 + 32 * Math.cos((i * 45 * Math.PI) / 180)} // Reduced 35 to 32
                        cy={50 + 32 * Math.sin((i * 45 * Math.PI) / 180)} // Reduced 35 to 32
                        r="8" // Reduced 9 to 8 for more breathing room
                    />
                );
            })}
        </svg>
    );
}