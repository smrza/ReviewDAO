import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import MainPage from './pages/MainPage';
import ListPage from './pages/ListPage';
import ItemApplyPage from './pages/ItemApplyPage';
import ListApplyPage from './pages/ListApplyPage';
import ItemsApplicantsPage from './pages/ItemsApplicantsPage';

export default () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path='/' element={<MainPage />} />
                <Route path='/lists/:listname' element={<ListPage />} />
                <Route path='/:listname/apply' element={<ItemApplyPage />} />
                <Route path='/:listname/applicants' element={<ItemsApplicantsPage />} />
                <Route path='/list/apply' element={<ListApplyPage />} />
            </Routes>
        </BrowserRouter>
    );
};