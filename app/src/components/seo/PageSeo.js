import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { metaData } from '../../constants/metaData';
import Seo from '../../components/seo/Seo';

const PageSeo = () => {
	const [seoPage, setSeoPage] = useState('./');

	let location = useLocation(null);

	useEffect(() => {
		let newSeoPath = location.pathname;
		setSeoPage(newSeoPath);
	}, [location]);

	return (
		<>
			{metaData
				.filter((item) => item.page === seoPage)
				.map((i) => {
					return (
						<Seo
							key={i.id}
							title={i.title}
							description={i.description}
							name={i.name}
							type={i.type}
							url={i.url}
							image={i.image}
						/>
					);
				})}
		</>
	);
};

export default PageSeo;
