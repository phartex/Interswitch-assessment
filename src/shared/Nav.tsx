import React from 'react';
// import InterswitchImage from "../image/interswitch_logo.svg";
import InterswitchImage from "../image/interswitch_logo.svg";
import { useNavigate } from 'react-router-dom';

export default function Nav() {
    
    const navigate = useNavigate();
    return (

        <div className='md:flex md:justify-between items-center py-8 md:py-0 px-5 md:px-0 md:p-7'>
            <div className=''>
                {/* <img onClick={() => navigate('/')} src={InterswitchImage} alt="Interswitch Logo" /> */}
                {/* <img src={InterswitchImage} alt="Interswitch Logo" /> */}
                <img  alt="Interswitch Logo" />
            </div>
            <div className='pt-5'>
            <p className='font-bold text-lg'>Flight Management System</p>


            </div>


        </div>


    )
}
