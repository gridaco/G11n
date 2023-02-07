import React from "react";
import styled from "@emotion/styled";
import TextInput from "./text-input";

/**
 * single field with translation compatability
 */
interface ITranslationFieldRow {
  keyId: string;
  locale: string;
  initialValue?: string;
  onSubmit: (keyId: string, locale: string, value: string) => void;
  onChange?: (locale: string, value: string) => void;
  isAutoTranslate?: boolean;
}

export const TranslationFieldRow: React.FC<ITranslationFieldRow> = ({
  isAutoTranslate,
  ...props
}) => {
  return (
    <Wrapper>
      <LocaleText>
        <span>{props.locale}</span>
      </LocaleText>
      <TranslationEditField isAutoTranslate={isAutoTranslate} {...props} />
      {isAutoTranslate && (
        <Button>
          <span>Accept</span>
        </Button>
      )}
    </Wrapper>
  );
};

export const TranslationEditField = ({
  isAutoTranslate,
  initialValue,
  ...props
}: ITranslationFieldRow) => {
  const handleOnChange = (e: any) => {
    const _ = e.target.value;
    props.onChange?.(props.locale, _);
  };

  // on key down, when enter key is pressed via keyboard or save button clicked.
  const handleOnSubmit = (e: any) => {
    const _ = e.target.value;
    props.onSubmit(props.keyId, props.locale, _);
  };

  return (
    <StyledTextInput
      onKeyPress={(event) => {
        if (event.key === "Enter") {
          handleOnSubmit(event);
          event.preventDefault();
        }
      }}
      defaultValue={initialValue}
      onChange={handleOnChange}
      data-auto-translate={isAutoTranslate && "true"}
    />
  );
};

const Wrapper = styled.li`
  display: flex;

  &:not(:last-of-type) {
    margin-bottom: 12px;
  }
`;

const LocaleText = styled.div`
  background: #f9f9f9;
  border-radius: 4px;
  padding: 9px 12px;
  width: 160px;

  span {
    font-size: 13px;
    line-height: 1.2;
    color: #94959a;
  }
`;

const StyledTextInput = styled(TextInput)`
  margin-left: 12px;

  &[data-auto-translate="true"] {
    margin-right: 16px;
  }
`;

const Button = styled.button`
  border: 0;
  background-color: transparent;

  span {
    font-weight: bold;
    font-size: 13px;
    line-height: 1.2;
    color: #2562ff;
  }
`;
