
import React from 'react'
import { NavLink} from 'react-router-dom';

const ListItem = ({ children, endPoint }) => {

    return (

        <>
            <li>
                <NavLink
                    to={endPoint}
                    className="flex py-2 text-base font-medium text-dark hover:text-primary dark:text-white lg:ml-10 lg:inline-flex"
                >
                    {children}
                </NavLink>
            </li>
        </>
    );
};

export default ListItem;
