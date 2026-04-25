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

        <section className="h-full w-full overflow-y-auto">
            <div className="mx-auto flex max-w-screen-xl items-center justify-center px-4 py-8 lg:py-16">
                {children}
            </div>
        </section>
    );
};

export default PaymentCard;
