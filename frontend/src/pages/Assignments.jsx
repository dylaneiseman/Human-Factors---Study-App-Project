import { Outlet } from 'react-router-dom';
import '@css/pages/Assignments.scss';

function Assignments(){
    return(
        <div id="assignments">
            <a className="page_h1" href="/assignments">Assignments</a>
            <Outlet/>
        </div>
    )
}

export default Assignments;