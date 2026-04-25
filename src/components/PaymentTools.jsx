import React from 'react';
import { useSelector } from 'react-redux';

const PaymentCard = ({ children }) => {

    const currentUser = useSelector(state => state.auth.user);

    const noCurrentUserOrNotConnected = !currentUser || !currentUser?.is_connected

    if (noCurrentUserOrNotConnected) {

        alert("Vous devrez vous connecter/ You used to login")

        return
    }

    return (


            <div className="w-full h-full overflow-y-auto flex justify-center items-center  mx-auto px-2 py-8 lg:py-16">


               {children}


            </div>

    );
};

export default PaymentCard;
