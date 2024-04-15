import { Outlet } from 'react-router-dom';

import '@css/pages/Assignments.scss';
import Back from '@components/Back';

function Assignments(){
    return(
        <div id="assignments">
            <Back/>
            <a className="page_h1" href="/assignments">Assignments</a>
            <Outlet/>
        </div>
    )
}

export default Assignments;