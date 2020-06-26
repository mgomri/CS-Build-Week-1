import React, { useState, useCallback, useRef } from 'react';
import produce, { setAutoFreeze } from 'immer';
import './css/App.scss'

const numRows = 50;
const numCols = 50;
let generation = 0;

let operations = [
  [1, 0],
  [0, 1],
  [1, 1],
  [-1, 0],
  [0, -1],
  [-1, 1],
  [1, -1],
  [-1, -1]
]

function App() {

 
  const emptyGrid = () => {
    const rows = []
    for(let i = 0; i < numRows; i++){
      rows.push(Array.from(Array(numCols), () => 0));
    }
    generation = 0;
    return rows;
  };

  const [grid, setGrid] = useState(() => {
    return emptyGrid();
  });
  
  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  
  const runSimulation = useCallback(() => {
          if(!runningRef.current){
              return;
          }
          
          setGrid(g => {
            
            return produce(g, gridCopy => {
              for (let i = 0; i < numRows; i++){
                for(let j = 0; j < numCols; j++ ){
                    let neighbors = 0;
                    operations.forEach(([x, y]) => {
                      const newI = i + x;
                      const newJ = j + y;
                      if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols){
                        neighbors += g[newI][newJ];
                      }
                    });
                    if(neighbors < 2 || neighbors > 3){
                      gridCopy[i][j] = 0;
                    }
                    else if(neighbors === 3 && g[i][j] === 0){
                      gridCopy[i][j] = 1;
                    }
                }
              }
              generation += 1;
              
            });
            
          });
          
          setTimeout(runSimulation, 500)
  }, []);



  return (
    <div className='app'>
      <div className='btn-div'>
    <button className='btn' 
      onClick={() => {
        setRunning(!running);
        if(!running){
        runningRef.current = true;
        runSimulation();
        }
      }}
      >
        {running? 'Stop': 'Start'}
      </button>

        <button 
          className='btn'
          onClick={() => {
            setGrid(emptyGrid())
        }}
        >
        Reset
      </button>
      </div>


      <div >
        <h4>Generation: {generation}</h4>
      </div>



    <div style={{
      display: 'grid',
      gridTemplateColumns:`repeat(${numCols}, 20px)`,
      
    }}
    >
      {grid.map((rows, i) => 
        rows.map((col, k) =>(
        <div 
          key ={`${i}-${k}`}
          onClick={() => {
            const newGrid = produce(grid, gridCopy => {
              gridCopy[i][k] = grid[i][k] ? 0 : 1;
            })
            setGrid(newGrid)
          }}
          style={{
            width:20, 
            height:20, 
            backgroundColor: grid[i][k]? 'black': undefined,
            border: 'solid 1px black'
        }}
         />
        ))
        
      )}

    </div>
    </div>
  );
}

export default App;
