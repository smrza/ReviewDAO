import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'antd';
import CardsWrapper from "../layouts/CardsWrapper"


const Cards = ({ data }) => {
    const { Meta } = Card
    const [selectedListAddress, setSelectedListAddress] = useState('')
    const [selectedListName, setSelectedListName] = useState('')

    const handleListSelect = (selectedList) => {
        setSelectedListAddress(selectedList.newList)
        setSelectedListName(selectedList.name)
    }

    useEffect(() => {
        if (selectedListAddress !== '') {
            console.log(`selectedListAddress: ${selectedListAddress}`)
            console.log(`selectedListName: ${selectedListName}`)
            handleGoToListDetail()
        }
    })

    const navigate = useNavigate();
    const handleGoToListDetail = () => navigate(`/lists/${selectedListName}`, { state: { listAddress: selectedListAddress } })
    // const handleGoToListDetail = () => navigate(`/lists/${selectedListAddress}`)


    return (
        <CardsWrapper>
            {data.map((list, index) =>
                <Card
                    key={index}
                    style={{ color: 'white', margin: '1rem', padding: '1rem', width: '20%', backgroundColor: 'lightgray', color: '#001529', border: '1px solid black', cursor: 'pointer' }}
                    cover={<img alt="listImg" src={list.listImg} width="100%" />}
                    onClick={() => handleListSelect(list)}
                >
                    <Meta title={list.name} description={list.stake} />
                </Card>
            )}
        </CardsWrapper>
    );
};

export default Cards;