import { useEffect, useRef } from "react";
import '../Primary/Primary.css'
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import rose from '../assets/rose.png'
function Primary({ primary, setPrimary}){
    const containerRef = useRef(null);
      // Close `primary` when clicking outside the container
      useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setPrimary(false); // Close the primary view
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [setPrimary]);
    return(
        <div>
        {primary && (
            <div className={`primary-container ${primary ? '' : 'hidden'}`} ref={containerRef} data-testid = 'primary'>
            
            <div className='id-img-container'>
                <img 
                className='id-img'
                src= {rose}/>
            </div>
            <hr></hr>
            <div className='id-phone-email-container' >
                <p className='id-phone-email-container-p'><MdEmail
                className = 'email-icon'/> vahnessa.gonzales@gmail.com</p>
                <p className='id-phone-email-container-p'><FaPhoneAlt
                className = 'phone-icon'/> 14</p>
            </div>
    
        </div>
        )}
    </div>            
    )
}

export default Primary;