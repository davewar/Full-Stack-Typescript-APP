import React from 'react';
import { SpinnerCircular } from 'spinners-react';

const Loading = () => {
	return (
		<>
			<center
				style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					height: '100vh',
				}}
			>
				<div>
					<SpinnerCircular color='blue' size={'150'} data-testid='loader' />
				</div>
			</center>
		</>
	);
};

export default Loading;
