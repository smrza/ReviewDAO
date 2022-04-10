import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoHeader from '../atoms/LogoHeader';
import HeaderItem from "../atoms/HeaderItem"
import HeaderLinksWrapper from '../layouts/HeaderLinksWrapper';
import HeaderWrapper from '../layouts/HeaderWrapper';
import { Layout } from 'antd';
import { ethers } from 'ethers';


const HeaderDobbyLabs = () => {
    const { Header } = Layout;
    const navigate = useNavigate();

    const handleGoToListMainPage = () => navigate(`/`)

    const [dataAccount, setdataAccount] = useState({
        Address: "",
        Balance: null,
    });

    useEffect(() => {
        handleAccountInfo()
    })

    const handleAccountInfo = () => {
        if (window.ethereum) {

            window.ethereum
                .request({ method: "eth_requestAccounts" })
                .then((res) => getAccountInfo(res[0]));
        } else {
            alert("install metamask extension!!");
        }
    };

    const getAccountInfo = (address) => {
        window.ethereum
            .request({
                method: "eth_getBalance",
                params: [address, "latest"]
            })
            .then((balance) => {
                setdataAccount({
                    Address: address,
                    Balance: ethers.utils.formatEther(balance),
                });
            });
    };


    return (
        <Header style={{ marginBottom: '30px', padding: '0 15%' }}>
            <HeaderWrapper>
                <LogoHeader onClick={handleGoToListMainPage}>DOBBY LABS</LogoHeader>
                <HeaderLinksWrapper>
                    {dataAccount.Address !== "" ?
                        <>
                            <span style={{ fontSize: 'small' }}> {dataAccount.Address} </span>
                            <span style={{ fontSize: 'small' }}> {dataAccount.Balance} ETH </span>
                        </>

                        : <HeaderItem onClick={handleAccountInfo}> Connect wallet </HeaderItem>
                    }
                </HeaderLinksWrapper>
            </HeaderWrapper>
        </Header>
    );
};

export default HeaderDobbyLabs;