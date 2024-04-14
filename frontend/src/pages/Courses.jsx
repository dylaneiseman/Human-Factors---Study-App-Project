import { Outlet } from 'react-router-dom';
import '@css/pages/Courses.scss';

function Courses(){
    return(
        <div id="courses">
            <a className="page_h1" href="/courses">Courses</a>
            <Outlet/>
        </div>
    )
}

export default Courses;