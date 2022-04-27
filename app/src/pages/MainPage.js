import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Cards from "../components/organisms/Cards";
import { Layout } from 'antd';
import ButtonRedirect from "../components/atoms/ButtonRedirect"
import HeaderDobbyLabs from "../components/organisms/HeaderDobbyLabs";
import FooterDobbyLabs from "../components/organisms/FooterDobbyLabs";
import HeaderOne from "../components/atoms/HeaderOne";
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
// import ReviewDAOListFactoryABI from "../contracts/abis/ReviewDAOListFactoryABI"
// import { web3 } from "web3";
import { ethers } from "ethers";
import sha256 from "js-sha256"

const MainPage = () => {
    const ABI = [
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "newList",
                    "type": "address"
                },
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
                }
            ],
            "name": "_NewList",
            "type": "event"
        },
        {
            "inputs": [],
            "name": "allLists",
            "outputs": [
                {
                    "internalType": "contract ReviewDAOList[]",
                    "name": "",
                    "type": "address[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "nameHash_",
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
            "name": "createList",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "nameHash_",
                    "type": "bytes32"
                }
            ],
            "name": "getList",
            "outputs": [
                {
                    "internalType": "contract ReviewDAOList",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "nameHash_",
                    "type": "bytes32"
                }
            ],
            "name": "getListAddress",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]

    const { Content } = Layout
    const navigate = useNavigate()

    const CONTRACT_ADDRESS = '0xb86d6edbc400De3fc87557D97A68461b104b94C1';
    const [contract, setContract] = useState(null);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);

    const [graphLists, setGraphLists] = useState(Object)

    const handleGoToListApplyPage = () => navigate(`/list/apply`)
    const handleGoToListApplicantsPage = () => navigate(`/list/applicants`)

    const APIURL = 'https://api.thegraph.com/subgraphs/name/rabeles11/reviewdao'

    // const provider = window.ethereum
    // const Web3 = new web3(provider)

    // const contractListFactory = new Web3.eth.Contract(
    //     ListFactoryABI,
    //     CONTRACT_ADDRESS
    // );

    const updateEthers = () => {
        let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(tempProvider);

        let tempSigner = tempProvider.getSigner();
        setSigner(tempSigner);

        let tempContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, tempSigner);
        setContract(tempContract);
        console.log(tempContract)
    }

    const showList = async () => {
        let list = await contract.allLists()
        console.log(list)
    }

    useEffect(() => {
        getListsFromGraph()
        //console.log(contract.allLists())
        // updateEthers()
        // console.log(contractListFactory)
    }, [])

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
                {/* <ButtonRedirect> Add winner list </ButtonRedirect> */}
                <ButtonRedirect onClick={updateEthers}> Update ethers </ButtonRedirect>
                <ButtonRedirect onClick={showList}> showList </ButtonRedirect>
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
