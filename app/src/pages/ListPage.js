import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card, Layout } from 'antd';
import CardsWrapper from '../components/layouts/CardsWrapper';
import ButtonRedirect from '../components/atoms/ButtonRedirect';
import HeaderDobbyLabs from '../components/organisms/HeaderDobbyLabs';
import FooterDobbyLabs from '../components/organisms/FooterDobbyLabs';
import HeaderOne from '../components/atoms/HeaderOne';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'


const ListPage = () => {
    const { Content } = Layout
    const { Meta } = Card
    const location = useLocation()

    const [listItems, setListItems] = useState(Object)
    const listAddress = location.state.listAddress
    const { listname } = useParams()

    const navigate = useNavigate()

    const handleGoToMainPage = () => navigate(`/`)
    const handleGoToItemspplicantsPage = () => navigate(`../${listname}/applicants`)
    const handleGoToItemspplicantsPageDogs = () => navigate(`../dogs/applicants`)
    const handleGoToItemApplyPage = () => navigate(`../${listname}/apply`, { state: { listAddress: listAddress } })

    const APIURL = 'https://api.thegraph.com/subgraphs/name/rabeles11/reviewdao'

    useEffect(() => {
        getListItems(listAddress)
    }, [])

    const getListItems = async (addr) => {
        const GET_LISTITEMS = `
            query($address: Bytes!) {
                factoryContracts(where:{newList: $address}){
                    name
                    baseUri
                }
                    listEntities(where:{address: $address}) {
                    name
                    address
                    baseUri
                }
            }
        `
        const client = new ApolloClient({
            uri: APIURL,
            cache: new InMemoryCache(),
        })

        client
            .query({
                query: gql(GET_LISTITEMS),
                variables: {
                    address: addr,
                },
            })
            .then((data) => setListItems(data.data.listEntities))
            // .then((data) => console.log(data.data.listEntities))

            .catch((err) => {
                console.log('Error fetching data: ', err)
            })

        await client.query(GET_LISTITEMS).toPromise()
    }

    return (
        <Layout>
            <HeaderDobbyLabs />
            <Content className="content">
                <HeaderOne>List "{listname}"</HeaderOne>
                <ButtonRedirect onClick={handleGoToMainPage}>Go back to main page</ButtonRedirect>
                <ButtonRedirect onClick={handleGoToItemApplyPage} style={{ marginLeft: '30px' }}>Apply new item</ButtonRedirect>
                <ButtonRedirect onClick={handleGoToItemspplicantsPageDogs} style={{ marginLeft: '30px' }}>Vote for applicants</ButtonRedirect>

                <CardsWrapper>
                    {Object.keys(listItems).length > 0 ?
                        listItems.map((item, index) =>
                            <Card
                                key={index}
                                style={{ margin: '1rem', padding: '1rem', width: '20%', backgroundColor: 'lightgray', border: '1px solid black' }}
                                cover={<img alt="listImg" src={item.baseUri} style={{ width: '100%' }} />}
                            >
                                <Meta title={item.name} description={item.address} />
                            </Card>
                        )
                        : <p> <b> There is no item for the list "{listname}" yet!  </b></p>
                    }
                </CardsWrapper>
            </Content>
            <FooterDobbyLabs />
        </Layout >
    )

};

export default ListPage;
