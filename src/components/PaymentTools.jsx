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

        <section className="mb-0 w-full h-full overflow-y-auto">

            <div className="h-full flex justify-center items-center max-w-screen-xl mx-auto px-1 py-8 lg:py-16">


               {children}


            </div>

        </section>
    );
};

export default PaymentCard;
