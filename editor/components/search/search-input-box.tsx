import React, { useRef } from "react";
import { IconButton } from "@mui/material";
import styled from "@emotion/styled";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
interface ISearchInputBox extends React.InputHTMLAttributes<HTMLInputElement> {
  containerStyle?: React.CSSProperties;
  placeholder?: string;
}

export default function SearchInputBox({
  containerStyle,
  placeholder = "Search your stuff",
  ...inputProps
}: ISearchInputBox) {
  const inputRef = useRef<HTMLInputElement>(null);

  const onClickInputWrapper = () => inputRef?.current?.focus();

  return (
    <InputWrapper style={containerStyle} onClick={onClickInputWrapper}>
      <IconButton aria-label="search" style={{ marginRight: 8 }}>
        <MagnifyingGlassIcon />
      </IconButton>
      <Input
        ref={inputRef}
        placeholder={placeholder}
        aria-label={placeholder}
        {...inputProps}
      />
    </InputWrapper>
  );
}

const InputWrapper = styled.div`
  background: #fafafa;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  padding: 8px;
  width: 427px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Input = styled.input`
  border: 0;
  background-color: transparent;
  font-weight: 500;
  font-size: 14px;
  line-height: 1.14;
  display: flex;
  align-items: center;
  flex: 1;

  &::placeholder {
    color: #cbcbcb;
  }

  &:active,
  &:focus {
    outline: 0;
  }
`;
