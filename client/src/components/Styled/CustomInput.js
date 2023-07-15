import styled from "styled-components";

const CustomInput = () => {
  const InputData = styled.div`
    height: 40px;
    width: 200px;
    position: relative;

    input {
      height: 100%;
      width: 100%;
      border: none;
      font-size: 17px;
      border-bottom: 2px solid #ccc;

      :focus ~ .underline:before {
        transform: scaleX(1);
      }

      :focus ~ label {
        transform: translateY(-20px);
        font-size: 15px;
        bottom: 15px;
      }
    }

    .underline {
      position: absolute;
      height: 2px;
      width: 100%;
      bottom: 0;

      &:before {
        position: absolute;
        content: "";
        height: 100%;
        width: 100%;
        background: #4158d0;
        transform: scaleX(0);
        transform-origin: center;
        transition: transform 0.3s ease;
      }
    }

    label {
      position: absolute;
      bottom: 10px;
      left: 0;
      color: #666;
      transition: all 0.3s ease;
    }
  `;

  return (
    <InputData>
      <input type="text" />
      <div className="underline"></div>
      <label>Username</label>
    </InputData>
  );
};

export default CustomInput;
