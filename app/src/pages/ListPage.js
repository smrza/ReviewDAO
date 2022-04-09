import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { lists } from "../static/staticLists"
import { Card, Layout } from 'antd';
import CardsWrapper from '../components/layouts/CardsWrapper'


const ListPage = () => {
    const { Header, Content, Footer } = Layout;

    const [listItems, setListItems] = useState(lists);
    const { listname } = useParams();
    const navigate = useNavigate();

    const handleGoToListMainPage = () => navigate(`/`)
    const handleGoToItemspplicantsPage = () => navigate(`../${listname}/applicants`)
    const handleGoToItemApplyPage = () => navigate(`../${listname}/apply`)

    useEffect(() => {
        handleListSelect()
    })

    const handleListSelect = () => {
        console.log(`Selected list: ${listname}`);

        const animals = lists.map((item) => {
            return (
                item.listName
            );
        });

        setListItems(lists[animals.indexOf(listname)].items);
        console.log(listItems)
    }

    return (
        <Layout>
            <Content style={{ padding: '0 50px' }}>
                <h1>List "{listname}"</h1>
                <button onClick={handleGoToListMainPage}>Go back to main page</button>
                <button onClick={handleGoToItemApplyPage} style={{ marginLeft: '30px' }}>Apply new item</button>
                <button onClick={handleGoToItemspplicantsPage} style={{ marginLeft: '30px' }}>Vote for applicants</button>

                <CardsWrapper>
                    {listItems.map((item, index) =>
                        <Card
                            key={index}
                            style={{ margin: '1rem', padding: '1rem', width: '20%', backgroundColor: 'lightblue', border: '1px solid black' }}
                            cover={<img alt="listImg" src={item.itemImg} width="100%" />}
                        >
                            <div style={{ fontSize: 'larger', fontWeight: 'bolder' }}>{item.itemName}</div>
                            <div>{item.itemDes}</div>
                        </Card>
                    )}
                </CardsWrapper>
            </Content>
        </Layout >
    )

};

export default ListPage;
