import TodoAssignments from "@components/TodoAssignment";
import TodoCourse from "@components/TodoCourse";


function Todo(){
    return(
        <div id="todo">
            <div className="top">
                <div className="db-link">dashboard</div>
            </div>
            <div className="list">

                <TodoCourse/>
                <TodoAssignments/>
                
            </div>
        </div>
    )
}

export default Todo;