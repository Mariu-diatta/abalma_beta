import React from 'react';
import { useSelector } from 'react-redux';

const PaymentCard = ({ children }) => {

    const currentUser = useSelector(state => state.auth.user);

    if (!currentUser || !currentUser?.is_connected) {

        alert("Vous devrez vous connecter/ You used to login")

        return
    }

    return (

        <section className="mb-0 w-full">

            <div className="flex justify-center items-center max-w-screen-xl mx-auto px-4 py-8 lg:py-16">

                <div className="w-full">

                    {children}

                </div>

            </div>

        </section>
    );
};

export default PaymentCard;
