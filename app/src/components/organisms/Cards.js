import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'antd';
import CardsWrapper from "../layouts/CardsWrapper"


const Cards = ({ data }) => {
    const { Meta } = Card;
    const [selectedList, setSelectedList] = useState('');

    useEffect(() => {
        if (selectedList !== '') {
            handleGoToListDetail()
        }
    })

    const navigate = useNavigate();
    const handleGoToListDetail = () => navigate(`/lists/${selectedList}`)


    return (
        <CardsWrapper>
            {data.map((list, index) =>
                <Card
                    key={index}
                    style={{ margin: '1rem', padding: '1rem', width: '20%', backgroundColor: 'lightgreen', border: '1px solid black', cursor: 'pointer' }}
                    cover={<img alt="listImg" src={list.listImg} width="100%" />}
                    onClick={() => setSelectedList(list.listName)}
                >
                    <Meta title={list.listName} description={list.listDes} />
                </Card>
            )}
        </CardsWrapper>
    );
};

export default Cards;