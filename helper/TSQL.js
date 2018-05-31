class TSQL {
	constuctor() {
		this.DataType = {
			INT: {
				Value: 1,
				Rule: Enum.Rules.Number.Integer
			}
		};
	}
}

module.exports = TSQL;