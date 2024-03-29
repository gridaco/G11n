import React from "react";
import styled from "@emotion/styled";
import { IconButton } from "@mui/material";
import { CaretLeftIcon } from "@radix-ui/react-icons";
interface IHeader {
  title: string;
  onClickBack?: () => void;
}

export default function Header({
  title,
  onClickBack,
  children,
}: React.PropsWithChildren<IHeader>) {
  return (
    <Container>
      <LeftSide>
        {onClickBack && (
          <BackButton onClick={onClickBack}>
            <CaretLeftIcon />
          </BackButton>
        )}
        <Title>{title}</Title>
      </LeftSide>
      {children}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 32px;
  border-bottom: 1px solid #e3e3e3;
`;

const LeftSide = styled.div`
  display: flex;
  align-items: center;
`;

const BackButton = styled(IconButton)`
  width: 36px;
  height: 36px;
  background: #ededed;
  border-radius: 8px;
  margin: 2px 0;
  margin-right: 16px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
  line-height: 1.2;
  color: #151617;
`;
