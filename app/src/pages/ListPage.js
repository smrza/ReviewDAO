import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card, Layout } from 'antd';
import CardsWrapper from '../components/layouts/CardsWrapper';
import ButtonRedirect from '../components/atoms/ButtonRedirect';
import HeaderDobbyLabs from '../components/organisms/HeaderDobbyLabs';
import FooterDobbyLabs from '../components/organisms/FooterDobbyLabs';
import HeaderOne from '../components/atoms/HeaderOne';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import { ethers } from "ethers";

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

    const APIURL = 'https://api.thegraph.com/subgraphs/name/rabeles11/reviewdaolive'

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
                    id
                    name
                    address
                    baseUri
                    whitelisted
                    challenged
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


    const ListItemsABI = [
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "name_",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "baseUri_",
                    "type": "string"
                },
                {
                    "internalType": "address",
                    "name": "creator_",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "token_",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "ReviewDAO_",
                    "type": "address"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "bytes32",
                    "name": "hash",
                    "type": "bytes32"
                },
                {
                    "indexed": false,
                    "internalType": "bool",
                    "name": "whitelisted",
                    "type": "bool"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "sender",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "int256",
                    "name": "downvotes",
                    "type": "int256"
                }
            ],
            "name": "_Banished",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "challengerReward",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "listingStake",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "challengerStake",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "votePrice",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "timer",
                    "type": "uint256"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "challenger",
                    "type": "address"
                }
            ],
            "name": "_ChallengeModified",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "bytes32",
                    "name": "hash",
                    "type": "bytes32"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "bool",
                    "name": "whitelisted",
                    "type": "bool"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "baseUri",
                    "type": "string"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "creator",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "stake",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "challengerReward",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "timer",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "challengeId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "bool",
                    "name": "challenged",
                    "type": "bool"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "statusId",
                    "type": "uint256"
                }
            ],
            "name": "_ListingModified",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "int256",
                    "name": "votes",
                    "type": "int256"
                }
            ],
            "name": "_ListingStatus",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "bytes32",
                    "name": "hash",
                    "type": "bytes32"
                },
                {
                    "indexed": false,
                    "internalType": "bool",
                    "name": "whitelisted",
                    "type": "bool"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "resolver",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "statsId",
                    "type": "uint256"
                }
            ],
            "name": "_ResolveListing",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "sender",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "timestamp",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "_Withdrawal",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "listingId_",
                    "type": "bytes32"
                },
                {
                    "internalType": "string",
                    "name": "name_",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "baseUri_",
                    "type": "string"
                }
            ],
            "name": "applyListing",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "listingId_",
                    "type": "bytes32"
                }
            ],
            "name": "banishListing",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "listingId_",
                    "type": "bytes32"
                }
            ],
            "name": "challengeListing",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "claimRewards",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "listingId_",
                    "type": "bytes32"
                }
            ],
            "name": "downvoteListing",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "listingId_",
                    "type": "bytes32"
                }
            ],
            "name": "resolveListing",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "listingId_",
                    "type": "bytes32"
                }
            ],
            "name": "upvoteListing",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "listingId_",
                    "type": "bytes32"
                }
            ],
            "name": "voteNegativeChallenge",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "listingId_",
                    "type": "bytes32"
                }
            ],
            "name": "votePositiveChallenge",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "baseUri",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "challenges",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "challengerReward",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "listingStake",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "challengerStake",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "votePrice",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "timer",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "challenger",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "creator",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getRewardBalance",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "",
                    "type": "bytes32"
                }
            ],
            "name": "listings",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                },
                {
                    "internalType": "bool",
                    "name": "whitelisted",
                    "type": "bool"
                },
                {
                    "internalType": "string",
                    "name": "baseUri",
                    "type": "string"
                },
                {
                    "internalType": "address",
                    "name": "creator",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "stake",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "challengerReward",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "timer",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "challengeId",
                    "type": "uint256"
                },
                {
                    "internalType": "bool",
                    "name": "challenged",
                    "type": "bool"
                },
                {
                    "internalType": "uint256",
                    "name": "statusId",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "name",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "",
                    "type": "bytes32"
                }
            ],
            "name": "nameRegistered",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "polls",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "votesFor",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "votesAgainst",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "test",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]

    

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()


    const Challange = async (id,address) => {
        console.log(id)
        console.log(address)
        const NewList = new ethers.Contract(address, ListItemsABI, signer)
        console.log(NewList)

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
                                <p>IsWhitelisted: {item.whitelisted}</p>
                                <p>IsChallanged: {item.challenged}</p>
                                {
                                <button onClick={() => Challange(item.id,item.address)}>Challenge</button>
                                }
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
