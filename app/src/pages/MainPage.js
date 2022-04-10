import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Cards from "../components/organisms/Cards";
import { lists } from "../static/staticLists"
import { Layout, Menu } from 'antd';
import ButtonRedirect from "../components/atoms/ButtonRedirect"
import HeaderDobbyLabs from "../components/organisms/HeaderDobbyLabs";
import FooterDobbyLabs from "../components/organisms/FooterDobbyLabs";
import { ethers } from "ethers";
// import { injected } from "../components/contract-components/connectors";
// import { useWeb3React, Web3ReactProvider } from "@web3-react/core"
// import Web3 from "web3"

const MainPage = () => {
    const { Content } = Layout;
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

            <FooterDobbyLabs />
        </Layout>
    )
};

export default MainPage;
