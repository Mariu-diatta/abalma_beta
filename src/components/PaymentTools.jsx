import React from 'react';

const PaymentCard = ({ children }) => {

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
