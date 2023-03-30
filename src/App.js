import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
import "./styles.css";

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  CHOOSE_OPERATION: 'choose-operation',
  EVALUATE: 'evaluate'
}

function reducer(state, { type, payload }) {
  switch(type) {
    case ACTIONS.ADD_DIGIT:

      //clear the display after '=' (or EVALUATE) is used
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }
      if (payload.digit === "0" && state.currentOperand === "0") return state;
      if (payload.digit === "." && state.currentOperand.includes(".")) return state;
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
      }

      // adds function to the 'AC' button to clear the display
    case ACTIONS.CLEAR:
      return {}

    // give the 'DEL' button the correct function, to remove the last digit &/or clear the display (after '=') using the overwrite status
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null
        }
      }
      if (state.currentOperand == null) return state
      if (state.currentOperand.length === 1) {
        return { ...state, currentOperand: null}
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }

      break
      // define the '=' button function
    case ACTIONS.EVALUATE: 
      if (state.operation == null || 
        state.currentOperand == null || 
        state.previousOperand == null
        ) {
        return state 
      }

      return {
        ...state,
        overwrite: true, //overwrite the display
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      }
      
      break

    case ACTIONS.CHOOSE_OPERATION:

      //don't show any operation if nothing in the display
      if (state.currentOperand == null && state.previousOperand == null) {
        return state
      }
      
      // use to correct when you choose the wrong operation
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        }
      }

      // show the previous state in the previous operation display
      if (state.previousOperand == null ){
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null
        }
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      }
      default:
  }
}

//don't remove the zero from the display
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {maximumFractionDigits: 0,
})

// add ',' to the integer portion of the number in display
function formatOperand (operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split('.')
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}` //don't format the decimal portion
}

function evaluate ({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if (isNaN(prev) || isNaN(current)) return " "
  let computation = ""
  switch (operation) {
    case "+":
      computation = prev + current
      break
    case "-":
      computation = prev - current
      break
    case "*":
      computation = prev * current
      break
    case "÷":
      computation = prev / current
      break
    
      default:
  }
  return computation.toString();
}

function App() {

  const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer, {})

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{formatOperand(previousOperand)} {operation}</div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
    </div>
  );
}

export default App;
