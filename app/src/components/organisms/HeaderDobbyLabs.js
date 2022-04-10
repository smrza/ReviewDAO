import React from 'react';
import { useNavigate } from 'react-router-dom';
import LogoHeader from '../atoms/LogoHeader';
import HeaderItem from "../atoms/HeaderItem"
import HeaderLinksWrapper from '../layouts/HeaderLinksWrapper';
import HeaderWrapper from '../layouts/HeaderWrapper';
import { Layout } from 'antd';


const HeaderDobbyLabs = () => {
    const { Header } = Layout;
    const navigate = useNavigate();

    const handleGoToListMainPage = () => navigate(`/`)


    return (
        <Header style={{ marginBottom: '30px', padding: '0 15%' }}>
            <HeaderWrapper>
                <LogoHeader onClick={handleGoToListMainPage}>DOBBY LABS</LogoHeader>
                <HeaderLinksWrapper>
                    <HeaderItem> Connect wallet </HeaderItem>
                </HeaderLinksWrapper>
            </HeaderWrapper>
        </Header>
    );
};

export default HeaderDobbyLabs;