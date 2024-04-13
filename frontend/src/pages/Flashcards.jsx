import { Outlet } from 'react-router-dom';

function Flashcards(){
    return(
        <div id="flashcards">
            flashcards
            <Outlet/>
        </div>
    )
}

export default Flashcards;