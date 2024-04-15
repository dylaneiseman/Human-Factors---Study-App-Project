import { Outlet } from 'react-router-dom';
import '@css/pages/Flashcards.scss';
import Back from '@components/Back';

function Flashcards(){
    return(
        <div id="flashcards">
            <Back/>
            <a className="page_h1" href="/flashcards/sets">Flashcards</a>
            <Outlet/>
        </div>
    )
}

export default Flashcards;