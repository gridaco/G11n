import React, { useState, useMemo } from "react";
import styled from "@emotion/styled";
import { IGlobalizedKey } from "@base-sdk/g11n";
import { assets } from "@base-sdk/base";
import { TranslationFieldRow } from "./translation-field";

const availableLocales = ["ko", "en", "ja"];

export interface EditableTextCardProps {
  translation: IGlobalizedKey;
  locale: string;
  onKeyChange: (locale: string, value: string) => void;
  onKeySubmit: (keyId: string, locale: string, value: string) => void;
  onKeyClose: (isOpen: boolean) => void;
}

const EditableTextCard: React.FC<EditableTextCardProps> = ({
  locale,
  translation,
  onKeyChange,
  onKeySubmit,
  onKeyClose,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const translations = useMemo(
    () => Object.keys(translation.translations),
    [translation.translations]
  );

  const defaultLocaleTranslationValue =
    (translation.translations as any)[locale]?.value ?? "no translation";

  const handleOnTranslationValueChange = (locale: string, value: string) => {
    console.log("handleOnTranslationValueChange", locale, value);
  };

  const [translationLength, availableLocaleLength, isComplete] = useMemo(() => {
    const translationLength = translations.length;
    const availableLocaleLength = availableLocales.length;
    return [
      translationLength,
      availableLocaleLength,
      translationLength === availableLocaleLength,
    ];
  }, []);

  return (
    <Container>
      <Summary
        onClick={() => {
          if (isOpen) {
            onKeyClose(!isOpen);
          }
          setIsOpen(!isOpen);
        }}
      >
        <KeyInformation>
          <KeyName>{translation.key}</KeyName>
          <KeyTranslation>{defaultLocaleTranslationValue}</KeyTranslation>
        </KeyInformation>
        <BadgeRow>
          <Badge data-success={isComplete && "true"}>
            {`${translationLength}/${availableLocaleLength}`}
          </Badge>
          {/* <DropdownIcon
            src="/assets/icons/mdi_arrow_drop_down_round.svg"
            style={{
              transform: isOpen ? "rotate(180deg)" : undefined,
            }}
          /> */}
          <svg
            width="25"
            height="25"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ transform: isOpen ? "rotate(180deg)" : undefined }}
          >
            <path
              d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
        </BadgeRow>
      </Summary>
      {isOpen && (
        <KeyList>
          {translations.map((key, i) => {
            const keyId = translation.id;
            const localekey = key;
            const localeTranslationAsset = (translation.translations as any)[
              localekey
            ] as assets.RawAsset;
            const localeTranslationValue = localeTranslationAsset.value;
            return (
              <TranslationFieldRow
                keyId={keyId}
                key={keyId + i}
                locale={localekey}
                initialValue={localeTranslationValue}
                onChange={onKeyChange}
                onSubmit={onKeySubmit}
              />
            );
          })}
        </KeyList>
      )}
    </Container>
  );
};

export default EditableTextCard;

const Container = styled.div`
  border: 1px solid #cfcfcf;
  border-radius: 8px;
  margin-bottom: 12px;
`;

const Summary = styled.div`
  padding: 16px 24px;
  margin: 0;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
`;

const KeyInformation = styled.div`
  display: flex;
  flex-direction: column;
`;

const KeyName = styled.h2`
  margin: 0;
  font-weight: normal;
  font-size: 16px;
  line-height: 1.2;
  color: #151617;
`;

const KeyTranslation = styled.p`
  margin: 0;
  margin-top: 8px;
  font-size: 14px;
  line-height: 1.2;
  color: #717278;
`;

const BadgeRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: auto;
`;

const Badge = styled.span`
  background-color: #fcd6d6;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1.2;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3px 8px;
  color: #ff5353;

  &[data-success="true"] {
    background-color: #ddffde;
    color: #62d066;
  }
`;

const DropdownIcon = styled.img`
  height: 20px;
  width: 20px;
  margin-left: 4px;
  user-select: none;
  -webkit-user-drag: none;
`;

const KeyList = styled.ul`
  margin: 0;
  padding: 24px;
  padding-right: 15px;
  border-top: 1px solid #cfcfcf;
  list-style-type: none;
`;
