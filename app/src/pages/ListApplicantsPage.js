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
import ButtonApply from '../components/atoms/ButtonApply';
import {PlusOutlined  } from "@ant-design/icons"
import { ethers } from "ethers";
import sha256 from "js-sha256"



const ListApplicantsPage = () => {
    const { Content } = Layout;
    const { Meta } = Card;
    const location = useLocation();

    const [applicant, setApplicant] = useState([])
    const [graphApplicants, setGraphApplicants] = useState(Object)

    const navigate = useNavigate();

    const handleGoToListMainPage = () => navigate(`/`)
    const handleGoToListApplyPage = () => navigate(`/list/apply`)

    const APIURL = 'https://api.thegraph.com/subgraphs/name/rabeles11/proposallistreviewdaolive'



    const reviewDAOABI = [
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "factory_",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "NFT_",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "token_",
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
                    "internalType": "address",
                    "name": "list",
                    "type": "address"
                }
            ],
            "name": "_NewListCreated",
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
                    "internalType": "string",
                    "name": "baseUri",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "creator",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "votes",
                    "type": "uint256"
                }
            ],
            "name": "_NewProposal",
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
                    "internalType": "uint256",
                    "name": "votes",
                    "type": "uint256"
                }
            ],
            "name": "_ProposalModified",
            "type": "event"
        },
        {
            "inputs": [],
            "name": "createNewList",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "hash_",
                    "type": "bytes32"
                },
                {
                    "internalType": "bytes32",
                    "name": "hash2_",
                    "type": "bytes32"
                },
                {
                    "internalType": "string",
                    "name": "name_",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "name2_",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "baseUri_",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "baseUri2_",
                    "type": "string"
                }
            ],
            "name": "generateListsForTestingPurposes",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getBanishListingLimit",
            "outputs": [
                {
                    "internalType": "int256",
                    "name": "",
                    "type": "int256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getChallengeTimer",
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
            "inputs": [],
            "name": "getListingPriceRDT",
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
            "inputs": [],
            "name": "getListingTimer",
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
            "inputs": [],
            "name": "getListingVotePriceRDT",
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
            "inputs": [],
            "name": "getMembershipAmountRDT",
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
            "inputs": [],
            "name": "getNewListCreationReward",
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
                    "name": "hash_",
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
            "name": "proposeNewList",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "hash_",
                    "type": "bytes32"
                }
            ],
            "name": "voteForProposal",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ]

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()
    const ReviewDAOAddress = '0x22d529c84b18199239816fe6f528fd924345a4b7';

    const reviewDAOContract = new ethers.Contract(ReviewDAOAddress, reviewDAOABI, signer)
    useEffect(() => {
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

        getProposals()
    }, [])

    const getProposals = async () => {
        const GET_LIST_PROPOSALS = `
            query{
                porposalLists{
                    hash
                    name
                    baseUri
                    creator
                    votes
                }
            }
        `
        const client = new ApolloClient({
            uri: APIURL,
            cache: new InMemoryCache(),
        })

        client
            .query({
                query: gql(GET_LIST_PROPOSALS),
            })
            .then((data) => setGraphApplicants(data.data.porposalLists))
            // .then((data) => console.log(data.data.porposalLists))

            .catch((err) => {
                console.log('Error fetching data: ', err)
            })

        await client.query(GET_LIST_PROPOSALS).toPromise()
    }

    const VoteForProposal = async (name) => {
        const hashVote =`0x${sha256(name)}`;
        console.log(hashVote)
        await reviewDAOContract.voteForProposal(hashVote)
      }


    return (
        <Layout>
            <HeaderDobbyLabs />

            <Content className="content">
                <HeaderOne>
                    List applicants
                </HeaderOne>

                <ButtonRedirect onClick={handleGoToListMainPage}> Go back to main page </ButtonRedirect>
                <ButtonRedirect onClick={handleGoToListApplyPage}> Apply new list </ButtonRedirect>

                {/* <CardsWrapper>
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
                </CardsWrapper> */}

                <CardsWrapper>
                    {Object.keys(graphApplicants).length > 0 ?
                        graphApplicants.map((applicant, index) =>
                            <Card
                                key={index}
                                style={{ margin: '1rem', padding: '1rem', width: '20%', backgroundColor: 'lightgray', border: '1px solid black' }}
                                cover={<img alt="applicantImg" src={applicant.baseUri} style={{ width: '100%' }} />}
                                actions={[
                                    <PlusOutlined key="VoteForProposal" onClick={() => VoteForProposal(applicant.name)}/>,
                                  ]}
                            >
                                <Meta title={applicant.name}/>
                                <div className="additional">
                                <p className="Number of votes">Number of votes: {applicant.votes}</p>
                                <p>Creator: {applicant.creator}</p>
                                </div>
                                
                            </Card>
                        )
                        : <p> <b> There is no list applicant yet!  </b></p>
                    }
                </CardsWrapper>
            </Content>
            <FooterDobbyLabs />
        </Layout>
    )

};

export default ListApplicantsPage;
