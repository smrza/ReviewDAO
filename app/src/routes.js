import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import MainPage from './pages/MainPage';
import ListPage from './pages/ListPage';
import ItemApplyPage from './pages/ItemApplyPage';
import ListApplyPage from './pages/ListApplyPage';
import ItemsApplicantsPage from './pages/ItemsApplicantsPage';
import ListApplicantsPage from './pages/ListApplicantsPage'

export default () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path='/' element={<MainPage />} />
                <Route path='/lists/:listAddress' element={<ListPage />} />
                <Route path='/:listAddress/apply' element={<ItemApplyPage />} />
                <Route path='/:listAddress/applicants' element={<ItemsApplicantsPage />} />
                <Route path='/list/apply' element={<ListApplyPage />} />
                <Route path='/list/applicants' element={<ListApplicantsPage />} />
            </Routes>
        </BrowserRouter>
    );
};