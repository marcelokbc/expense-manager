import styled from "styled-components";

export const Container = styled.div`
    background-color: #FFF;
    box-shadow: 0px 0px 5px #CCC;
    border-radius: 10px;
    padding: 20px;
    margin-top: 20px;
    display: flex;
    align-items: center;
`;

export const InputLabel = styled.label`
    flex: 1;
    margin: 10px;
`;

export const InputTitle = styled.div`
    font-weight: bold;
    margin-bottom: 5px;
    color: #888;
`;

export const Input = styled.input`
    width: 100%;
    height: 30px;
    padding: 0 5px;
    border: 1px solid #000;
    border-radius: 5px;
    outline: 0;
    font-size: 15px;
`;

export const Select = styled.select`
    width: 100%;
    height: 30px;
    padding: 0 5px;
    border: 1px solid #000;
    border-radius: 5px;
    outline: 0;
    font-size: 15px;
`;

export const Button = styled.button`
    width: 100%;
    height: 30px;
    padding: 0 5px;
    border: 0;
    border-radius: 5px;
    outline: 0;
    font-size: 15px;
    background-color: darkblue;
    color: #FFF;
    cursor: pointer;

    &:hover {
        background-color: darkgreen;
    }
`;