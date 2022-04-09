import React from 'react';
import styled from '@emotion/styled';
import { Card } from 'antd';

const CardsWrapper = styled.div`
    margin-top: 50px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
`;

const Cards = ({ data }) => {

    return (
        <CardsWrapper>
            {data.map((list, index) =>
                <Card
                    key={index}
                    style={{ margin: '1rem', padding: '1rem', width: '20%', backgroundColor: 'lightgreen', border: '1px solid black', cursor: 'pointer' }}
                    cover={<img alt="example" src={list.listImg} width="100%" />}
                >
                    <div style={{ fontSize: 'larger', fontWeight: 'bolder' }}>{list.listName}</div>
                    <div>{list.listDes}</div>
                </Card>
            )}
        </CardsWrapper>
    );
};

export default Cards;