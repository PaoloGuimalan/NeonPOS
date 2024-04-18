import { ipcRenderer } from 'electron';
import React, { useEffect, useState } from 'react'

function Terminal() {

  const [currentinput, setcurrentinput] = useState<string>("");
  const [terminalresults, setterminalresults] = useState<any[]>([]);

  useEffect(() => {
    window.ipc.on('command-output', (event: string) => {
      setterminalresults((prev: any) => [...prev, {
        type: "output",
        result: event
      }]);
    });
  
    window.ipc.on('command-error', (event: string) => {
      setterminalresults((prev: any) => [...prev, {
        type: "error",
        result: event
      }]);
    });
  },[]);

  return (
    <div className='bg-transparent w-full flex flex-col flex-1 justify-center gap-[5px]'>
      <span className='p-[15px]'>Terminal</span>
      <input 
        value={currentinput}
        className='w-full h-full bg-[#300a24] outline-none p-[15px] text-[14px]'
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setcurrentinput(e.target.value);
        }}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if(e.key === 'Enter'){
            window.ipc.send('execute-command', currentinput);
            setterminalresults((prev: any) => [...prev, {
              type: "input",
              result: currentinput
            }]);
            setcurrentinput("");
          }
        }}
      />
      <div className='w-full flex flex-col bg-[#300a24] p-[15px] gap-[10px]'>
        {terminalresults.map((mp: any, i: number) => {
          return(
            <div key={i} className='text-[12px] w-full flex flex-row gap-[5px]'>
              {mp.type === "input" && (
                <span className='font-semibold text-[#22ae68]'>Neon Shell &gt;</span>
              )}
              <span style={{
                color: mp.type === "error" ? "red" : "white"
              }} dangerouslySetInnerHTML={{ __html: mp.result }} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Terminal