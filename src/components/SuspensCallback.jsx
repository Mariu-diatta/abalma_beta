
import { Suspense} from 'react';


export default function SuspenseCallback({children}) {
    return (
        <Suspense fallback={<div> Loading ... </div>}>
            {children}
        </Suspense>
    );
}