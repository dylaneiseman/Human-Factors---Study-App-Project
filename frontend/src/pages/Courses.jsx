import { Outlet } from 'react-router-dom';

function Courses(){
    return(
        <div id="courses">
            course
            <Outlet/>
        </div>
    )
}

export default Courses;