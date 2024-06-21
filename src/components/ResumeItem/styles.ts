import styled from 'styled-components';

export const Container = styled.div`
    flex: 1;
    background-color: #FFF;
    box-shadow: 0px 0px 5px #CCC;
    border-radius: 10px;
    margin: 10px;
    padding: 10px;
`;

export const Title = styled.div`
    font-weight: bold;
    text-align: center;
    color: #888;
    margin-bottom: 5px;
`;

export const Info = styled.div<{ color?: string }>`
    text-align: center;
    color: ${props => props.color ?? '#000'};
    font-weight: bold;
`;