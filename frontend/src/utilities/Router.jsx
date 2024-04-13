import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Landing from "@pages/Landing";
import NotFound from "@pages/NotFound";

import Application from "@pages/Application";
import Home from "@pages/Home";

import Courses from '@pages/Courses';
import ViewCourses from '@pages/CoursesView';
import NewCourse from '@forms/NewCourse';

import Assignments from '@pages/Assignments';
import ViewAssignments from '@pages/AssignmentView';
import NewAssignment from '@forms/NewAssignment';

import NewFlashcard from '@forms/NewFlashcard';
import NewFlashcardGroup from '@forms/NewFlashcardGroup';


function Pages() {
    return(
        <Router>
            <Routes>
                <Route path="/" element={<Landing/>}/>
                <Route path="*" element={<NotFound />} />
                <Route element={<Application/>}>
                    <Route path="/home" element={<Home/>}/>
                    <Route path="/courses" element={<Courses/>}>
                        <Route path=":id" element={<ViewCourses/>}/>
                        <Route path="new" element={<NewCourse/>}/>
                        <Route index element={<ViewCourses/>}/>
                    </Route>
                    <Route path="/assignments" element={<Assignments/>}>
                        <Route path=":id" element={<ViewAssignments/>}/>
                        <Route path="new" element={<NewAssignment/>}/>
                        <Route index element={<ViewAssignments/>}/>
                    </Route>
                    <Route path="/flashcards" element={<NewFlashcardGroup/>}>
                        <Route path="thing" element={<NewFlashcard/>}/>
                    </Route>
                </Route>
            </Routes>
        </Router>
    )
}

export default Pages;
