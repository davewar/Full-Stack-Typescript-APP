import React from 'react';
import { Helmet } from 'react-helmet-async';
export default function Seo({ title, description, name, type, url, image }) {
	return (
		<Helmet>
			{/* Standard metadata tags */}
			{title && <title>{title}</title>}
			{description && <meta name='description' content={description} />}
			{url && <link rel='canonical' href={url}></link>}
			{/* End standard metadata tags */}

			{/* Facebook tags */}
			<meta property='og:locale' content='en_GB' />
			{type && <meta property='og:type' content={type} />}
			{title && <meta property='og:title' content={title} />}
			{description && <meta property='og:description' content={description} />}
			{url && <meta property='og:url' content={url} />}
			{name && <meta property='og:site_name' content={name} />}
			{image && <meta property='og:image' content={image} />}
			{/* End Facebook tags */}

			{/* Twitter tags */}
			{name && <meta name='twitter:creator' content={name} />}
			{type && <meta name='twitter:card' content={type} />}
			{title && <meta name='twitter:title' content={title} />}
			{description && <meta name='twitter:description' content={description} />}
			{/* End Twitter tags */}
		</Helmet>
	);
}
