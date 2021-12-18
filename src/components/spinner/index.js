import { ReactComponent as SpinnerSvg } from "../../assets/spinner.svg";
import "./index.css";

function Spinner() {
	return (
		<div className="spinner-container">
			<SpinnerSvg />
		</div>
	);
}

export default Spinner;
