type Params = {
	[key: string]: string | number | undefined;
};

export class ApiBuilder {
	private baseUrl: string;
	private pathParams: Params = {};
	private queryParams: Params = {};

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
	}

	path(key: string, value: string | number): ApiBuilder {
		this.pathParams[key] = value;
		return this;
	}

	query(key: string, value: string | number | undefined): ApiBuilder {
		if (value !== undefined) {
			this.queryParams[key] = value;
		}
		return this;
	}

	build(): string {
		let url = this.baseUrl;

		// Replace path parameters
		Object.entries(this.pathParams).forEach(([key, value]) => {
			if (value !== undefined) {
				url = url.replace(`:${key}`, value.toString());
			}
		});

		// Add query parameters
		const queryString = Object.entries(this.queryParams)
			.filter(
				([, value]) =>
					value !== undefined && value !== null && value !== ""
			)
			.map(([key, value]) => {
				const stringValue = value?.toString() ?? "";
				return `${key}=${encodeURIComponent(stringValue)}`;
			})
			.join("&");

		return queryString ? `${url}?${queryString}` : url;
	}
}
