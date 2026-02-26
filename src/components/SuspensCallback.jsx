
import { Suspense} from 'react';


export default function SuspenseCallback({children}) {

    return (

        <Suspense fallback={<div className="bg-grey"> Loading ... </div>}>

            {children}

        </Suspense>
    );
}