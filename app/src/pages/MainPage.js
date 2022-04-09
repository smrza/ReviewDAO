import React from "react";
import Cards from "../components/organisms/Cards";
import { lists } from "../static/staticLists"
import { Layout } from 'antd';


const MainPage = () => {
    const { Header, Content, Footer } = Layout;

    return (
        <Layout>
            <Content style={{ padding: '0 50px' }}>
                <h1>DAO project - main page</h1>

                <Cards data={lists}></Cards>
            </Content>
        </Layout>
    )
};

export default MainPage;
