export default {
	shouldWarn: false,
	beVerbose: false,
	_consolePrefix: `Slim Templates: `,
	warnings: {
		missingTypeAttribute: `An attribute called "type" should exist on the template container.`,
		incorrectTypeAttribute: `The attribute "type" on the template container should have a value of "slim-template".`,
		templateNotInScriptTag: `Templates should be placed inside of a script tag.`
	},
	errors: {
		syntaxErrorWhileCompilingTemplate: `A Syntax Error occurred while compiling your template.`
	},
	standardOutput: function (consoleMethod, previousArgs) {
		window.setTimeout(() => {
			var args = [].slice.call(previousArgs);
			args.unshift(this._consolePrefix);
			console[consoleMethod].apply(console, args);
		}, 1);
	},
	warn: function () {
		if (this.shouldWarn) this.standardOutput('warn', arguments);
	},
	error: function () {
		this.standardOutput('error', arguments);
	},
	info: function () {
		if (this.beVerbose) this.standardOutput('info', arguments);
	},
	log: function () {
		this.standardOutput('log', arguments);
	}
};
