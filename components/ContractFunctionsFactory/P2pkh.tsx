import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { StyleSheet, TextInput, View } from "react-native";

import { bchjs } from "../../utils/bch-js-utils";
import { T, Spacer } from "../../atoms";

const StyledTextInput = styled(TextInput)`
  border-color: ${props => props.theme.accent500};
  border-width: ${StyleSheet.hairlineWidth};
  border-radius: 3px;
  padding: 16px 8px;
`;

type Props = {
  inputValues: any;
  setInputValues: Function;
  address: string;
};

const ConstructorView = ({ inputValues }: Props) => {
  return (
    <View>
      <T>Your Public Key Hash</T>
      <Spacer tiny />
      <StyledTextInput editable={false} multiline value={inputValues.pkh} />
    </View>
  );
};

const constructorValidate = (inputValues: any) => {
  return {
    hasErrors: false,
    errorMessage: [],
    parsedParams: [Buffer.from(inputValues.pkh, "hex")]
  };
};

const defaultConstructorValues = (address: string) => ({
  pkh: bchjs.Address.toHash160(address)
});

const SpendView = ({ address }: Props) => {
  const [toAddress, setToAddress] = useState(address || "");

  useEffect(() => {
    setToAddress(address);
  }, [address]);

  return (
    <View>
      <T>Send To:</T>
      <Spacer tiny />
      <StyledTextInput
        editable={true}
        placeholder="bitcoincash:"
        multiline
        value={toAddress}
        onChangeText={text => {
          setToAddress(text);
        }}
      />
    </View>
  );
};

const spendValidate = () => {
  return {
    hasErrors: false,
    errorMessage: [],
    parsedParams: []
  };
};

const P2PKHFunctionsFactory = {
  build: (fnName: string) => {
    if (fnName === "Constructor") {
      return {
        InputsView: ConstructorView,
        inputsValidate: constructorValidate,
        defaultInputValues: defaultConstructorValues,
        options: {}
      };
    }

    if (fnName === "spend") {
      return {
        InputsView: SpendView,
        inputsValidate: spendValidate,
        defaultInputValues: () => ({}),
        options: {
          requiresPk: true,
          requiresSig: true,
          showAmountInput: true
        }
      };
    }
  }
};

export default P2PKHFunctionsFactory;
