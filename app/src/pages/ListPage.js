import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { lists } from "../static/staticLists"
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
    const [listName, setListName] = useState(location.state.listname)
    const { listAddress } = useParams()

    const navigate = useNavigate()

    const handleGoToMainPage = () => navigate(`/`)
    const handleGoToItemspplicantsPage = () => navigate(`../${listAddress}/applicants`)
    const handleGoToItemApplyPage = () => navigate(`../${listAddress}/apply`)

    const APIURL = 'https://api.thegraph.com/subgraphs/name/rabeles11/reviewdao'

    useEffect(() => {
        console.log(`listAddress: ${listAddress}`)

        if (listName !== '') {
            console.log(true)
            handleQuery(listAddress)
        }
    }, [])


    const handleQuery = async (addr) => {
        const tokensQuery = `
            query($address: Bytes) {
                factoryContracts(where:{newList: $address}){
                    id
                    name
                    baseUri
                }
                    listEntities(where:{address: $address}) {
                    id
                    name
                    baseUri
                    address
                }
            }
        `

        const client = new ApolloClient({
            uri: APIURL,
            cache: new InMemoryCache(),
        })

        client
            .query({
                query: gql(tokensQuery),
                variables: {
                    address: addr,
                },
            })
            .then((data) => setListItems(data.data.listEntities))
            // .then((data) => console.log(data.data.listEntities))

            .catch((err) => {
                console.log('Error fetching data: ', err)
            })

        await client.query(tokensQuery).toPromise()
    }

    return (
        <Layout>
            <HeaderDobbyLabs />
            <Content className="content">
                <HeaderOne>List "{listName}"</HeaderOne>
                <ButtonRedirect onClick={handleGoToMainPage}>Go back to main page</ButtonRedirect>
                <ButtonRedirect onClick={handleGoToItemApplyPage} style={{ marginLeft: '30px' }}>Apply new item</ButtonRedirect>
                <ButtonRedirect onClick={handleGoToItemspplicantsPage} style={{ marginLeft: '30px' }}>Vote for applicants</ButtonRedirect>

                <CardsWrapper>
                    {Object.keys(listItems).length > 0 ?
                        listItems.map((item, index) =>
                            <Card
                                key={index}
                                style={{ margin: '1rem', padding: '1rem', width: '20%', backgroundColor: 'lightgray', border: '1px solid black' }}
                                cover={<img alt="listImg" src={item.itemImg} style={{ width: '100%' }} />}
                            >
                                <Meta title={item.name} description={item.address} />
                            </Card>
                        )
                        : null
                    }
                </CardsWrapper>
            </Content>
            <FooterDobbyLabs />
        </Layout >
    )

};

export default ListPage;
