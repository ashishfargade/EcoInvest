const CustomLoader = () => {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-300">
        <div className="text-center">
          <h2
            className="text-2xl sm:text-3xl text-slate-700 font-orbitron typing-loader"
          >
            Loading...
          </h2>
        </div>
  
        <style>
          {`
            .font-orbitron {
              font-family: 'Orbitron', sans-serif;
            }
  
            .typing-loader {
              display: inline-block;
              white-space: nowrap;
              overflow: hidden;
              border-right: 2px solid #3b82f6;
              width: 0;
              animation: typing 2s steps(10, end) forwards, blink 0.75s step-end infinite;
            }
  
            @keyframes typing {
              from { width: 0 }
              to { width: 10ch }
            }
  
            @keyframes blink {
              50% { border-color: transparent }
            }
          `}
        </style>
      </div>
    );
  };
  
  export default CustomLoader;