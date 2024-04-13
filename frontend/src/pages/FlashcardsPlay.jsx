import { Outlet } from 'react-router-dom';

function Play(){
    return(
        <div id="flashcards-play">
            flashcards play!!
            <Outlet/>
        </div>
    )
}

export default Play;