import { Outlet } from 'react-router-dom';
import '@css/pages/Courses.scss';
import Back from '@components/Back';

function Courses(){
    return(
        <div id="courses">
            <Back/>
            <a className="page_h1" href="/courses">Courses</a>
            <Outlet/>
        </div>
    )
}

export default Courses;