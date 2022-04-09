import React from "react";
import { useNavigate } from 'react-router-dom';
import Cards from "../components/organisms/Cards";
import { lists } from "../static/staticLists"
import { Layout, Menu } from 'antd';
import ButtonRedirect from "../components/atoms/ButtonRedirect"
import HeaderDobbyLabs from "../components/organisms/HeaderDobbyLabs";
import FooterDobbyLabs from "../components/organisms/FooterDobbyLabs";


const MainPage = () => {
    const { Header, Content, Footer } = Layout;
    const navigate = useNavigate();
    const handleGoToListApplyPage = () => navigate(`/list/apply`)


    return (
        <Layout>
            <HeaderDobbyLabs />
            <Content className="content">
                <h1>DAO project - main page</h1>

                <ButtonRedirect onClick={handleGoToListApplyPage}>Apply new list</ButtonRedirect>

                <Cards data={lists}></Cards>
            </Content>

            {/* <Footer style={{ textAlign: 'center' }}> DOBBY LABS ©2021</Footer> */}
            <FooterDobbyLabs />
        </Layout>
    )
};

export default MainPage;
