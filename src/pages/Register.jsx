import React from 'react'
import HomeLayout from '../layouts/HomeLayout';
import RegisterForm from '../components/Form';
import SuspenseCallback from '../components/SuspensCallback';

const Register = () => {

    return (

        <SuspenseCallback>

            <HomeLayout>

                <RegisterForm />

            </HomeLayout>

        </SuspenseCallback>
    )
}

export default Register;