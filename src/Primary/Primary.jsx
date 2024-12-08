import { useEffect, useRef } from "react";
import '../Primary/Primary.css'
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import rose from '../assets/rose.png'
import { FaUserCircle } from "react-icons/fa";

function Primary({ primary, setPrimary, loggedUser}){
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
            
            {loggedUser?.uid === "vahnessa.gonzales@gmail.com" ? (
  <>
    <div className='id-img-container'>
      <img 
        className='id-img'
        src={rose}
        alt="User profile" 
      />
    </div>
    <hr />
    <div className='id-phone-email-container'>
      <p className='id-phone-email-container-p'>
        <MdEmail className='email-icon' /> {loggedUser.uid}
      </p>
      <p className='id-phone-email-container-p'>
        <FaPhoneAlt className='phone-icon' /> {loggedUser.id}
      </p>
    </div>
  </>
) : (
    <>
      <div className='id-img-container'>
        <FaUserCircle
        className='id-img' />
      </div>
      <hr />
      <div className='id-phone-email-container'>
        <p className='id-phone-email-container-p'>
          <MdEmail className='email-icon' /> {loggedUser.uid}
        </p>
        <p className='id-phone-email-container-p'>
          <FaPhoneAlt className='phone-icon' /> {loggedUser.id}
        </p>
      </div>
    </>
  )}

        </div>
        )}
    </div>            
    )
}

export default Primary;