import { Outlet } from 'react-router-dom';
import '@css/pages/Flashcards.scss';

function Flashcards(){
    return(
        <div id="flashcards">
            <a className="page_h1" href="/flashcards/sets">Flashcard sets</a>
            <Outlet/>
        </div>
    )
}

export default Flashcards;