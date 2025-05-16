import React from 'react'

const PaymentCard = ({children })=>{
    return(
        <section className="bg-white dark:bg-gray-900  mb-0 w-auto">
            <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
                <div className=" lg:mt-0 lg:col-span-5 lg:flex">
                    {children}
                </div>                
            </div>
        </section>
     )
}

export default PaymentCard;