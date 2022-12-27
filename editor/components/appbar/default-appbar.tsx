import React, { useState } from "react";
import Link from "next/link";
import styled from "@emotion/styled";
import { IconButton } from "@material-ui/core";
import {
  ArrowLeftIcon,
  Share1Icon,
  PlayIcon,
  AvatarIcon,
} from "@radix-ui/react-icons";
export interface IDashboardAppBar {
  title?: string;
  backButton?: string;
  onClickShare?: () => void;
  onClickPlay?: () => void;
}

export default function DashboardAppbar({
  title,
  backButton,
  onClickShare,
  onClickPlay,
}: IDashboardAppBar) {
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  const onClickOpenShare = () => setIsShareModalOpen(true);

  const onClickCloseShare = () => setIsShareModalOpen(false);

  return (
    <>
      <Container>
        <Link href="/">
          {!!backButton ? (
            <BackButton>
              <ArrowLeftIcon />
              <span>{backButton}</span>
            </BackButton>
          ) : (
            <LogoImage
              src={
                "https://bridged-service-static.s3-us-west-1.amazonaws.com/branding/logo/128.png"
              }
            />
          )}
        </Link>
        {title && <Title>{title}</Title>}
        <Toolbar>
          <IconButton
            style={{
              marginRight: 17,
            }}
            onClick={onClickShare || onClickOpenShare}
          >
            <Share1Icon />
          </IconButton>
          <IconButton onClick={onClickPlay}>
            <PlayIcon />
          </IconButton>
          <AvatarIcon />
        </Toolbar>
      </Container>
    </>
  );
}

const Container = styled.header`
  background: #ffffff;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  background-color: transparent;
  cursor: pointer;

  span {
    font-weight: bold;
    font-size: 14px;
    line-height: 1.2;
    letter-spacing: 0.3px;
    margin-left: 8px;
    color: #a2a2a2;
  }

  &:active,
  &:focus {
    outline: 0;
  }
`;

const LogoImage = styled.img`
  width: 28px;
  height: 28px;
  user-select: none;
  -webkit-user-drag: none;
  cursor: pointer;
`;

const Title = styled.span`
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;
  color: black;
  letter-spacing: 0.3px;
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
`;

const ProfileImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-left: 32px;
  user-select: none;
  -webkit-user-drag: none;
  cursor: pointer;
`;
