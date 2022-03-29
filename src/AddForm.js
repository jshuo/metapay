import React, { useState } from "react";
import {
  ToggleButton,
  ButtonGroup,
  InputGroup,
  Container
} from "react-bootstrap";

export default function AddForm() {
  const [checked, setChecked] = useState(false);
  const [radioValue, setRadioValue] = useState("foo");
  const radios = [
    { name: "USDT", value: "foo" },
    { name: "USDC", value: "bar" },
    { name: "TerraUSD", value: "baz" }
  ];
  return (
    <Container>
      <br />
      <ButtonGroup toggle>
        {radios.map((radio, index) => (
          <ToggleButton
            key={index}
            type="radio"
            name="radio"
            value={radio.value}
            checked={radioValue === radio.value}
            onChange={(e) => setRadioValue(e.currentTarget.value)}
          >
            {radio.name}
          </ToggleButton>
        ))}
      </ButtonGroup>
    </Container>
  );
}
