import React, { useState, useEffect } from 'react';

const MorphingBox = () => {
  const [isCircle, setIsCircle] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);
  const colors = ['#3498db', '#9b59b6', '#e91e63', '#e74c3c', '#2ecc71'];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsCircle(prev => !prev);
      setColorIndex(prev => (prev + 1) % colors.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="scene3d">
      <div 
        className={`box3d ${isCircle ? 'circle' : ''}`}
        style={{ 
          backgroundColor: colors[colorIndex],
          boxShadow: `0 20px 50px ${colors[colorIndex]}80`
        }}
      />
    </div>
  );
};

export default MorphingBox;