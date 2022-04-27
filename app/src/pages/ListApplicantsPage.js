import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout } from 'antd';
import { Card } from 'antd';
import CardsWrapper from '../components/layouts/CardsWrapper'
import ButtonRedirect from '../components/atoms/ButtonRedirect';
import HeaderDobbyLabs from '../components/organisms/HeaderDobbyLabs';
import FooterDobbyLabs from '../components/organisms/FooterDobbyLabs';
import { listApplicants } from '../static/listApplicants'
import HeaderOne from '../components/atoms/HeaderOne';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'


const ListApplicantsPage = () => {
    const { Content } = Layout;
    const { Meta } = Card;
    const location = useLocation();

    const [applicant, setApplicant] = useState([])
    const [graphApplicants, setGraphApplicants] = useState(Object)

    const navigate = useNavigate();

    const handleGoToListMainPage = () => navigate(`/`)
    const handleGoToListApplyPage = () => navigate(`/list/apply`)

    const APIURL = 'https://api.thegraph.com/subgraphs/name/rabeles11/proposallistreviewdao/graphql'

    useEffect(() => {
        console.log(`listApplicants`)

        if (location.state !== null) {
            fetch(location.state.applicantURL)
                .then(res => res.json())
                .then(
                    (result) => {
                        setApplicant(result);
                        // console.log(result);
                    },
                    (error) => {
                        console.log(error)
                    }
                )
        }

        // getProposals()
    }, [])

    // const getProposals = async () => {
    //     const GET_LIST_PROPOSALS = `
    //         query{
    //             porposalLists{
    //                 hash
    //                 name
    //                 baseUri
    //                 creator
    //                 votes
    //             }
    //         }
    //     `
    //     const client = new ApolloClient({
    //         uri: APIURL,
    //         cache: new InMemoryCache(),
    //     })

    //     client
    //         .query({
    //             query: gql(GET_LIST_PROPOSALS),
    //         })
    //         // .then((data) => setListItems(data.data.listEntities))
    //         .then((data) => console.log(data))

    //         .catch((err) => {
    //             console.log('Error fetching data: ', err)
    //         })

    //     await client.query(GET_LIST_PROPOSALS).toPromise()
    // }


    return (
        <Layout>
            <HeaderDobbyLabs />

            <Content className="content">
                <HeaderOne>
                    List applicants
                </HeaderOne>

                <ButtonRedirect onClick={handleGoToListMainPage}> Go back to main page </ButtonRedirect>
                <ButtonRedirect onClick={handleGoToListApplyPage}> Apply new list </ButtonRedirect>

                <CardsWrapper>
                    {listApplicants.map((applicant, index) =>
                        <Card
                            key={index}
                            style={{ margin: '1rem', padding: '1rem', width: '20%', backgroundColor: 'lightgray', border: '1px solid black', cursor: 'pointer' }}
                            cover={<img alt="applicantImg" src={applicant.listApplicantImg} width="100%" />}
                        >
                            <Meta title={applicant.listApplicantName} description={applicant.listApplicantDes} />
                        </Card>
                    )}
                    {location.state !== null ?
                        <Card
                            style={{ margin: '1rem', padding: '1rem', width: '20%', backgroundColor: 'lightgray', border: '1px solid black', cursor: 'pointer' }}
                            cover={<img alt="applicantImg" src={applicant.listApplicantImg} width="100%" />}
                        >
                            <Meta title={applicant.listApplicantName} description={applicant.listApplicantDes} />
                        </Card>
                        : null
                    }
                </CardsWrapper>
            </Content>
            <FooterDobbyLabs />
        </Layout>
    )

};

export default ListApplicantsPage;
