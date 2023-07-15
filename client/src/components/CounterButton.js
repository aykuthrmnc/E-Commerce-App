import { useEffect } from "react";
import { useState } from "react";
import { Button, Input, InputGroup } from "reactstrap";
import { updateCartHandle } from "utils";
import { testPositiveNumber } from "../utils/regex";

const CounterButton = ({ cart }) => {
  const [count, setCount] = useState(cart.quantity);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (count && +count !== cart.quantity) {
        updateCartHandle(cart.productId, count);
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, [count]);

  return (
    <>
      <InputGroup className="input-group-sm counterBtn">
        <Button
          color="light"
          onClick={() => count > 0 && setCount(+count - 1)}
          className="d-flex align-items-center justify-content-center border border-1 fw-bold"
        >
          -
        </Button>
        <Input value={count} onChange={(e) => setCount(testPositiveNumber(e.target.value))} className="border shadow-none text-center" />
        <Button
          color="light"
          onClick={() => count < 99 && setCount(+count + 1)}
          className="d-flex align-items-center justify-content-center border border-1 fw-bold"
        >
          +
        </Button>
      </InputGroup>
    </>
  );
};

export default CounterButton;
