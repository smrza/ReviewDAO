import React from "react";
import { useNavigate } from 'react-router-dom';
import Cards from "../components/organisms/Cards";
import { lists } from "../static/staticLists"
import { Layout, Menu } from 'antd';


const MainPage = () => {
    const { Header, Content, Footer } = Layout;
    const navigate = useNavigate();
    const handleGoToListApplyPage = () => navigate(`/list/apply`)


    return (
        <Layout className="layout">
            <Header className="header" >
                <div className="dobby" style={{ float: 'left' }}> DOBBY LABS </div>
                <div className="header-right">
                    <a onClick={handleGoToListApplyPage} > Link01 </a>
                    <a onClick={handleGoToListApplyPage} > Link02 </a>
                    <a onClick={handleGoToListApplyPage} > Link03 </a>
                </div>
                {/* </Menu> */}
            </Header>
            <Content style={{ padding: '0 50px' }}>
                <h1>DAO project - main page</h1>

                <button onClick={handleGoToListApplyPage}>Apply new list</button>

                <Cards data={lists}></Cards>
            </Content>

            <Footer style={{ textAlign: 'center' }}> DOBBY LABS ©2021</Footer>
        </Layout>
    )
};

export default MainPage;
