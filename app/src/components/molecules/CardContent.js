import React from 'react';
import styled from '@emotion/styled';

const CardContentWrapper = styled.div`
    margin: 1rem;
    padding: 1rem;
    text-align: center;
    width: 18%;
    min-width: 15%;
    height: 250px;
    min-height: 200px;
    cursor: pointer;
    border: 1px solid black;
    flex-direction: column;
    display: flex;
`;

const CardContent = ({ itemName, des }) => {
    return (
        <CardContentWrapper>
            <div>
                <img src="https://cdn.vox-cdn.com/thumbor/M223kCurGxrvURmDnsw4f1I0l1U=/0x0:5500x3671/920x613/filters:focal(2310x1396:3190x2276):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/66563372/GettyImages_849177432.0.jpg" />
            </div>
            <div>
                <h2>{itemName}</h2>
                <p>{des} CardContent</p>
            </div>
        </CardContentWrapper>
    );
};

export default CardContent;