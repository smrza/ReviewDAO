import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import MainPage from './pages/MainPage';
import ListPage from './pages/ListPage';

export default () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path='/' element={<MainPage />} />
                <Route path='/lists/:listname' element={<ListPage />} />
            </Routes>
        </BrowserRouter>
    );
};