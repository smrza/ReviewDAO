import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

import MainPage from './pages/MainPage';

export default () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path='/' element={<MainPage />} />
            </Routes>
        </BrowserRouter>
    );
};