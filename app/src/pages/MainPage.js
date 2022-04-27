import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Cards from "../components/organisms/Cards";
import { Layout } from 'antd';
import ButtonRedirect from "../components/atoms/ButtonRedirect"
import HeaderDobbyLabs from "../components/organisms/HeaderDobbyLabs";
import FooterDobbyLabs from "../components/organisms/FooterDobbyLabs";
import HeaderOne from "../components/atoms/HeaderOne";
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import ReviewDAOListFactoryABI from "../contracts/abis/ReviewDAOListFactoryABI"
// import Web3 from "web3";

const MainPage = () => {
    const CONTRACT_ADDRESS = '0x45f0b394E775672547C57a8B16d4A23936d4afbd';

    const { Content } = Layout
    const navigate = useNavigate()

    const [graphLists, setGraphLists] = useState(Object)

    const handleGoToListApplyPage = () => navigate(`/list/apply`)
    const handleGoToListApplicantsPage = () => navigate(`/list/applicants`)

    const APIURL = 'https://api.thegraph.com/subgraphs/name/rabeles11/reviewdao'

    useEffect(() => {
        getListsFromGraph()
        console.log(ReviewDAOListFactoryABI)
        console.log(window)
        // console.log(window.Web3)
        // getABI()
    }, [])

    // const getABI = () => {
    //     const contractListFactory = new Web3.eth.Contract(
    //         ReviewDAOListFactoryABI,
    //         CONTRACT_ADDRESS
    //     );

    //     console.log(contractListFactory)
    // }

    const getListsFromGraph = async () => {
        const factoryQuery = `
            query {
                factoryContracts(first: 5, orderBy: name) {
                    baseUri
                    name
                    newList
                }
            }
        `
        const client = new ApolloClient({
            uri: APIURL,
            cache: new InMemoryCache(),
        })

        client
            .query({
                query: gql(factoryQuery),
            })
            .then((data) => setGraphLists(data.data.factoryContracts))
            // .then((data) => console.log(data.data.factoryContracts))

            .catch((err) => {
                console.log('Error fetching data: ', err)
            })

        await client.query(factoryQuery).toPromise()
    }

    return (
        <Layout>
            <HeaderDobbyLabs />
            <Content className="content">
                <HeaderOne> DAO project - main page </HeaderOne>

                <ButtonRedirect onClick={handleGoToListApplyPage}>Apply new list</ButtonRedirect>
                <ButtonRedirect onClick={handleGoToListApplicantsPage}>Show list applicants</ButtonRedirect>

                {Object.keys(graphLists).length > 0 ?
                    <Cards data={graphLists}></Cards>
                    : null
                }
            </Content>
            <FooterDobbyLabs />
        </Layout>
    )
};

export default MainPage;
