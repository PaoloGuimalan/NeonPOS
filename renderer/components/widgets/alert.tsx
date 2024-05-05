import { useEffect, useState } from 'react'
import { motion } from 'framer-motion';
import { AiFillCheckCircle, AiFillInfoCircle, AiFillWarning } from 'react-icons/ai'
import { IoMdClose, IoMdCloseCircle } from 'react-icons/io'

function Alert({al}: any) {

  const [timerUnToggle, settimerUnToggle] = useState(true);
  const [displayUntoggle, setdisplayUntoggle] = useState(true);

  useEffect(() => {
    if(al.type != "incomingcall"){
      setTimeout(() => {
          settimerUnToggle(false)
      }, 3000)
      setTimeout(() => {
          setdisplayUntoggle(false)
      },3500)
    }
  }, [])

  const alertIcons: any = {
    success: {
      title: "Success",
      component: <AiFillCheckCircle style={{ fontSize: "25px", color: "white" }} />
    },
    info: {
      title: "Info",
      component: <AiFillInfoCircle style={{ fontSize: "25px", color: "white" }} />
    },
    warning: {
      title: "Warning",
      component: <AiFillWarning style={{ fontSize: "25px", color: "white" }} />
    },
    error: {
      title: "Error",
      component: <IoMdCloseCircle style={{ fontSize: "25px", color: "white" }} />
    },
    incomingcall: {
      title: "Incoming Call",
      component: null
    }
  }

  return (
    <motion.div
      initial={{
          marginLeft: "-800px"
      }}
      animate={{
          marginLeft: timerUnToggle? "0px" : "-800px",
          display: displayUntoggle? "flex" : "none"
      }}
      className={`div_alerts_prompt ${al.type} z-[3]`}>
          <div id='div_header_alert'>
          {alertIcons[al.type].component}
          <span id='span_header_label'>{alertIcons[al.type].title}</span>
          <div id='div_close_alert_container'>
              <button id='btn_close_alert'>
                <IoMdClose style={{ fontSize: "20px", color: "white", fontWeight: "bold" }} />
              </button>
          </div>
          </div>
          <div id='div_alert_content_container'>
          <p id='p_alert_content' className='tw-text-left'>{al.content}</p>
        </div>
    </motion.div>
  )
}

export default Alert