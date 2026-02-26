import React, { useState, useRef} from 'react';
import OwnerPopover from './OwnerPopover';



export async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}


const OwnerAvatar = ({ owner }) => {

    const [showPopover, setShowPopover] = useState(false);

    const containerRef = useRef(null);

    if (!owner) return 

    return (

        <div className="relative inline-block " ref={containerRef}>

            {
                (owner?.image || owner?.photo_url) ?

                    <img

                        src={owner?.image || owner?.photo_url}

                        alt={owner?.nom || 'Fournisseur'}

                        className="h-8 w-8 rounded-full object-cover cursor-pointer ring-1 ring-gray-300 hover:ring-blue-500 transition z-[2999]"

                        title={owner?.nom}

                        onClick={() => {

                            setShowPopover((prev) => !prev);
                        }}
                    />
                    :
                    <svg
                        className="h-9 w-9 text-gray-800 dark:text-white cursor-pointer"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"

                        title={owner?.nom}

                        onClick={() => {

                            setShowPopover((prev) => !prev);

                        }}

                    >
                        <path
                            fillRule="evenodd"
                            d="M12 20a7.966 7.966 0 0 1-5.002-1.756l.002.001v-.683c0-1.794 1.492-3.25 3.333-3.25h3.334c1.84 0 3.333 1.456 3.333 3.25v.683A7.966 7.966 0 0 1 12 20ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10c0 5.5-4.44 9.963-9.932 10h-.138C6.438 21.962 2 17.5 2 12Zm10-5c-1.84 0-3.333 1.455-3.333 3.25S10.159 13.5 12 13.5c1.84 0 3.333-1.455 3.333-3.25S13.841 7 12 7Z"
                            clipRule="evenodd"
                        />
                    </svg>
            }

            {
                owner?.is_connected &&

                <span className="absolute -right-0.5 -top-0.5 block h-[14px] w-[14px] rounded-full border-[2.3px] border-white bg-[#219653] dark:border-dark"></span>
            }

            {
                showPopover && (

                    <OwnerPopover owner={owner} onClose={() => setShowPopover(false)} />
                )
            }
        </div>
    );
};

export default OwnerAvatar;
