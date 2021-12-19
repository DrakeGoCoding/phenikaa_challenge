import { ReactComponent as SpinnerSvg } from "../../assets/spinner.svg";
import "./index.css";

export default function Spinner() {
	return (
		<div className="spinner-container">
			<SpinnerSvg />
		</div>
	);
}
