import React from 'react';
import './projects.css';

const SearchForm = ({
	search,
	setSearch,
	radio,
	setRadio,
	paidRadio,
	setPaidRadio,
}) => {
	return (
		<>
			<h2 className='text-center'>Search</h2>

			<form>
				<div className='form-group'>
					<input
						type='text'
						autoComplete='off'
						name='search'
						id='search'
						placeholder='Search....'
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						autoFocus
					/>
				</div>

				<div className='form-group'>
					<fieldset>
						<legend>Projected Completed</legend>

						<label className='radio-container' htmlFor='all'>
							<input
								type='radio'
								id='all'
								name='project'
								value='all'
								checked={radio === 'all'}
								onChange={(e) => setRadio(e.target.value)}
							/>
							All
						</label>

						<label className='radio-container' htmlFor='completed'>
							<input
								type='radio'
								id='completed'
								name='project'
								value='completed'
								checked={radio === 'completed'}
								onChange={(e) => setRadio(e.target.value)}
							/>
							Completed
						</label>

						<label className='radio-container' htmlFor='not-completed'>
							<input
								type='radio'
								id='not-completed'
								name='project'
								value='not-completed'
								checked={radio === 'not-completed'}
								onChange={(e) => setRadio(e.target.value)}
							/>
							Not Completed
						</label>
					</fieldset>
				</div>
				<div className='form-group'>
					<fieldset>
						<legend>Payment Settled</legend>

						<label className='radio-container' htmlFor='all'>
							<input
								type='radio'
								id='all'
								name='paid'
								value='all'
								checked={paidRadio === 'all'}
								onChange={(e) => setPaidRadio(e.target.value)}
							/>
							All
						</label>

						<label className='radio-container' htmlFor='completed'>
							<input
								type='radio'
								id='completed'
								name='paid'
								value='completed'
								checked={paidRadio === 'completed'}
								onChange={(e) => setPaidRadio(e.target.value)}
							/>
							Completed
						</label>

						<label className='radio-container' htmlFor='not-completed'>
							<input
								type='radio'
								id='not-completed'
								name='paid'
								value='not-completed'
								checked={paidRadio === 'not-completed'}
								onChange={(e) => setPaidRadio(e.target.value)}
							/>
							Not Completed
						</label>
					</fieldset>
				</div>
			</form>
		</>
	);
};

export default SearchForm;
