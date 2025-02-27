import React from 'react'
import Navbar from './Navbar'
import im from '../assets/login img.png'
import sec from '/src/assets/Screenshot 2025-02-26 at 11.52.21 PM.png'
import sec2 from '/src/assets/Screenshot 2025-02-26 at 11.52.44 PM.png'
import sec3 from '/src/assets/Screenshot 2025-02-26 at 11.53.01 PM.png'
import sec4 from '/src/assets/Screenshot 2025-02-26 at 11.53.25 PM.png'

const About = () => {
  return (
    <div>

      <Navbar/>
      <img  src={im} className='w-420' alt='#'/>
      <img  src={sec} alt='#'/>
      <img  src={sec2} alt='#'/>
      <img  src={sec3} alt='#'/>
      <img  src={sec4} alt='#'/>

      

    </div>
  )
}

export default About
