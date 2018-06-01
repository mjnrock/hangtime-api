class RegEx {
	constructor() {
		this.Rules = {
			TSQL: {
				Default: /^DEFAULT$/i,
				Null: /^NULL$/i
			},
			UUID: /^[A-F\d]{8}-[A-F\d]{4}-4[A-F\d]{3}-[89AB][A-F\d]{3}-[A-F\d]{12}$/i,
			String: {
				Alpha: /^[a-zA-Z]{1,}$/i,
				AlphaSpace: /^[a-zA-Z ]{1,}$/i,
				AlphaNum: /^[a-zA-Z0-9]{1,}$/,
				AlphaNumSpace: /^[a-zA-Z0-9 ]{1,}$/,
				Upper: /^[A-Z]{1,}$/i,
				UpperSpace: /^[A-Z ]{1,}$/i,
				Lower: /^[a-z]{1,}$/i,
				LowerSpace: /^[a-z ]{1,}$/i
			},
			Numeric: {
				Integer: /^[-+]?\d+$/,
				Real: /^[-+]?([0-9]{1,3},([0-9]{3},)*[0-9]{3}|[0-9]+)?(\.[0-9]*)?$/,
				Percent: /^100(\.0{0,2}?)?$|^\d{0,2}(\.\d{0,2})?$/,
				Latitude: /^-?([1-8]?[0-9]\.{1}\d{1,}$|90\.{1}0{1,}$)/,	// 6+ decimals, though allowed, is not physically realistic (i.e. millimeter precision)
				Longitude: /^-?((([1]?[0-7][0-9]|[1-9]?[0-9])\.{1}\d{1,}$)|[1]?[1-8][0]\.{1}0{1,}$)/	// 6+ decimals, though allowed, is not physically realistic (i.e. millimeter precision)
			},
			Color: {
				Hex: /^#(\d{6})|^#([A-F]{6})|^#([A-F]|[0-9]){6}/i
			}
		};
	}

	IsMatch(input, rule) {
		return rule.test(input);
	}

	IsValid(...args) {
		if(args.length % 2 !== 0) {
			return false;
		}

		let collector = [];
		args.forEach((v, i) => {
			if(i % 2 === 0) {
				collector.push(this.IsMatch(v, args[i + 1]));
			}
		});

		return !collector.includes(false);
	}
}

module.exports = RegEx;