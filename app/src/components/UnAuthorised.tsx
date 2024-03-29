import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
	const navigate = useNavigate();

	const goBack = (): void => navigate(-1);

	return (
		<center id='unauthorized'>
			<h1>Unauthorized</h1>
			<br />
			<p>You do not have access to the requested page.</p>
			<div>
				<button onClick={goBack}>Go Back</button>
			</div>
		</center>
	);
};

export default Unauthorized;
