class RegEx {
	constructor() {
		this.Rules = {
			UUID: /^[A-F\d]{8}-[A-F\d]{4}-4[A-F\d]{3}-[89AB][A-F\d]{3}-[A-F\d]{12}$/i,
			Numeric: {
				Integer: /^[-+]?\d+$/g,
				Real: /^([0-9]{1,3},([0-9]{3},)*[0-9]{3}|[0-9]+)?(\.[0-9]*)?$/g,
				Percent: /^100(\.0{0,2}?)?$|^\d{0,2}(\.\d{0,2})?$/g,
				Latitude: /^-?([1-8]?[0-9]\.{1}\d{1,6}$|90\.{1}0{1,6}$)/g,
				Longitude: /^-?((([1]?[0-7][0-9]|[1-9]?[0-9])\.{1}\d{1,6}$)|[1]?[1-8][0]\.{1}0{1,6}$)/g
			},
			Color: {
				Hex: /^#(\d{6})|^#([A-F]{6})|^#([A-F]|[0-9]){6}/g
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