module.exports = {
	semi: false,
	singleQuote: true,
	trailingComma: 'all',
	useTabs: true,
	overrides: [
		{
			files: '*.md',
			options: {
				useTabs: false,
				trailingComma: 'none',
			},
		},
		{
			files: '*.json',
			options: {
				useTabs: false,
				tabWidth: 2,
			},
		},
	],
}
