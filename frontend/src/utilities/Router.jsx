import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import Landing from "@pages/Landing";
import NotFound from "@pages/NotFound";

import Application from "@pages/Application";
import Home from "@pages/Home";

import Courses from '@pages/Courses';
import ViewCourses, { OneCourse } from '@pages/CoursesView';
import NewCourse from '@forms/NewCourse';

import Assignments from '@pages/Assignments';
import ViewAssignments from '@pages/AssignmentView';
import NewAssignment from '@forms/NewAssignment';

import Flashcards from '@pages/Flashcards';
import ViewFlashcards, { OneSet } from '@pages/FlashcardsView';
import NewCard from '@forms/NewCard';
import NewSet from '@forms/NewSet';
import Play from '@pages/FlashcardsPlay';

import Settings from '@pages/Settings';


function Pages() {
    return(
        <Router>
            <Routes>
                <Route path="/" element={<Landing/>}/>
                <Route path="*" element={<NotFound />} />
                <Route element={<Application/>}>
                    <Route path="/home" element={<Home/>}/>
                    <Route path="/courses" element={<Courses/>}>
                        <Route path=":id" element={<OneCourse/>}/>
                        <Route path="new" element={<NewCourse/>}/>
                        <Route path="*" element={<Navigate to="/courses"/>}/>
                        <Route index element={<ViewCourses/>}/>
                    </Route>
                    <Route path="/assignments" element={<Assignments/>}>
                        <Route path=":id" element={<ViewAssignments/>}/>
                        <Route path="new" element={<NewAssignment/>}/>
                        <Route path="*" element={<Navigate to="/assignments"/>}/>
                        <Route index element={<ViewAssignments/>}/>
                    </Route>
                    <Route path="/flashcards" element={<Flashcards/>}>
                        <Route path="cards/new" element={<NewCard/>}/>
                        <Route path="sets/new" element={<NewSet/>}/>
                        <Route path="sets/:id" element={<OneSet/>}/>
                        <Route path="sets/:id/play" element={<Play/>}/>
                        <Route path="sets" element={<ViewFlashcards/>}/>
                        <Route path="*" element={<Navigate to="/flashcards/sets"/>}/>
                        <Route index element={<ViewFlashcards/>}/>
                    </Route>
                    <Route path="/settings" element={<Settings/>}/>
                </Route>
            </Routes>
        </Router>
    )
}

export default Pages;
